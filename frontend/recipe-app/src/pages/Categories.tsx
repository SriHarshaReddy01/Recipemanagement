import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { categoryApi, recipeApi } from '../services/api';
import type { Category, Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!selectedCategory) {
        setRecipes([]);
        return;
      }
      try {
        const data = await recipeApi.getRecipesByCategory(selectedCategory);
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Recipe Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.categoryId}
            onClick={() => setSelectedCategory(category.categoryId)}
            className={`p-6 rounded-lg shadow-md transition-all ${
              selectedCategory === category.categoryId
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-900 hover:shadow-lg'
            }`}
          >
            <Tag className="h-8 w-8 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-center">{category.name}</h3>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recipes in {categories.find((c) => c.categoryId === selectedCategory)?.name}
          </h2>
          {recipes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recipes found in this category.</p>
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
