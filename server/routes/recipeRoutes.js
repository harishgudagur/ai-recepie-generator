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

router.post("/generate", generateRecipe);
router.post("/analyze", upload.single("image"), analyzeImage);
router.post("/suggestions", generateSuggestions);

// ✅ IMPORTANT (fix 404 error)
router.get("/", getRecipes);

router.delete("/:id", deleteRecipe);
router.put("/favorite/:id", toggleFavorite);

module.exports = router;