# 🍳 Recipe Finder

A modern, responsive web application for discovering and saving your favorite recipes. Built with **React** and **Vite**.

## ✨ Features

- **Smart Search**: Real-time recipe search with auto-suggestions.
- **Recipe Cards**: Beautiful card layout displaying recipe information.
- **Favorites System**: Save and manage your favorite recipes using LocalStorage.
- **Detailed View**: Interactive modal displaying full recipe details, ingredients, and instructions.
- **Responsive Design**: Mobile-first approach, working seamlessly on desktop, tablet, and mobile.
- **Modern UI**: Clean interface with smooth animations and gradient styling.

## 🚀 Tech Stack

- **React 18**: Component-based UI library.
- **Vite**: Next Generation Frontend Tooling for fast builds and HMR.
- **Lucide React**: Beautiful & consistent icons.
- **CSS3**: Modern styling with Grid, Flexbox, and CSS Variables.
- **TheMealDB API**: Free JSON API for recipe data.

## 📂 Project Structure

```
recipe-finder/
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Navigation and favorites counter
│   │   ├── SearchBar.jsx    # Search input and suggestions
│   │   ├── RecipeCard.jsx   # Individual recipe display component
│   │   └── RecipeModal.jsx  # Full recipe details view
│   ├── App.jsx              # Main application logic and state
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles and variables
├── index.html               # Entry HTML file
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

## 🛠️ Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/kapil-singh-senwal/Recipe-Finder.git
   cd Recipe-Finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 API Integration

This project uses [TheMealDB API](https://www.themealdb.com/api.php) to fetch recipe data.
- **Search Endpoint**: `https://www.themealdb.com/api/json/v1/1/search.php?s={query}`
- **Data Points**: Includes recipe names, categories, areas, instructions, and ingredient measurements.

## 💾 Data Persistence

- **LocalStorage**: User favorites are persisted in the browser's local storage (`favoriteRecipes` key), ensuring data remains available across sessions.

## 📝 Future Enhancements

- Recipe categories filter
- Advanced search options (by ingredient, category)
- Social sharing functionality
- Nutritional information display

---

Built with ❤️ using React & Vite
