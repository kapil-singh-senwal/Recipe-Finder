import React from 'react';
import { Heart } from 'lucide-react';

const RecipeCard = ({ recipe, isFavorite, toggleFavorite, onOpen }) => {
  return (
    <div className="recipe-card" onClick={() => onOpen(recipe)}>
      <img src={recipe.thumbnail} alt={recipe.name} className="recipe-image" />
      <div className="recipe-info">
        <div className="recipe-header">
          <div>
            <h3 className="recipe-title">{recipe.name}</h3>
            <div className="recipe-category">{recipe.category}</div>
            <div className="recipe-origin">{recipe.origin}</div>
          </div>
          <button 
            className={`fav-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={(e) => toggleFavorite(recipe, e)}
          >
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
