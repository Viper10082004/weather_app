import React from "react";
import "../App.css"; // Adjust path if needed

const Header = ({ searchQuery, handleSearchChange, handleSearchSubmit }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className='header'>
        <div className="logo">Weather.App</div>
        <div className='search_field'>
        <input type="text"
              placeholder="Search for cities..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}  />
          <img
            src="search.png"
            className='search-input'
            width={"25px"}
            alt="search icon"
            onClick={handleSearchSubmit} // Trigger search on click
          />
        </div>
      </header>
  );
};

export default Header;