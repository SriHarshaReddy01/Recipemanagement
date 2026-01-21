import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Edit2, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeApi } from '../services/api';
import type { Recipe } from '../types';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    fetchMyRecipes();
  }, [isAuthenticated, user, navigate]);

  const fetchMyRecipes = async () => {
    if (!user) return;
    
    try {
      const data = await recipeApi.getRecipesByUser(user.userId);
      setRecipes(data);
    } catch (err) {
      setError('Failed to load your recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId: string, recipeName: string) => {
    if (!confirm(`Are you sure you want to delete "${recipeName}"?`)) return;

    try {
      await recipeApi.deleteRecipe(recipeId);
      await fetchMyRecipes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Recipes</h1>
          <p className="text-gray-600">Manage your recipe collection</p>
        </div>
        <Link
          to="/create-recipe"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Recipe
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No recipes yet</h3>
          <p className="text-gray-600 mb-6">Start sharing your culinary creations!</p>
          <Link
            to="/create-recipe"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.recipeId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                <div className="w-48 h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-6xl">🍳</span>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h3>
                      <p className="text-gray-600 mb-3">{recipe.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-recipe/${recipe.recipeId}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe.recipeId, recipe.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {recipe.recipeCategories.map((rc) => (
                      <span
                        key={rc.categoryId}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                      >
                        {rc.category.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>{recipe.recipeIngredients.length} ingredients</span>
                    <span>{recipe.steps.length} steps</span>
                    <span>Created {new Date(recipe.createdAt).toLocaleDateString()}</span>
                  </div>

                  <Link
                    to={`/recipes/${recipe.recipeId}`}
                    className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
