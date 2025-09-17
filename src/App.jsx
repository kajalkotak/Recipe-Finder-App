import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import RecipeModal from "./components/RecipeModal";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipePerPage = 6;

  const indexOfLastRecipe = currentPage * recipePerPage;
  const indexOfFirstRecipe = currentPage - recipePerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoritesRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = async (query) => {
    if (!query.trim() && !category.trim()) return;

    setLoading(true);
    setError("");
    try {
      let url = "";
      if (category) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      } else {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("failed to fetch data");
      }
      const data = await res.json();
      if (!data.meals) {
        setError("no recipe found");
        setRecipes([]);
      } else {
        setRecipes(data.meals);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("something went wrong. please try again  later.");
      setRecipes([]);
    }

    setLoading(false);
  };

  const handleRecipeClick = async (recipe) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
    );
    const data = await res.json();
    setSelectedRecipe(data.meals[0]);
  };

  const toggleFavorite = (recipe) => {
    const isAlreadyFavorite = favorites.some(
      (fav) => fav.idMeal === recipe.idMeal
    );

    const updateFavorites = isAlreadyFavorite
      ? favorites.filter((fav) => fav.idMeal !== recipe.idMeal)
      : [...favorites, recipe];

    setFavorites(updateFavorites);
    localStorage.setItem("favoritesRecipes", JSON.stringify(updateFavorites));
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("favoritesRecipes");
  };

  useEffect(() => {
    document.body.style.overflow = selectedRecipe ? "hidden" : "auto";
  }, [selectedRecipe]);

  return (
    <>
      <div className="min-h-screen max-w-md w-full p-4 mx-auto">
        <Header />
        <SearchBar onSearch={handleSearch} />
        {error && <p className="text-red-500 text-center my-4">{error}</p>}

        <div className="my-4">
          <label className="block mb-2 font-semibold">
            Filter by Category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Seafood">Seafood</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>

        {loading && <p className="text-center">Loading....</p>}

        {/* Search Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {currentRecipes.length > 0
            ? currentRecipes.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="bg-white p-4 rounded shadow cursor-pointer relative"
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-48 object-cover rounded"
                    onClick={() => handleRecipeClick(recipe)}
                  />
                  <h2 className="text-lg font-semibold mt-2">
                    {recipe.strMeal}
                  </h2>

                  <button
                    className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1"
                    onClick={() => toggleFavorite(recipe)}
                  >
                    {favorites.some((fav) => fav.idMeal === recipe.idMeal)
                      ? "★"
                      : "☆"}
                  </button>
                </div>
              ))
            : !loading && (
                <p className="text-center col-span-full">
                  Search for recipes using the above search bar
                </p>
              )}
        </div>

        {/* pagination button */}

        <div className="flex justify-center items-center space-x-4 my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded  disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>page {currentPage}</span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(recipes.length / recipesPerPage)
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              currentPage === Math.ceil(recipes.length / recipesPerPage)
            }
          >
            Next
          </button>
        </div>

        {/* ⭐️ Favorite Recipes Section */}
        <div className="my-6">
          <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
            Favorite Recipes
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Clear All
              </button>
            )}
          </h2>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <div key={fav.idMeal} className="bg-white p-4 rounded shadow">
                  <img
                    src={fav.strMealThumb}
                    alt={fav.strMeal}
                    className="w-full h-48 object-cover rounded"
                    onClick={() => handleRecipeClick(fav)}
                  />
                  <h2 className="text-lg font-semibold mt-2">{fav.strMeal}</h2>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No favorite recipes yet.</p>
          )}
        </div>

        {/* Recipe Modal */}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </>
  );
}

export default App;
