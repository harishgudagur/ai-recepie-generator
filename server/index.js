const express = require("express");
const cors = require("cors");

const recipeRoutes = require("./routes/recipeRoutes");

const app = express(); // ✅ MUST come before app.use

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/recipes", recipeRoutes);

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});