import React from 'react';
import { ChefHat, Home, Heart } from 'lucide-react';

const Header = ({ activeSection, setActiveSection, favoritesCount }) => {
  return (
    <header>
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">
            <ChefHat className="logo-icon" size={32} />
            Recipe Finder
          </h1>
          <div className="nav-links">
            <button 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => setActiveSection('home')}
            >
              <Home size={20} className="nav-icon" />
              Home
            </button>
            <button 
              className={`nav-link ${activeSection === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveSection('favorites')}
            >
              <Heart size={20} className="nav-icon" />
              Favorites <span id="favCount">{favoritesCount}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
