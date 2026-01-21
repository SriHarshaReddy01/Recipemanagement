import { Link, Outlet } from 'react-router-dom';
import { ChefHat, Home, BookOpen, Tag, Leaf, Settings, LogIn, LogOut, User, Plus, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isManageOpen, setIsManageOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center flex-shrink-0">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-xl sm:text-2xl font-bold text-gray-900">RecipeCore</span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/" className="inline-flex items-center text-sm text-gray-900 hover:text-orange-600 transition-colors font-medium">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              <Link to="/recipes" className="inline-flex items-center text-sm text-gray-900 hover:text-orange-600 transition-colors font-medium">
                <BookOpen className="h-4 w-4 mr-1" />
                Recipes
              </Link>
              <Link to="/categories" className="inline-flex items-center text-sm text-gray-900 hover:text-orange-600 transition-colors font-medium">
                <Tag className="h-4 w-4 mr-1" />
                Categories
              </Link>
              <Link to="/ingredients" className="inline-flex items-center text-sm text-gray-900 hover:text-orange-600 transition-colors font-medium">
                <Leaf className="h-4 w-4 mr-1" />
                Ingredients
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/my-recipes" className="inline-flex items-center text-sm text-gray-900 hover:text-orange-600 transition-colors font-medium">
                    <BookOpen className="h-4 w-4 mr-1" />
                    My Recipes
                  </Link>
                  <Link to="/favorites" className="inline-flex items-center text-sm text-gray-900 hover:text-orange-600 transition-colors font-medium">
                    <Heart className="h-4 w-4 mr-1" />
                    Favorites
                  </Link>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isAuthenticated && (
                <>
                  <Link to="/create-recipe" className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm">
                    <Plus className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Create</span>
                  </Link>
                  <div className="relative">
                    <button 
                      onClick={() => setIsManageOpen(!isManageOpen)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <Settings className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Manage</span>
                    </button>
                    {isManageOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsManageOpen(false)}
                        />
                        <div className="absolute right-0 bg-white shadow-xl rounded-lg mt-2 py-2 w-48 z-50 border border-gray-200">
                          <Link 
                            to="/manage-categories" 
                            onClick={() => setIsManageOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <Tag className="h-4 w-4 inline mr-2" />
                            Categories
                          </Link>
                          <Link 
                            to="/manage-ingredients" 
                            onClick={() => setIsManageOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <Leaf className="h-4 w-4 inline mr-2" />
                            Ingredients
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="hidden md:inline-flex items-center text-sm text-gray-700 font-medium">
                    <User className="h-4 w-4 mr-1 text-orange-600" />
                    {user?.username}
                  </span>
                  <button onClick={logout} className="inline-flex items-center px-3 py-1.5 text-gray-700 hover:text-orange-600 transition-colors text-sm font-medium">
                    <LogOut className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <Link to="/login" className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium shadow-sm">
                  <LogIn className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            RecipeCore - Recipe Management System © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
