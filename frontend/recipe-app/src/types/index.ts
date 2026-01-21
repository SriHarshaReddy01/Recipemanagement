export interface User {
  userId: string;
  username: string;
  createdAt: string;
}

export interface Ingredient {
  ingredientId: string;
  name: string;
}

export interface Category {
  categoryId: string;
  name: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredient: Ingredient;
  quantity: string;
}

export interface RecipeCategory {
  categoryId: string;
  category: Category;
}

export interface RecipeStep {
  recipeStepId: string;
  stepNumber: number;
  description: string;
}

export interface Recipe {
  recipeId: string;
  name: string;
  description: string;
  ownerUserId: string;
  owner: User;
  createdAt: string;
  recipeIngredients: RecipeIngredient[];
  recipeCategories: RecipeCategory[];
  steps: RecipeStep[];
}
