import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const API = "https://ai-recepie-generator.onrender.com";

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

  // 🔹 Generate Recipe
  const getRecipe = async () => {
    try {
      setLoading(true);
      setError("");
      setRecipe("");
      setSuggestions([]);

      const cleaned =
        finalIngredients.length > 0
          ? finalIngredients
          : ingredients.split(",").map(i => i.trim()).filter(i => i);

      if (cleaned.length === 0) {
        setError("⚠️ Enter ingredients or upload image");
        return;
      }

      const res = await axios.post(`${API}/api/recipes/generate`, {
        ingredients: cleaned,
        diet,
      });

      setRecipe(res.data.recipe);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch recipe");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Detect Ingredients from Image
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
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const detected = detectRes.data.ingredients || [];

      if (detected.length === 0) {
        setError("❌ Could not detect ingredients");
        return;
      }

      setFinalIngredients(detected);
      setIngredients(detected.join(", "));

      const recipeRes = await axios.post(
        `${API}/api/recipes/generate`,
        { ingredients: detected, diet }
      );

      setRecipe(recipeRes.data.recipe);
    } catch (err) {
      console.error(err);
      setError("❌ Image processing failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Suggestions
  const getSuggestions = async () => {
    try {
      const cleaned = ingredients
        .split(",")
        .map(i => i.trim())
        .filter(i => i);

      if (cleaned.length === 0) {
        setError("⚠️ Enter ingredients first");
        return;
      }

      const res = await axios.post(
        `${API}/api/recipes/suggestions`,
        { ingredients: cleaned }
      );

      setSuggestions(res.data.suggestions || []);
    } catch {
      setError("❌ Failed to fetch ideas");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🍳 AI Recipe Generator</h2>

        <input
          value={ingredients}
          onChange={(e) => {
            setIngredients(e.target.value);
            setFinalIngredients([]);
          }}
          placeholder="Enter ingredients"
          style={styles.input}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            style={styles.preview}
          />
        )}

        <button onClick={handleImageUpload} style={styles.secondaryBtn}>
          Detect Ingredients
        </button>

        <select value={diet} onChange={(e) => setDiet(e.target.value)}>
          <option value="">Normal</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
        </select>

        <button onClick={getRecipe} style={styles.button}>
          Generate Recipe
        </button>

        <button onClick={getSuggestions} style={styles.secondaryBtn}>
          Get Ideas
        </button>

        {loading && <p>⏳ Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {recipe && (
          <div style={styles.output}>
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        )}
      </div>

      <button onClick={() => navigate("/history")}>
        📜 View History
      </button>
    </div>
  );
}

const styles = {
  page: { textAlign: "center", padding: "30px" },
  card: { maxWidth: "500px", margin: "auto" },
  input: { width: "100%", padding: "10px", margin: "10px 0" },
  preview: { width: "100%", margin: "10px 0" },
  button: { background: "green", color: "white", padding: "10px", width: "100%" },
  secondaryBtn: { background: "blue", color: "white", padding: "10px", width: "100%", marginTop: "10px" },
  output: { marginTop: "20px", textAlign: "left" }
};

export default App;