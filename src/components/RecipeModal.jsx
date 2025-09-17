//RecipeModal.jsx

import React from "react";

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  //etract ingredient
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded w-full max-w-md max-h-[120vh] overflow-y-scroll shadow-lg">
        <button
          onClick={onClose}
          className="text-right mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Close
        </button>

        <h2 className="text-2xl font-bold mb-4">{recipe.strMeal}</h2>
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover rounded mb-4"
        />

        <p>
          <strong>ID:</strong> {recipe.idMeal}
        </p>
        <p>
          <strong>Category:</strong> {recipe.strCategory || "N/A"}
        </p>
        <p className="mt-4">
          <strong>Instructions:</strong>{" "}
          {recipe.strInstructions || "No instructions available"}
        </p>

        <h3 className="text-lg font-semibold mt-4">Ingredients:</h3>
        <ul className="list-disc ml-5">
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeModal;
