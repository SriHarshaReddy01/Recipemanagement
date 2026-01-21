import type { Recipe, User, Ingredient, Category } from '../types';

export const mockUsers: User[] = [
  { userId: '1', username: 'john_chef', createdAt: '2026-01-17' },
  { userId: '2', username: 'jane_cook', createdAt: '2026-01-17' },
  { userId: '3', username: 'bob_baker', createdAt: '2026-01-17' },
];

export const mockIngredients: Ingredient[] = [
  { ingredientId: '1', name: 'Flour' },
  { ingredientId: '2', name: 'Sugar' },
  { ingredientId: '3', name: 'Eggs' },
  { ingredientId: '4', name: 'Milk' },
  { ingredientId: '5', name: 'Butter' },
  { ingredientId: '6', name: 'Tomato' },
  { ingredientId: '7', name: 'Cheese' },
  { ingredientId: '8', name: 'Pasta' },
  { ingredientId: '9', name: 'Basil' },
  { ingredientId: '10', name: 'Chocolate' },
];

export const mockCategories: Category[] = [
  { categoryId: '1', name: 'Italian' },
  { categoryId: '2', name: 'Dessert' },
  { categoryId: '3', name: 'Vegetarian' },
  { categoryId: '4', name: 'Breakfast' },
];

export const mockRecipes: Recipe[] = [
  {
    recipeId: '1',
    name: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, and bacon',
    ownerUserId: '1',
    owner: mockUsers[0],
    createdAt: '2026-01-17',
    recipeIngredients: [
      { ingredientId: '8', ingredient: mockIngredients[7], quantity: '400g' },
      { ingredientId: '3', ingredient: mockIngredients[2], quantity: '4 large' },
      { ingredientId: '7', ingredient: mockIngredients[6], quantity: '100g grated' },
      { ingredientId: '5', ingredient: mockIngredients[4], quantity: '2 tbsp' },
    ],
    recipeCategories: [
      { categoryId: '1', category: mockCategories[0] },
    ],
    steps: [
      { recipeStepId: '1', stepNumber: 1, description: 'Boil water and cook pasta according to package instructions' },
      { recipeStepId: '2', stepNumber: 2, description: 'Beat eggs with grated cheese in a bowl' },
      { recipeStepId: '3', stepNumber: 3, description: 'Drain pasta and mix with egg mixture while hot' },
      { recipeStepId: '4', stepNumber: 4, description: 'Serve immediately with extra cheese' },
    ],
  },
  {
    recipeId: '2',
    name: 'Chocolate Chip Pancakes',
    description: 'Fluffy pancakes with chocolate chips',
    ownerUserId: '2',
    owner: mockUsers[1],
    createdAt: '2026-01-17',
    recipeIngredients: [
      { ingredientId: '1', ingredient: mockIngredients[0], quantity: '2 cups' },
      { ingredientId: '2', ingredient: mockIngredients[1], quantity: '2 tbsp' },
      { ingredientId: '3', ingredient: mockIngredients[2], quantity: '2 large' },
      { ingredientId: '4', ingredient: mockIngredients[3], quantity: '1.5 cups' },
      { ingredientId: '5', ingredient: mockIngredients[4], quantity: '3 tbsp melted' },
      { ingredientId: '10', ingredient: mockIngredients[9], quantity: '1 cup chips' },
    ],
    recipeCategories: [
      { categoryId: '2', category: mockCategories[1] },
      { categoryId: '4', category: mockCategories[3] },
    ],
    steps: [
      { recipeStepId: '5', stepNumber: 1, description: 'Mix flour and sugar in a large bowl' },
      { recipeStepId: '6', stepNumber: 2, description: 'Whisk eggs, milk, and melted butter together' },
      { recipeStepId: '7', stepNumber: 3, description: 'Combine wet and dry ingredients' },
      { recipeStepId: '8', stepNumber: 4, description: 'Fold in chocolate chips' },
      { recipeStepId: '9', stepNumber: 5, description: 'Cook on griddle until golden brown' },
    ],
  },
  {
    recipeId: '3',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with tomato, mozzarella, and basil',
    ownerUserId: '3',
    owner: mockUsers[2],
    createdAt: '2026-01-17',
    recipeIngredients: [
      { ingredientId: '1', ingredient: mockIngredients[0], quantity: '500g' },
      { ingredientId: '6', ingredient: mockIngredients[5], quantity: '400g crushed' },
      { ingredientId: '7', ingredient: mockIngredients[6], quantity: '250g mozzarella' },
      { ingredientId: '9', ingredient: mockIngredients[8], quantity: 'Fresh leaves' },
    ],
    recipeCategories: [
      { categoryId: '1', category: mockCategories[0] },
      { categoryId: '3', category: mockCategories[2] },
    ],
    steps: [
      { recipeStepId: '10', stepNumber: 1, description: 'Prepare pizza dough with flour, water, yeast, and salt' },
      { recipeStepId: '11', stepNumber: 2, description: 'Let dough rise for 1 hour' },
      { recipeStepId: '12', stepNumber: 3, description: 'Roll out dough and spread tomato sauce' },
      { recipeStepId: '13', stepNumber: 4, description: 'Add mozzarella cheese and basil leaves' },
      { recipeStepId: '14', stepNumber: 5, description: 'Bake at 250°C for 10-12 minutes' },
    ],
  },
];
