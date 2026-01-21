import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { ingredientApi, recipeApi } from '../services/api';
import type { Ingredient, Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await ingredientApi.getAllIngredients();
        setIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!selectedIngredient) {
        setRecipes([]);
        return;
      }
      try {
        const data = await recipeApi.getRecipesByIngredient(selectedIngredient);
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [selectedIngredient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Ingredients</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {ingredients.map((ingredient) => (
          <button
            key={ingredient.ingredientId}
            onClick={() => setSelectedIngredient(ingredient.ingredientId)}
            className={`p-4 rounded-lg shadow-md transition-all ${
              selectedIngredient === ingredient.ingredientId
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-900 hover:shadow-lg'
            }`}
          >
            <Leaf className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium text-center">{ingredient.name}</p>
          </button>
        ))}
      </div>

      {selectedIngredient && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recipes with {ingredients.find((i) => i.ingredientId === selectedIngredient)?.name}
          </h2>
          {recipes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recipes found with this ingredient.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.recipeId} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
