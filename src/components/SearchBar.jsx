//SearchBar.jsx

import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center my-6 pt-6">
      <input
        type="text"
        placeholder="Search for recipe"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 rounded-1 border border-gray-300 w-80 focus:outline-none"
      ></input>

      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
