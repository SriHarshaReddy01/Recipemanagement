import { Link } from 'react-router-dom';
import { Clock, User, Tag } from 'lucide-react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      to={`/recipes/${recipe.recipeId}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden h-full flex flex-col"
    >
      <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
        <span className="text-7xl">🍳</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{recipe.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{recipe.description}</p>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
            <span className="truncate">{recipe.owner.username}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
            <span>{recipe.steps.length} steps</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {recipe.recipeCategories.slice(0, 3).map((rc) => (
            <span
              key={rc.categoryId}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              <Tag className="h-3 w-3 mr-1" />
              {rc.category.name}
            </span>
          ))}
          {recipe.recipeCategories.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{recipe.recipeCategories.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
