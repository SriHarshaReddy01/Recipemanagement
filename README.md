# RecipeCore - Recipe Management System

A full-stack Recipe Management System built with .NET 10 backend and React TypeScript frontend, demonstrating Clean Architecture principles and modern web development practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Development](#development)
- [License](#license)

---

## 🎯 Overview

RecipeCore is a comprehensive recipe management system that allows users to:

- Register and authenticate
- Create, edit, and delete recipes
- Organize recipes with categories and ingredients
- Mark favorite recipes from other users
- Search and filter recipes by various criteria
- View detailed recipe information with step-by-step instructions

The project showcases **Clean Architecture**, **Repository Pattern**, **Unit of Work**, and modern full-stack development practices.

## ✨ Features

### User Management

- ✅ User registration with secure password hashing (SHA256)
- ✅ User authentication
- ✅ User profile display
- ✅ Recipe ownership tracking

### Recipe Management

- ✅ Create recipes with ingredients, categories, and steps
- ✅ Edit existing recipes (owners only)
- ✅ Delete recipes
- ✅ View all recipes with search functionality
- ✅ View detailed recipe information
- ✅ Filter by category, ingredient, or user
- ✅ Unique recipe name validation

### Category & Ingredient Management

- ✅ Create, update, and delete categories
- ✅ Create ingredients (global ingredient list)
- ✅ Browse recipes by category or ingredient
- ✅ Unique name constraints

### Favorites System

- ✅ Add recipes to favorites
- ✅ Remove from favorites
- ✅ View user's favorite recipes
- ✅ Constraint: Cannot favorite own recipes

### Business Rules & Validation

- ✅ Recipes must have at least 1 ingredient, 1 category, and 1 step
- ✅ Unique constraints on usernames, recipe names, categories, and ingredients
- ✅ Password security with hashing
- ✅ Data persistence with SQLite

---

## 🛠 Technology Stack

### Backend

- **Framework**: .NET 10
- **API**: ASP.NET Core Web API
- **ORM**: Entity Framework Core 10.0.2
- **Database**: SQLite (development), SQL Server/PostgreSQL (production-ready)
- **Architecture**: Clean Architecture
- **Patterns**: Repository Pattern, Unit of Work
- **Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: React 18
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 5.4
- **Routing**: React Router 6
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **State Management**: React Context API

## 🚀 Quick Start

### Prerequisites

- **.NET 10 SDK** or later ([Download](https://dotnet.microsoft.com/download))
- **Node.js 20.19+** or **22.12+** ([Download](https://nodejs.org/))
- **Visual Studio 2022** or **VS Code** with C# extension

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Recipe  management"
```

### 2. Start the Backend API

```bash
# Navigate to API project
cd backend/RecipeCore.API

# Restore dependencies
dotnet restore

# Run the API
dotnet run --urls "http://localhost:5000"
```

The API will be available at:

- **API**: http://localhost:5000/api
- **Swagger UI**: http://localhost:5000/swagger

### 3. Start the Frontend

Open a **new terminal** and run:

```bash
# Navigate to frontend project
cd frontend/recipe-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at:

- **Frontend**: http://localhost:5173

### 4. Access the Application

1. Open your browser to **http://localhost:5173**
2. Login with demo credentials:
   - **Username**: `john_chef` | **Password**: `password123`
   - **Username**: `jane_cook` | **Password**: `password456`
   - **Username**: `bob_baker` | **Password**: `password789`
3. Start exploring recipes!

---

## 🏗 Architecture

### Backend - Clean Architecture

```
┌─────────────────────────────────────────┐
│           RecipeCore.API                │
│     (Controllers, Program.cs)           │
│     - REST API Endpoints                │
│     - CORS Configuration                │
│     - Dependency Injection              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       RecipeCore.Application            │
│     (Services, Interfaces)              │
│     - Business Logic                    │
│     - Validation Rules                  │
│     - Service Layer                     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      RecipeCore.Infrastructure          │
│     (Repositories, DbContext)           │
│     - Data Access                       │
│     - EF Core Implementation            │
│     - SQLite Database                   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         RecipeCore.Domain               │
│          (Entities)                     │
│     - Core Business Entities            │
│     - No Dependencies                   │
└─────────────────────────────────────────┘

## 📚 API Documentation

### Base URL
```

http://localhost:5000/api

```

### Recipes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recipes` | Get all recipes |
| GET | `/recipes/{id}` | Get recipe by ID |
| GET | `/recipes/user/{userId}` | Get recipes by user |
| GET | `/recipes/category/{categoryId}` | Get recipes by category |
| GET | `/recipes/ingredient/{ingredientId}` | Get recipes by ingredient |
| POST | `/recipes` | Create new recipe |
| PUT | `/recipes/{id}` | Update recipe |
| DELETE | `/recipes/{id}` | Delete recipe |

### Categories Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| GET | `/categories/{id}` | Get category by ID |
| POST | `/categories` | Create category |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |

### Ingredients Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ingredients` | Get all ingredients |
| GET | `/ingredients/{id}` | Get ingredient by ID |
| POST | `/ingredients` | Create ingredient |

### Users Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get user by ID |
| POST | `/users/register` | Register new user |
| POST | `/users/authenticate` | Authenticate user |

### Favorites Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/favorites/user/{userId}` | Get user's favorites |
| POST | `/favorites` | Add favorite |
| DELETE | `/favorites` | Remove favorite |
| GET | `/favorites/check` | Check if favorited |

For complete API documentation, visit **http://localhost:5000/swagger** when the API is running.

---

## 💻 Frontend Guide

### Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with statistics |
| `/recipes` | Recipes | Browse all recipes with search |
| `/recipes/:id` | RecipeDetail | View single recipe details |
| `/categories` | Categories | Filter recipes by category |
| `/ingredients` | Ingredients | Filter recipes by ingredient |
| `/login` | Login | User login page |
| `/register` | Register | User registration page |
| `/create-recipe` | CreateRecipe | Create new recipe form |
| `/edit-recipe/:id` | EditRecipe | Edit existing recipe |
| `/my-recipes` | MyRecipes | View user's own recipes |
| `/favorites` | Favorites | View favorite recipes |
| `/manage-categories` | CategoryManagement | Manage categories |
| `/manage-ingredients` | IngredientManagement | Manage ingredients |

### Key Components

**Layout.tsx**
- Main application layout with responsive navigation
- Conditional rendering based on authentication
- Sticky header with dropdown menus

**RecipeCard.tsx**
- Reusable recipe card component
- Displays recipe preview with categories
- Responsive grid layout

**AuthContext.tsx**
- React Context for authentication state
- Login, register, and logout functionality
- LocalStorage persistence

### Styling

The frontend uses **TailwindCSS** for styling with a custom color scheme:
- **Primary**: Orange (#EA580C)
- **Secondary**: Gray
- **Success**: Green
- **Responsive breakpoints**: sm (640px), md (768px), lg (1024px)

---

## 🗄 Database Schema

### Tables

**Users**
- UserId (GUID, PK)
- Username (Unique)
- PasswordHash
- CreatedAt

**Recipes**
- RecipeId (GUID, PK)
- Name (Unique)
- Description
- OwnerUserId (FK → Users)
- CreatedAt

**Ingredients**
- IngredientId (GUID, PK)
- Name (Unique)

**Categories**
- CategoryId (GUID, PK)
- Name (Unique)

**RecipeIngredients** (Junction Table)
- RecipeId (FK → Recipes)
- IngredientId (FK → Ingredients)
- Quantity

**RecipeCategories** (Junction Table)
- RecipeId (FK → Recipes)
- CategoryId (FK → Categories)

**RecipeSteps**
- RecipeStepId (GUID, PK)
- RecipeId (FK → Recipes)
- StepNumber
- Description

**Favorites** (Junction Table)
- UserId (FK → Users)
- RecipeId (FK → Recipes)
- CreatedAt


1. Check **Swagger UI** at http://localhost:5000/swagger for API testing
2. Review browser console for frontend errors


## 📝 License

This is a demonstration project for educational purposes, built with Clean Architecture and SOLID principles.

## 📧 Support

For questions or issues:
1. Check the documentation files in the project root
2. Review the troubleshooting section above
3. Test endpoints using Swagger UI
4. Check browser console for frontend errors

---

- ✅ **Backend API** - Complete with all CRUD operations
- ✅ **Frontend UI** - Complete with responsive design
- ✅ **API Integration** - Fully integrated
- ✅ **Authentication** - User login/register implemented
- ✅ **Database** - SQLite with sample data
- ✅ **Documentation** - Comprehensive docs provided
- ✅ **Demo Application** - Console demo available
- ✅ **Testing** - Manual testing complete

---

<div align="center">

**Built with ❤️ using .NET 10 and React 18**

[⬆ Back to Top](#recipecore---recipe-management-system)

</div>
```
