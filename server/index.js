const express = require("express");
const cors = require("cors");
const recipeRoutes = require("./routes/recipeRoutes");

// ✅ THIS MUST MATCH FRONTEND
app.use("/api/recipes", recipeRoutes);
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));