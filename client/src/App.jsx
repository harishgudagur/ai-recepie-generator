import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState("");
  const [finalIngredients, setFinalIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diet, setDiet] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

const API = "https://ai-recepie-generator.onrender.com";
  // 🔹 Generate Recipe
  const getRecipe = async () => {
    try {
      setLoading(true);
      setError("");
      setRecipe("");
      setSuggestions([]);

      let cleaned =
        finalIngredients.length > 0
          ? finalIngredients
          : ingredients.split(",").map(i => i.trim()).filter(i => i);

      if (cleaned.length === 0) {
        setError("⚠️ Enter ingredients or upload image");
        return;
      }

      const res = await axios.post(
        `${API}/api/recipes/generate`,
        { ingredients: cleaned, diet }
      );

      setRecipe(res.data.recipe);
    } catch {
      setError("❌ Failed to fetch recipe");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Detect + Auto Generate
  const handleImageUpload = async () => {
    if (!image) {
      setError("⚠️ Please select an image");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRecipe("");
      setSuggestions([]);

      const formData = new FormData();
      formData.append("image", image);

      const detectRes = await axios.post(
        `${API}/api/recipes/analyze`,
        formData
      );

      const detected = detectRes.data.ingredients;

      setFinalIngredients(detected);
      setIngredients(detected.join(", "));

      const recipeRes = await axios.post(
        `${API}/api/recipes/generate`,
        { ingredients: detected, diet }
      );

      setRecipe(recipeRes.data.recipe);
    } catch {
      setError("❌ Image processing failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Suggestions
  const getSuggestions = async () => {
    try {
      const cleaned = ingredients.split(",").map(i => i.trim());

      const res = await axios.post(
        `${API}/api/recipes/suggestions`,
        { ingredients: cleaned }
      );

      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      {/* CARD */}
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <span style={styles.icon}>🍳</span>
          <h1 style={styles.title}>AI Recipe Generator</h1>
        </div>

        {/* INPUT */}
        <input
          value={ingredients}
          onChange={(e) => {
            setIngredients(e.target.value);
            setFinalIngredients([]);
          }}
          placeholder="Enter ingredients (e.g. egg, bread)"
          style={styles.input}
        />

        {/* IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={styles.file}
        />

        {/* PREVIEW */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            style={styles.preview}
          />
        )}

        {/* DETECT */}
        <button onClick={handleImageUpload} style={styles.secondaryBtn}>
          Detect Ingredients
        </button>

        {/* DIET */}
        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          style={styles.select}
        >
          <option value="">🍽 Normal</option>
          <option value="vegan">🥗 Vegan</option>
          <option value="keto">🥩 Keto</option>
        </select>

        {/* GENERATE */}
        <button onClick={getRecipe} style={styles.button}>
          Generate Recipe
        </button>

        {/* IDEAS */}
        <button onClick={getSuggestions} style={styles.secondaryBtn}>
          Get Ideas
        </button>

        {/* LOADING */}
        {loading && <div style={styles.spinner}></div>}

        {/* ERROR */}
        {error && <p style={styles.error}>{error}</p>}

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div style={styles.suggestions}>
            <h3>💡 Ideas</h3>
            {suggestions.map((s, i) => (
              <p key={i}>👉 {s}</p>
            ))}
          </div>
        )}

        {/* RESULT */}
        {recipe && <hr style={styles.divider} />}

        {recipe && (
          <div style={styles.output}>
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* ✅ HISTORY BUTTON BELOW CARD */}
      <div style={styles.historyWrapper}>
        <button
          onClick={() => navigate("/history")}
          style={styles.historyBtn}
        >
          📜 View History
        </button>
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
    padding: "20px",
  },

  card: {
    width: "500px",
    maxWidth: "95%",
    padding: "30px",
    borderRadius: "20px",
    background: "#0b1220",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },

  icon: { fontSize: "28px" },
  title: { fontSize: "26px", margin: 0 },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "12px",
  },

  file: { marginBottom: "10px" },

  preview: {
    width: "100%",
    maxHeight: "250px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "12px",
  },

  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "12px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#22c55e",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "12px",
  },

  secondaryBtn: {
    width: "100%",
    padding: "10px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "10px",
    color: "white",
    marginTop: "8px",
    cursor: "pointer",
  },

  historyWrapper: {
    marginTop: "20px",
  },

  historyBtn: {
    padding: "10px 20px",
    background: "#64748b",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  spinner: {
    width: "40px",
    height: "40px",
    margin: "15px auto",
    border: "4px solid #334155",
    borderTop: "4px solid #22c55e",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  error: {
    marginTop: "10px",
    color: "#f87171",
  },

  suggestions: {
    marginTop: "15px",
    textAlign: "left",
  },

  divider: {
    margin: "20px 0",
    borderColor: "#334155",
  },

  output: {
    marginTop: "10px",
    background: "#1e293b",
    padding: "18px",
    borderRadius: "12px",
    textAlign: "left",
    lineHeight: "1.7",
    fontSize: "15px",
  },
};

export default App;