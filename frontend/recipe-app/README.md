# RecipeCore Frontend

Modern React frontend for the RecipeCore Recipe Management System.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **TailwindCSS** for styling
- **Lucide React** for icons

## Features

✅ Browse all recipes with search functionality  
✅ View detailed recipe information with ingredients and steps  
✅ Filter recipes by category  
✅ Filter recipes by ingredient  
✅ Responsive design for mobile and desktop  
✅ Modern, clean UI with smooth animations  

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout.tsx     # Main layout with navigation
│   └── RecipeCard.tsx # Recipe card component
├── pages/             # Page components
│   ├── Home.tsx       # Landing page
│   ├── Recipes.tsx    # All recipes with search
│   ├── RecipeDetail.tsx # Single recipe view
│   ├── Categories.tsx # Filter by category
│   └── Ingredients.tsx # Filter by ingredient
├── services/          # API and data services
│   ├── api.ts         # API functions
│   └── mockData.ts    # Mock data for development
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types
├── App.tsx            # Main app with routing
└── main.tsx           # Entry point
```

## Available Routes

- `/` - Home page with featured recipes
- `/recipes` - All recipes with search
- `/recipes/:id` - Recipe detail page
- `/categories` - Browse by category
- `/ingredients` - Browse by ingredient

## API Integration

The frontend currently uses mock data from `src/services/mockData.ts`. To connect to a real backend API:

1. Update the API functions in `src/services/api.ts`
2. Replace mock data calls with actual HTTP requests (using fetch or axios)
3. Configure the API base URL in an environment variable

Example:

```typescript
// .env
VITE_API_URL=http://localhost:5000/api

// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export const recipeApi = {
  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await fetch(`${API_URL}/recipes`);
    return response.json();
  },
  // ... other methods
};
```

## Styling

This project uses TailwindCSS for styling. The configuration is in `tailwind.config.js`.

Custom styles can be added to `src/index.css`.

## Development Notes

- The app is fully responsive and works on mobile, tablet, and desktop
- All components use TypeScript for type safety
- Mock data matches the backend .NET API structure
- Ready for REST API integration

## Future Enhancements

- User authentication and login
- Create/Edit/Delete recipes (CRUD operations)
- Favorites functionality
- Recipe ratings and comments
- Image upload for recipes
- Advanced search and filtering
- Social sharing features

## License

Part of the RecipeCore project - Recipe Management System
