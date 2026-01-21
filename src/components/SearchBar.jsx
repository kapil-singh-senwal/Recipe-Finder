import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, suggestions }) => {
  return (
    <div className="search-container">
      <div className="search-box">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          id="searchInput" 
          placeholder="Search for recipes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="suggestions">
        {suggestions.map(s => (
          <button key={s} className="suggestion-item" onClick={() => setSearchQuery(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
