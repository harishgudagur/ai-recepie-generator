const express = require("express");
const router = express.Router();

const {
  generateRecipe,
  getRecipes,
  deleteRecipe,
  toggleFavorite,
} = require("../controllers/recipeController");

router.post("/generate", generateRecipe);
router.get("/", getRecipes);
router.delete("/:id", deleteRecipe);
router.put("/favorite/:id", toggleFavorite);

module.exports = router;