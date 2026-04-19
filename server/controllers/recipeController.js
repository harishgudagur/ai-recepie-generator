const { groq } = require("../config/gemini");
const Recipe = require("../models/Recipe");

// 🔹 Generate Recipe
exports.generateRecipe = async (req, res) => {
  try {
    let { ingredients, diet } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Invalid ingredients" });
    }

    ingredients = ingredients.map(i => i.trim()).filter(i => i);
    ingredients = [...new Set(ingredients.map(i => i.toLowerCase()))];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Create a ${diet || "normal"} recipe using: ${ingredients.join(", ")}.

Return STRICTLY in this format:

## Title

## Ingredients
- item

## Steps
1. step`,
        },
      ],
    });

    const recipeText = response.choices[0].message.content;

    const titleLine = recipeText.split("\n").find(l => l.includes("##")) || "Recipe";
    const title = titleLine.replace("##", "").trim();

    const saved = await Recipe.create({
      title,
      ingredients,
      content: recipeText,
      diet,
    });

    res.json({ recipe: recipeText, id: saved._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
};

// 🔹 Get all recipes
exports.getRecipes = async (req, res) => {
  const recipes = await Recipe.find().sort({ createdAt: -1 });
  res.json(recipes);
};

// 🔹 Delete recipe
exports.deleteRecipe = async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// 🔹 Toggle favorite
exports.toggleFavorite = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  recipe.favorite = !recipe.favorite;
  await recipe.save();
  res.json(recipe);
};

// 🔹 Analyze Image
exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const base64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype;

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mime};base64,${base64}`,
              },
            },
            {
              type: "text",
              text: `Return ONLY JSON array of ingredients.
Example: ["egg","bread"]`,
            },
          ],
        },
      ],
    });

    const text = response.choices[0].message.content;

    let ingredients = [];

    try {
      ingredients = JSON.parse(text);
    } catch {
      ingredients = text
        .replace(/[\[\]]/g, "")
        .split(",")
        .map(i => i.trim())
        .filter(i => i);
    }

    res.json({ ingredients });

  } catch (err) {
    console.error("Image error:", err.message);
    res.status(500).json({ error: "Image analysis failed" });
  }
};

// 🔹 Suggestions
exports.generateSuggestions = async (req, res) => {
  try {
    let { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Invalid ingredients" });
    }

    ingredients = ingredients.map(i => i.trim()).filter(i => i);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Give 3 recipe ideas using: ${ingredients.join(", ")}.`,
        },
      ],
    });

    const suggestions = response.choices[0].message.content
      .split("\n")
      .filter(i => i);

    res.json({ suggestions });

  } catch (err) {
    console.error("Suggestions error:", err.message);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};