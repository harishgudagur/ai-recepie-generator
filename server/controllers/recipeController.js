const { groq } = require("../config/groq");
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

Return STRICTLY:

## Title
## Ingredients
- item 1
- item 2

## Steps
1. Step one
2. Step two`,
        },
      ],
    });

    const recipeText =
      response?.choices?.[0]?.message?.content ||
      "Failed to generate recipe";

    const title = recipeText.split("\n")[0];

    const saved = await Recipe.create({
      title,
      ingredients,
      content: recipeText,
      diet,
    });

    res.json({
      recipe: recipeText,
      id: saved._id,
    });

  } catch (err) {
    console.error("Generate error:", err);
    res.status(500).json({ error: "Recipe generation failed" });
  }
};

// 🔹 Analyze Image (FIXED)
exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

if (!allowedTypes.includes(req.file.mimetype)) {
  return res.status(400).json({
    error: "Only JPG, PNG, WEBP allowed",
  });
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
              text: `Return ONLY JSON array like ["egg","bread"]`,
            },
          ],
        },
      ],
    });

    const text =
      response?.choices?.[0]?.message?.content || "[]";

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
    console.error("Image error:", err);
    res.status(500).json({ error: "Image processing failed" });
  }
};

// 🔹 Suggestions
exports.generateSuggestions = async (req, res) => {
  try {
    let { ingredients } = req.body;

    ingredients = ingredients.map(i => i.trim()).filter(i => i);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Give 3 recipe ideas using: ${ingredients.join(", ")}`,
        },
      ],
    });

    const suggestions =
      response?.choices?.[0]?.message?.content
        ?.split("\n")
        .filter(i => i) || [];

    res.json({ suggestions });

  } catch (err) {
    res.status(500).json({ error: "Suggestions failed" });
  }
};

// 🔹 GET ALL RECIPES (IMPORTANT)
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// 🔹 DELETE
exports.deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};

// 🔹 FAVORITE
exports.toggleFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    recipe.favorite = !recipe.favorite;
    await recipe.save();
    res.json(recipe);
  } catch {
    res.status(500).json({ error: "Favorite failed" });
  }
};