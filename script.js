class RecipeFinder {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
        this.currentRecipes = [];
        this.searchTimeout = null;
        this.suggestions = ['vegetable', 'salad', 'pasta'];
        
        this.initializeElements();
        this.bindEvents();
        this.updateFavoriteCount();
        this.showInitialSuggestions();
    }

    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.suggestionsContainer = document.getElementById('suggestions');
        this.recipesContainer = document.getElementById('recipesContainer');
        this.favoritesContainer = document.getElementById('favoritesContainer');
        this.homeSection = document.getElementById('homeSection');
        this.favSection = document.getElementById('favSection');
        this.homeBtn = document.getElementById('homeBtn');
        this.favBtn = document.getElementById('favBtn');
        this.favCount = document.getElementById('favCount');
        this.modal = document.getElementById('recipeModal');
        this.recipeDetail = document.getElementById('recipeDetail');
        this.closeModal = document.querySelector('.close');
    }

    bindEvents() {
        // Search input events
        this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        this.searchInput.addEventListener('focus', () => this.showSuggestions());
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 200);
        });

        // Navigation events
        this.homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('home');
        });
        
        this.favBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('favorites');
        });

        // Modal events
        this.closeModal.addEventListener('click', () => this.closeRecipeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeRecipeModal();
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeRecipeModal();
        });
    }

    showInitialSuggestions() {
        if (this.searchInput.value === '') {
            this.displaySuggestions(this.suggestions);
        }
    }

    handleSearchInput(e) {
        const query = e.target.value.trim();
        
        clearTimeout(this.searchTimeout);
        
        if (query === '') {
            this.displaySuggestions(this.suggestions);
            this.showWelcomeMessage();
            return;
        }

        // Show filtered suggestions
        const filteredSuggestions = this.suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(query.toLowerCase())
        );
        this.displaySuggestions(filteredSuggestions);

        // Debounced search
        this.searchTimeout = setTimeout(() => {
            this.searchRecipes(query);
        }, 500);
    }

    displaySuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.suggestionsContainer.innerHTML = suggestions
            .slice(0, 3)
            .map(suggestion => `
                <button class="suggestion-item" onclick="recipeFinder.selectSuggestion('${suggestion}')">
                    ${suggestion}
                </button>
            `).join('');
        
        this.showSuggestions();
    }

    selectSuggestion(suggestion) {
        this.searchInput.value = suggestion;
        this.hideSuggestions();
        this.searchRecipes(suggestion);
    }

    showSuggestions() {
        this.suggestionsContainer.style.display = 'flex';
    }

    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
    }

    async searchRecipes(query) {
        try {
            this.showLoading();
            
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.meals) {
                this.currentRecipes = this.transformApiData(data.meals);
                this.displayRecipes(this.currentRecipes);
            } else {
                this.showNoResults();
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            this.showError();
        }
    }

    transformApiData(meals) {
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
    }

    displayRecipes(recipes) {
        if (recipes.length === 0) {
            this.showNoResults();
            return;
        }

        this.recipesContainer.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" onclick="recipeFinder.showRecipeDetail('${recipe.id}')">
                <img src="${recipe.thumbnail}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-info">
                    <div class="recipe-header">
                        <div>
                            <h3 class="recipe-title">${recipe.name}</h3>
                            <div class="recipe-category">${recipe.category}</div>
                            <div class="recipe-origin">${recipe.origin}</div>
                        </div>
                        <button class="fav-btn ${this.isFavorite(recipe.id) ? 'favorited' : ''}" 
                                onclick="event.stopPropagation(); recipeFinder.toggleFavorite('${recipe.id}')">
                            ${this.isFavorite(recipe.id) ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showRecipeDetail(recipeId) {
        const recipe = this.currentRecipes.find(r => r.id === recipeId) || 
                     this.favorites.find(r => r.id === recipeId);
        
        if (!recipe) return;

        this.recipeDetail.innerHTML = `
            <img src="${recipe.thumbnail}" alt="${recipe.name}" class="recipe-detail-image">
            <div class="recipe-detail-content">
                <div class="recipe-detail-header">
                    <div>
                        <h2 class="recipe-detail-title">${recipe.name}</h2>
                        <div class="recipe-detail-meta">
                            <span class="recipe-category">${recipe.category}</span>
                            <span class="recipe-origin">${recipe.origin}</span>
                        </div>
                    </div>
                    <button class="fav-btn ${this.isFavorite(recipe.id) ? 'favorited' : ''}" 
                            onclick="recipeFinder.toggleFavorite('${recipe.id}')">
                        ${this.isFavorite(recipe.id) ? '❤️' : '🤍'}
                    </button>
                </div>
                
                <div class="ingredients-section">
                    <h3>Ingredients</h3>
                    <div class="ingredients-list">
                        ${recipe.ingredients.map(ing => `
                            <div class="ingredient-item">
                                <strong>${ing.item}</strong>
                                ${ing.measure ? `<br><small>${ing.measure}</small>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="instructions-section">
                    <h3>Instructions</h3>
                    <div class="instructions">${recipe.instructions}</div>
                </div>
            </div>
        `;
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeRecipeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    toggleFavorite(recipeId) {
        const recipe = this.currentRecipes.find(r => r.id === recipeId) || 
                     this.favorites.find(r => r.id === recipeId);
        
        if (!recipe) return;

        const favoriteIndex = this.favorites.findIndex(fav => fav.id === recipeId);
        
        if (favoriteIndex > -1) {
            this.favorites.splice(favoriteIndex, 1);
        } else {
            this.favorites.push(recipe);
        }
        
        localStorage.setItem('favoriteRecipes', JSON.stringify(this.favorites));
        this.updateFavoriteCount();
        this.refreshCurrentView();
    }

    isFavorite(recipeId) {
        return this.favorites.some(fav => fav.id === recipeId);
    }

    updateFavoriteCount() {
        this.favCount.textContent = this.favorites.length;
    }

    showSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        if (section === 'home') {
            this.homeBtn.classList.add('active');
            this.homeSection.classList.add('active');
            this.favSection.classList.remove('active');
        } else {
            this.favBtn.classList.add('active');
            this.favSection.classList.add('active');
            this.homeSection.classList.remove('active');
            this.displayFavorites();
        }
    }

    displayFavorites() {
        if (this.favorites.length === 0) {
            this.favoritesContainer.innerHTML = `
                <div class="no-favorites">
                    <p>No favorite recipes yet. Start exploring and add some!</p>
                </div>
            `;
            return;
        }

        this.favoritesContainer.innerHTML = this.favorites.map(recipe => `
            <div class="recipe-card" onclick="recipeFinder.showRecipeDetail('${recipe.id}')">
                <img src="${recipe.thumbnail}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-info">
                    <div class="recipe-header">
                        <div>
                            <h3 class="recipe-title">${recipe.name}</h3>
                            <div class="recipe-category">${recipe.category}</div>
                            <div class="recipe-origin">${recipe.origin}</div>
                        </div>
                        <button class="fav-btn favorited" 
                                onclick="event.stopPropagation(); recipeFinder.toggleFavorite('${recipe.id}')">
                            ❤️
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    refreshCurrentView() {
        const isHomeActive = this.homeSection.classList.contains('active');
        
        if (isHomeActive) {
            if (this.currentRecipes.length > 0) {
                this.displayRecipes(this.currentRecipes);
            }
        } else {
            this.displayFavorites();
        }
        
        // Update modal if open
        if (this.modal.style.display === 'block') {
            const currentRecipeId = this.recipeDetail.querySelector('.recipe-detail-title')?.textContent;
            if (currentRecipeId) {
                const recipe = this.currentRecipes.find(r => r.name === currentRecipeId) || 
                             this.favorites.find(r => r.name === currentRecipeId);
                if (recipe) {
                    this.showRecipeDetail(recipe.id);
                }
            }
        }
    }

    showLoading() {
        this.recipesContainer.innerHTML = '<div class="loading">Searching for recipes...</div>';
    }

    showWelcomeMessage() {
        this.recipesContainer.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to Recipe Finder!</h2>
                <p>Start typing to search for delicious recipes</p>
            </div>
        `;
    }

    showNoResults() {
        this.recipesContainer.innerHTML = `
            <div class="welcome-message">
                <h2>No recipes found</h2>
                <p>Try searching for something else</p>
            </div>
        `;
    }

    showError() {
        this.recipesContainer.innerHTML = `
            <div class="welcome-message">
                <h2>Oops! Something went wrong</h2>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Initialize the app
const recipeFinder = new RecipeFinder();