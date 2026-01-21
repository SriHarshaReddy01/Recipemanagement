import type { Recipe, Ingredient, Category } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const recipeApi = {
  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return response.json();
  },

  getRecipeById: async (id: string): Promise<Recipe | undefined> => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Failed to fetch recipe');
    }
    return response.json();
  },

  getRecipesByCategory: async (categoryId: string): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/recipes/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch recipes by category');
    return response.json();
  },

  getRecipesByIngredient: async (ingredientId: string): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/recipes/ingredient/${ingredientId}`);
    if (!response.ok) throw new Error('Failed to fetch recipes by ingredient');
    return response.json();
  },

  getRecipesByUser: async (userId: string): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/recipes/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch recipes by user');
    return response.json();
  },

  createRecipe: async (data: {
    name: string;
    description: string;
    ownerUserId: string;
    ingredients: Array<{ ingredientId: string; quantity: string }>;
    categoryIds: string[];
    steps: string[];
  }): Promise<Recipe> => {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        ownerUserId: data.ownerUserId,
        ingredients: data.ingredients.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity })),
        categoryIds: data.categoryIds,
        steps: data.steps,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create recipe');
    }
    return response.json();
  },

  updateRecipe: async (id: string, data: {
    name: string;
    description: string;
    ingredients: Array<{ ingredientId: string; quantity: string }>;
    categoryIds: string[];
    steps: string[];
  }): Promise<Recipe> => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        ingredients: data.ingredients.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity })),
        categoryIds: data.categoryIds,
        steps: data.steps,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update recipe');
    }
    return response.json();
  },

  deleteRecipe: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete recipe');
    }
  },
};

export const ingredientApi = {
  getAllIngredients: async (): Promise<Ingredient[]> => {
    const response = await fetch(`${API_BASE_URL}/ingredients`);
    if (!response.ok) throw new Error('Failed to fetch ingredients');
    return response.json();
  },

  getIngredientById: async (id: string): Promise<Ingredient | undefined> => {
    const response = await fetch(`${API_BASE_URL}/ingredients/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Failed to fetch ingredient');
    }
    return response.json();
  },

  createIngredient: async (name: string): Promise<Ingredient> => {
    const response = await fetch(`${API_BASE_URL}/ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create ingredient');
    }
    return response.json();
  },
};

export const categoryApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getCategoryById: async (id: string): Promise<Category | undefined> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Failed to fetch category');
    }
    return response.json();
  },

  createCategory: async (name: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }
    return response.json();
  },

  updateCategory: async (id: string, name: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }
    return response.json();
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
  },
};

export const favoriteApi = {
  getUserFavorites: async (userId: string): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/favorites/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  },

  addFavorite: async (userId: string, recipeId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, recipeId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add favorite');
    }
  },

  removeFavorite: async (userId: string, recipeId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, recipeId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove favorite');
    }
  },

  isFavorite: async (userId: string, recipeId: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/favorites/check?userId=${userId}&recipeId=${recipeId}`);
    if (!response.ok) throw new Error('Failed to check favorite status');
    const data = await response.json();
    return data.isFavorite;
  },
};
