import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function History() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ✅ Use your Render backend
  const API_URL = "https://ai-recepie-generator.onrender.com/api/recipes";

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecipes(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchRecipes();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      await axios.put(`${API_URL}/favorite/${id}`);
      fetchRecipes();
    } catch (err) {
      console.error("Favorite error:", err.message);
    }
  };

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📜 Recipe History</h1>

        {/* SEARCH */}
        <input
          placeholder="🔍 Search recipes..."
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {/* LIST */}
        <div style={styles.grid}>
          {filtered.map((r) => (
            <div key={r._id} style={styles.card}>
              <h3>
                {r.title} {r.favorite && "⭐"}
              </h3>

              <p style={{ opacity: 0.8 }}>
                {r.ingredients.join(", ")}
              </p>

              <div style={styles.actions}>
                <button
                  onClick={() => toggleFavorite(r._id)}
                  style={styles.favBtn}
                >
                  ⭐
                </button>

                <button
                  onClick={() => deleteRecipe(r._id)}
                  style={styles.deleteBtn}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BACK */}
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
    padding: "20px",
  },

  container: {
    maxWidth: "900px",
    margin: "auto",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  search: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "none",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  favBtn: {
    background: "#facc15",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  backBtn: {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    background: "#3b82f6",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },
};

export default History;