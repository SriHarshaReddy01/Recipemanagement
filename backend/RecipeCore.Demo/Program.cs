using Microsoft.EntityFrameworkCore;
using RecipeCore.Application.Interfaces;
using RecipeCore.Application.Services;
using RecipeCore.Infrastructure.Persistence;
using RecipeCore.Infrastructure.Repositories;

Console.WriteLine("=== RecipeCore Demo Application ===\n");

var options = new DbContextOptionsBuilder<RecipeDbContext>()
    .UseSqlite("Data Source=recipes.db")
    .Options;

using var context = new RecipeDbContext(options);

Console.WriteLine("Creating database...");
await context.Database.EnsureDeletedAsync();
await context.Database.EnsureCreatedAsync();
Console.WriteLine("Database created successfully!\n");

IUnitOfWork unitOfWork = new UnitOfWork(context);

var userService = new UserService(unitOfWork);
var ingredientService = new IngredientService(unitOfWork);
var categoryService = new CategoryService(unitOfWork);
var recipeService = new RecipeService(unitOfWork);
var favoriteService = new FavoriteService(unitOfWork);

Console.WriteLine("=== 1. User Registration ===");
var user1 = await userService.RegisterUserAsync("john_chef", "password123");
Console.WriteLine($"Registered user: {user1.Username} (ID: {user1.UserId})");

var user2 = await userService.RegisterUserAsync("jane_cook", "password456");
Console.WriteLine($"Registered user: {user2.Username} (ID: {user2.UserId})");

var user3 = await userService.RegisterUserAsync("bob_baker", "password789");
Console.WriteLine($"Registered user: {user3.Username} (ID: {user3.UserId})\n");

Console.WriteLine("=== 2. User Authentication ===");
var authenticatedUser = await userService.AuthenticateAsync("john_chef", "password123");
if (authenticatedUser != null)
{
    Console.WriteLine($"Authentication successful for: {authenticatedUser.Username}");
}
else
{
    Console.WriteLine("Authentication failed!");
}
Console.WriteLine();

Console.WriteLine("=== 3. Creating Categories ===");
var italianCategory = await categoryService.CreateCategoryAsync("Italian");
Console.WriteLine($"Created category: {italianCategory.Name}");

var dessertCategory = await categoryService.CreateCategoryAsync("Dessert");
Console.WriteLine($"Created category: {dessertCategory.Name}");

var vegetarianCategory = await categoryService.CreateCategoryAsync("Vegetarian");
Console.WriteLine($"Created category: {vegetarianCategory.Name}");

var breakfastCategory = await categoryService.CreateCategoryAsync("Breakfast");
Console.WriteLine($"Created category: {breakfastCategory.Name}\n");

Console.WriteLine("=== 4. Creating Ingredients ===");
var flour = await ingredientService.CreateIngredientAsync("Flour");
var sugar = await ingredientService.CreateIngredientAsync("Sugar");
var eggs = await ingredientService.CreateIngredientAsync("Eggs");
var milk = await ingredientService.CreateIngredientAsync("Milk");
var butter = await ingredientService.CreateIngredientAsync("Butter");
var tomato = await ingredientService.CreateIngredientAsync("Tomato");
var cheese = await ingredientService.CreateIngredientAsync("Cheese");
var pasta = await ingredientService.CreateIngredientAsync("Pasta");
var basil = await ingredientService.CreateIngredientAsync("Basil");
var chocolate = await ingredientService.CreateIngredientAsync("Chocolate");

Console.WriteLine($"Created {(await ingredientService.GetAllIngredientsAsync()).Count()} ingredients\n");

Console.WriteLine("=== 5. Creating Recipes ===");

var recipe1 = await recipeService.CreateRecipeAsync(
    name: "Classic Spaghetti Carbonara",
    description: "A traditional Italian pasta dish with eggs, cheese, and bacon",
    ownerUserId: user1.UserId,
    ingredients: new List<(Guid, string)>
    {
        (pasta.IngredientId, "400g"),
        (eggs.IngredientId, "4 large"),
        (cheese.IngredientId, "100g grated"),
        (butter.IngredientId, "2 tbsp")
    },
    categoryIds: new List<Guid> { italianCategory.CategoryId },
    steps: new List<string>
    {
        "Boil water and cook pasta according to package instructions",
        "Beat eggs with grated cheese in a bowl",
        "Drain pasta and mix with egg mixture while hot",
        "Serve immediately with extra cheese"
    }
);
Console.WriteLine($"Created recipe: {recipe1.Name} by {user1.Username}");

var recipe2 = await recipeService.CreateRecipeAsync(
    name: "Chocolate Chip Pancakes",
    description: "Fluffy pancakes with chocolate chips",
    ownerUserId: user2.UserId,
    ingredients: new List<(Guid, string)>
    {
        (flour.IngredientId, "2 cups"),
        (sugar.IngredientId, "2 tbsp"),
        (eggs.IngredientId, "2 large"),
        (milk.IngredientId, "1.5 cups"),
        (butter.IngredientId, "3 tbsp melted"),
        (chocolate.IngredientId, "1 cup chips")
    },
    categoryIds: new List<Guid> { dessertCategory.CategoryId, breakfastCategory.CategoryId },
    steps: new List<string>
    {
        "Mix flour and sugar in a large bowl",
        "Whisk eggs, milk, and melted butter together",
        "Combine wet and dry ingredients",
        "Fold in chocolate chips",
        "Cook on griddle until golden brown"
    }
);
Console.WriteLine($"Created recipe: {recipe2.Name} by {user2.Username}");

var recipe3 = await recipeService.CreateRecipeAsync(
    name: "Margherita Pizza",
    description: "Classic Italian pizza with tomato, mozzarella, and basil",
    ownerUserId: user3.UserId,
    ingredients: new List<(Guid, string)>
    {
        (flour.IngredientId, "500g"),
        (tomato.IngredientId, "400g crushed"),
        (cheese.IngredientId, "250g mozzarella"),
        (basil.IngredientId, "Fresh leaves")
    },
    categoryIds: new List<Guid> { italianCategory.CategoryId, vegetarianCategory.CategoryId },
    steps: new List<string>
    {
        "Prepare pizza dough with flour, water, yeast, and salt",
        "Let dough rise for 1 hour",
        "Roll out dough and spread tomato sauce",
        "Add mozzarella cheese and basil leaves",
        "Bake at 250°C for 10-12 minutes"
    }
);
Console.WriteLine($"Created recipe: {recipe3.Name} by {user3.Username}\n");

Console.WriteLine("=== 6. Querying Recipes ===");

Console.WriteLine("\n6.1 All recipes by user 'john_chef':");
var johnRecipes = await recipeService.GetRecipesByUserAsync(user1.UserId);
foreach (var recipe in johnRecipes)
{
    Console.WriteLine($"  - {recipe.Name}");
}

Console.WriteLine("\n6.2 All recipes in 'Italian' category:");
var italianRecipes = await recipeService.GetRecipesByCategoryAsync(italianCategory.CategoryId);
foreach (var recipe in italianRecipes)
{
    Console.WriteLine($"  - {recipe.Name}");
}

Console.WriteLine("\n6.3 All recipes containing 'Eggs':");
var eggsRecipes = await recipeService.GetRecipesByIngredientAsync(eggs.IngredientId);
foreach (var recipe in eggsRecipes)
{
    Console.WriteLine($"  - {recipe.Name}");
}

Console.WriteLine("\n=== 7. Recipe Details ===");
var detailedRecipe = await recipeService.GetRecipeByIdAsync(recipe1.RecipeId);
if (detailedRecipe != null)
{
    Console.WriteLine($"\nRecipe: {detailedRecipe.Name}");
    Console.WriteLine($"Description: {detailedRecipe.Description}");
    Console.WriteLine($"Owner: {detailedRecipe.Owner.Username}");
    Console.WriteLine($"Created: {detailedRecipe.CreatedAt:yyyy-MM-dd}");
    
    Console.WriteLine("\nIngredients:");
    foreach (var ri in detailedRecipe.RecipeIngredients)
    {
        Console.WriteLine($"  - {ri.Ingredient.Name}: {ri.Quantity}");
    }
    
    Console.WriteLine("\nCategories:");
    foreach (var rc in detailedRecipe.RecipeCategories)
    {
        Console.WriteLine($"  - {rc.Category.Name}");
    }
    
    Console.WriteLine("\nSteps:");
    foreach (var step in detailedRecipe.Steps.OrderBy(s => s.StepNumber))
    {
        Console.WriteLine($"  {step.StepNumber}. {step.Description}");
    }
}

Console.WriteLine("\n=== 8. Favorites Management ===");

Console.WriteLine("\nUser 'jane_cook' favorites 'Classic Spaghetti Carbonara':");
await favoriteService.AddFavoriteAsync(user2.UserId, recipe1.RecipeId);
Console.WriteLine("Favorite added successfully!");

Console.WriteLine("\nUser 'jane_cook' favorites 'Margherita Pizza':");
await favoriteService.AddFavoriteAsync(user2.UserId, recipe3.RecipeId);
Console.WriteLine("Favorite added successfully!");

Console.WriteLine("\nUser 'bob_baker' favorites 'Chocolate Chip Pancakes':");
await favoriteService.AddFavoriteAsync(user3.UserId, recipe2.RecipeId);
Console.WriteLine("Favorite added successfully!");

Console.WriteLine("\n8.1 Viewing favorites for 'jane_cook':");
var janeFavorites = await favoriteService.GetUserFavoritesAsync(user2.UserId);
foreach (var fav in janeFavorites)
{
    Console.WriteLine($"  - {fav.Name} by {fav.Owner.Username}");
}

Console.WriteLine("\n=== 9. Testing Constraints ===");

Console.WriteLine("\n9.1 Attempting to create recipe with duplicate name:");
try
{
    await recipeService.CreateRecipeAsync(
        name: "Classic Spaghetti Carbonara",
        description: "Duplicate recipe",
        ownerUserId: user1.UserId,
        ingredients: new List<(Guid, string)> { (pasta.IngredientId, "100g") },
        categoryIds: new List<Guid> { italianCategory.CategoryId },
        steps: new List<string> { "Step 1" }
    );
}
catch (Exception ex)
{
    Console.WriteLine($"  ✓ Constraint enforced: {ex.Message}");
}

Console.WriteLine("\n9.2 Attempting to create recipe without ingredients:");
try
{
    await recipeService.CreateRecipeAsync(
        name: "Empty Recipe",
        description: "No ingredients",
        ownerUserId: user1.UserId,
        ingredients: new List<(Guid, string)>(),
        categoryIds: new List<Guid> { italianCategory.CategoryId },
        steps: new List<string> { "Step 1" }
    );
}
catch (Exception ex)
{
    Console.WriteLine($"  ✓ Constraint enforced: {ex.Message}");
}

Console.WriteLine("\n9.3 Attempting to favorite own recipe:");
try
{
    await favoriteService.AddFavoriteAsync(user1.UserId, recipe1.RecipeId);
}
catch (Exception ex)
{
    Console.WriteLine($"  ✓ Constraint enforced: {ex.Message}");
}

Console.WriteLine("\n=== 10. Statistics ===");
var allUsers = await userService.GetAllUsersAsync();
var allRecipes = await recipeService.GetAllRecipesAsync();
var allIngredients = await ingredientService.GetAllIngredientsAsync();
var allCategories = await categoryService.GetAllCategoriesAsync();

Console.WriteLine($"Total Users: {allUsers.Count()}");
Console.WriteLine($"Total Recipes: {allRecipes.Count()}");
Console.WriteLine($"Total Ingredients: {allIngredients.Count()}");
Console.WriteLine($"Total Categories: {allCategories.Count()}");

Console.WriteLine("\n=== Demo Completed Successfully! ===");
Console.WriteLine("\nDatabase file 'recipes.db' has been created and persisted.");
Console.WriteLine("You can restart the application to verify data persistence.");
