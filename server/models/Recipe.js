const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: String,
    ingredients: [String],
    content: String,
    diet: String,
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Recipe", recipeSchema);