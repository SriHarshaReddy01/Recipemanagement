import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeApi, ingredientApi, categoryApi } from '../services/api';
import type { Ingredient, Category } from '../types';

export default function CreateRecipe() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Array<{ ingredientId: string; quantity: string }>>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const [ingredientsData, categoriesData] = await Promise.all([
        ingredientApi.getAllIngredients(),
        categoryApi.getAllCategories(),
      ]);
      setAvailableIngredients(ingredientsData);
      setAvailableCategories(categoriesData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredientId: '', quantity: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: 'ingredientId' | 'quantity', value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create a recipe');
      return;
    }

    if (ingredients.length === 0) {
      setError('Recipe must have at least one ingredient');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Recipe must have at least one category');
      return;
    }

    if (steps.filter(s => s.trim()).length === 0) {
      setError('Recipe must have at least one step');
      return;
    }

    setLoading(true);

    try {
      await recipeApi.createRecipe({
        name,
        description,
        ownerUserId: user.userId,
        ingredients: ingredients.filter(i => i.ingredientId && i.quantity),
        categoryIds: selectedCategories,
        steps: steps.filter(s => s.trim()),
      });
      navigate('/recipes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <ChefHat className="h-10 w-10 mr-3 text-orange-600" />
          Create New Recipe
        </h1>
        <p className="text-gray-600">Share your culinary creation with the world</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Recipe Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Categories * (Select at least one)</label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <button
                key={category.categoryId}
                type="button"
                onClick={() => toggleCategory(category.categoryId)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategories.includes(category.categoryId)
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-medium">Ingredients *</label>
            <button
              type="button"
              onClick={addIngredient}
              className="text-orange-600 hover:text-orange-700 flex items-center text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Ingredient
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={ingredient.ingredientId}
                  onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select ingredient...</option>
                  {availableIngredients.map((ing) => (
                    <option key={ing.ingredientId} value={ing.ingredientId}>
                      {ing.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  placeholder="Quantity (e.g., 2 cups)"
                  className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-medium">Preparation Steps *</label>
            <button
              type="button"
              onClick={addStep}
              className="text-orange-600 hover:text-orange-700 flex items-center text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </button>
          </div>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <span className="flex-shrink-0 w-8 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <textarea
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Step ${index + 1} description...`}
                  rows={2}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
