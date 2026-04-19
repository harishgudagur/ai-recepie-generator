const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  generateRecipe,
  analyzeImage,
  generateSuggestions,
} = require("../controllers/recipeController");

// IMPORTANT: multer used here
router.post("/analyze", upload.single("image"), analyzeImage);

router.post("/generate", generateRecipe);
router.post("/suggestions", generateSuggestions);

module.exports = router;