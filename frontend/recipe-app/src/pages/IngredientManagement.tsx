import { useEffect, useState } from 'react';
import { Leaf, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ingredientApi } from '../services/api';
import type { Ingredient } from '../types';

export default function IngredientManagement() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchIngredients();
  }, [isAuthenticated, navigate]);

  const fetchIngredients = async () => {
    try {
      const data = await ingredientApi.getAllIngredients();
      setIngredients(data);
    } catch (err) {
      setError('Failed to load ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await ingredientApi.createIngredient(newIngredientName);
      setNewIngredientName('');
      await fetchIngredients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ingredient');
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ingredient Management</h1>
        <p className="text-gray-600">Create and manage recipe ingredients</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Plus className="h-6 w-6 mr-2 text-orange-600" />
          Create New Ingredient
        </h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            value={newIngredientName}
            onChange={(e) => setNewIngredientName(e.target.value)}
            placeholder="Enter ingredient name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
            minLength={2}
          />
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Ingredients ({ingredients.length})</h2>
        </div>

        {ingredients.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Leaf className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No ingredients yet. Create your first ingredient above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.ingredientId}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <Leaf className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{ingredient.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
