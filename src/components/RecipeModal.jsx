import React from 'react';
import { X, Heart, Utensils } from 'lucide-react';

const RecipeModal = ({ recipe, isFavorite, toggleFavorite, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          <X size={24} />
        </button>
        <img src={recipe.thumbnail} alt={recipe.name} className="recipe-detail-image" />
        <div className="recipe-detail-content">
          <div className="recipe-detail-header">
            <div>
              <h2 className="recipe-detail-title">{recipe.name}</h2>
              <div className="recipe-detail-meta">
                <span className="recipe-category">{recipe.category}</span>
                <span className="recipe-origin">{recipe.origin}</span>
              </div>
            </div>
            <button 
              className={`fav-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={(e) => toggleFavorite(recipe, e)}
            >
              <Heart size={28} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="ingredients-section">
            <h3>
              <Utensils size={20} className="section-icon" />
              Ingredients
            </h3>
            <div className="ingredients-list">
              {recipe.ingredients.map((ing, idx) => (
                <div key={idx} className="ingredient-item">
                  <strong>{ing.item}</strong>
                  {ing.measure && <><br /><small>{ing.measure}</small></>}
                </div>
              ))}
            </div>
          </div>
          
          <div className="instructions-section">
            <h3>Instructions</h3>
            <div className="instructions">{recipe.instructions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
