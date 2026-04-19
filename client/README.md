# 🍳 AI Recipe Generator

An AI-powered full-stack web app that generates recipes from ingredients or food images.

---

## 🚀 Features

- 🧠 AI recipe generation
- 🖼️ Image-based ingredient detection
- 🍽️ Diet options (Normal, Vegan, Keto)
- 💡 Recipe suggestions
- 📜 Recipe history (MongoDB)
- ⭐ Favorite recipes
- 🗑️ Delete recipes
- 🔍 Search functionality

---

## 🛠️ Tech Stack

Frontend:
- React.js
- Axios
- React Router
- React Markdown

Backend:
- Node.js
- Express.js

Database:
- MongoDB Atlas

AI:
- Groq API (LLaMA)

---

## ⚙️ Installation

### Backend

```bash
cd server
npm install
npm run dev


Frontend
cd client
npm install
npm run dev



🔐 Environment Variables

Create .env in server:

PORT=5000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_key
🌐 API Endpoints
POST /api/recipes/generate
POST /api/recipes/analyze
POST /api/recipes/suggestions
GET /api/recipes
DELETE /api/recipes/:id
PUT /api/recipes/favorite/:id
🚀 Deployment

Frontend: Vercel
Backend: Render

👨‍💻 Author

Harish Gudagur


