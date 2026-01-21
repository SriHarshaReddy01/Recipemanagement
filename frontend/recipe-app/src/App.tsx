import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Categories from './pages/Categories';
import Ingredients from './pages/Ingredients';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryManagement from './pages/CategoryManagement';
import IngredientManagement from './pages/IngredientManagement';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="ingredients" element={<Ingredients />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="create-recipe" element={<CreateRecipe />} />
            <Route path="edit-recipe/:id" element={<EditRecipe />} />
            <Route path="my-recipes" element={<MyRecipes />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="manage-categories" element={<CategoryManagement />} />
            <Route path="manage-ingredients" element={<IngredientManagement />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
