require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const recipeRoutes = require("./routes/recipeRoutes");

const app = express(); // ✅ MUST BE BEFORE app.use()

// ✅ middleware
app.use(cors());
app.use(express.json());

// ✅ routes
app.use("/api/recipes", recipeRoutes);

// ✅ test route (optional but useful)
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ✅ database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error:", err));

// ✅ server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));