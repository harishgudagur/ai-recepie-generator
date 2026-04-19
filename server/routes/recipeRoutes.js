const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  generateRecipe,
  analyzeImage,
  generateSuggestions,
} = require("../controllers/recipeController");

router.post("/generate", generateRecipe);
router.post("/analyze", upload.single("image"), analyzeImage);
router.post("/suggestions", generateSuggestions);

module.exports = router;