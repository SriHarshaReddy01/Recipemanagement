import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Tag, Leaf, ArrowRight } from 'lucide-react';
import { recipeApi, categoryApi, ingredientApi } from '../services/api';
import type { Recipe, Category, Ingredient } from '../types';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesData, categoriesData, ingredientsData] = await Promise.all([
          recipeApi.getAllRecipes(),
          categoryApi.getAllCategories(),
          ingredientApi.getAllIngredients(),
        ]);
        setRecipes(recipesData);
        setCategories(categoriesData);
        setIngredients(ingredientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-xl p-6 sm:p-8 md:p-12 mb-8 md:mb-10 text-white">
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <ChefHat className="h-16 w-16 md:h-20 md:w-20" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 md:mb-4">Welcome to RecipeCore</h1>
        <p className="text-base sm:text-lg md:text-xl text-center text-orange-50 max-w-2xl mx-auto mb-4 md:mb-6 px-4">
          Discover, create, and share amazing recipes. Your culinary journey starts here!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Link
            to="/recipes"
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold shadow-md"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Browse Recipes
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors font-semibold shadow-md"
          >
            <Tag className="h-5 w-5 mr-2" />
            Explore Categories
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-12">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{recipes.length}</h3>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Total Recipes</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
              <Tag className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{categories.length}</h3>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Categories</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
              <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{ingredients.length}</h3>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Ingredients</p>
        </div>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Recipes</h2>
        <Link
          to="/recipes"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold transition-colors text-sm sm:text-base"
        >
          View All Recipes
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {recipes.slice(0, 6).map((recipe) => (
          <RecipeCard key={recipe.recipeId} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
