import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';

const App = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteRecipes');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const suggestions = ['vegetable', 'salad', 'pasta', 'chicken'];

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const transformApiData = (meals) => {
    return meals.map(meal => {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients.push({
            item: ingredient.trim(),
            measure: measure ? measure.trim() : ''
          });
        }
      }

      return {
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory,
        origin: meal.strArea,
        thumbnail: meal.strMealThumb,
        ingredients: ingredients,
        instructions: meal.strInstructions
      };
    });
  };

  const searchRecipes = async (query) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.meals) {
        setCurrentRecipes(transformApiData(data.meals));
      } else {
        setCurrentRecipes([]);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchRecipes(searchQuery);
      } else {
        setCurrentRecipes([]);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const toggleFavorite = (recipe, e) => {
    if (e) e.stopPropagation();
    const isFav = favorites.some(fav => fav.id === recipe.id);
    if (isFav) {
      setFavorites(favorites.filter(fav => fav.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const isFavorite = (recipeId) => favorites.some(fav => fav.id === recipeId);

  return (
    <div className="app">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        favoritesCount={favorites.length} 
      />

      <main>
        {activeSection === 'home' ? (
          <section className="container">
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              suggestions={suggestions} 
            />

            <div className="recipes-container">
              {isLoading ? (
                <div className="loading">
                  Searching for recipes...
                  <div className="loading-spinner"></div>
                </div>
              ) : error ? (
                <div className="welcome-message">
                  <h2>Oops! {error}</h2>
                </div>
              ) : currentRecipes.length > 0 ? (
                currentRecipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    isFavorite={isFavorite(recipe.id)} 
                    toggleFavorite={toggleFavorite} 
                    onOpen={setSelectedRecipe} 
                  />
                ))
              ) : searchQuery ? (
                <div className="welcome-message">
                  <h2>No recipes found</h2>
                  <p>Try searching for something else</p>
                </div>
              ) : (
                <div className="welcome-message">
                  <h2>Welcome to Recipe Finder!</h2>
                  <p>Start typing to search for delicious recipes</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="container">
            <h2>Your Favorite Recipes</h2>
            <div className="recipes-container">
              {favorites.length > 0 ? (
                favorites.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    isFavorite={true} 
                    toggleFavorite={toggleFavorite} 
                    onOpen={setSelectedRecipe} 
                  />
                ))
              ) : (
                <div className="no-favorites">
                  <p>No favorite recipes yet. Start exploring and add some!</p>
                </div>
              )}
            </div>
          </section>
        )}

        <RecipeModal 
          recipe={selectedRecipe} 
          isFavorite={selectedRecipe ? isFavorite(selectedRecipe.id) : false} 
          toggleFavorite={toggleFavorite} 
          onClose={() => setSelectedRecipe(null)} 
        />
      </main>
    </div>
  );
};

export default App;
