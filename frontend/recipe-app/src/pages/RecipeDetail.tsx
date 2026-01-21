import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, Tag, Leaf, Edit2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeApi, favoriteApi } from '../services/api';
import type { Recipe } from '../types';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        const data = await recipeApi.getRecipeById(id);
        setRecipe(data || null);
        
        if (user && data && data.ownerUserId !== user.userId) {
          const favoriteStatus = await favoriteApi.isFavorite(user.userId, id);
          setIsFavorite(favoriteStatus);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user || !id || !recipe) return;

    if (recipe.ownerUserId === user.userId) {
      alert('You cannot favorite your own recipes');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(user.userId, id);
        setIsFavorite(false);
      } else {
        await favoriteApi.addFavorite(user.userId, id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error instanceof Error ? error.message : 'Failed to update favorite');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Recipe not found.</p>
        <Link to="/recipes" className="text-orange-600 hover:text-orange-700 mt-4 inline-block">
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/recipes"
        className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back to Recipes
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <span className="text-9xl">🍳</span>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
            </div>
            <div className="flex gap-2">
              {isAuthenticated && user && recipe.ownerUserId === user.userId && (
                <button
                  onClick={() => navigate(`/edit-recipe/${recipe.recipeId}`)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="h-5 w-5 mr-2" />
                  Edit Recipe
                </button>
              )}
              {isAuthenticated && user && recipe.ownerUserId !== user.userId && (
                <button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-600 text-lg mb-6">{recipe.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <User className="h-5 w-5 mr-2 text-orange-600" />
              <span className="font-medium">By {recipe.owner.username}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              <span>{recipe.steps.length} steps</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {recipe.recipeCategories.map((rc) => (
              <span
                key={rc.categoryId}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
              >
                <Tag className="h-4 w-4 mr-1" />
                {rc.category.name}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Leaf className="h-6 w-6 mr-2 text-orange-600" />
                Ingredients
              </h2>
              <ul className="space-y-2">
                {recipe.recipeIngredients.map((ri) => (
                  <li key={ri.ingredientId} className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span className="text-gray-700">
                      <strong>{ri.ingredient.name}</strong> - {ri.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps
                  .sort((a, b) => a.stepNumber - b.stepNumber)
                  .map((step) => (
                    <li key={step.recipeStepId} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {step.stepNumber}
                      </span>
                      <p className="text-gray-700 pt-1">{step.description}</p>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
