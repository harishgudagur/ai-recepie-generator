const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  generateRecipe,
  analyzeImage,
  generateSuggestions,
  getRecipes,
  deleteRecipe,
  toggleFavorite,
} = require("../controllers/recipeController");

const upload = multer({ storage: multer.memoryStorage() });

// existing
router.post("/generate", generateRecipe);
router.post("/suggestions", generateSuggestions);
router.post("/analyze", upload.single("image"), analyzeImage);

// ✅ ADD THESE
router.get("/", getRecipes);
router.delete("/:id", deleteRecipe);
router.put("/favorite/:id", toggleFavorite);

module.exports = router;