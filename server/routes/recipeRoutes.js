const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  generateRecipe,
  analyzeImage,
  generateSuggestions,
  getHistory
} = require("../controllers/recipeController");

// File upload (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/generate", generateRecipe);
router.post("/analyze", upload.single("image"), analyzeImage);
router.post("/suggestions", generateSuggestions);
router.get("/history", getHistory);

module.exports = router;