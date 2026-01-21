using Microsoft.EntityFrameworkCore;
using RecipeCore.Application.Interfaces;
using RecipeCore.Application.Services;
using RecipeCore.Infrastructure.Persistence;
using RecipeCore.Infrastructure.Repositories;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<RecipeDbContext>(options =>
    options.UseSqlite("Data Source=recipes.db"));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RecipeService>();
builder.Services.AddScoped<IngredientService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<FavoriteService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<RecipeDbContext>();
    await context.Database.EnsureCreatedAsync();
    
    if (!context.Users.Any())
    {
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var userService = scope.ServiceProvider.GetRequiredService<UserService>();
        var ingredientService = scope.ServiceProvider.GetRequiredService<IngredientService>();
        var categoryService = scope.ServiceProvider.GetRequiredService<CategoryService>();
        var recipeService = scope.ServiceProvider.GetRequiredService<RecipeService>();
        
        var user1 = await userService.RegisterUserAsync("john_chef", "password123");
        var user2 = await userService.RegisterUserAsync("jane_cook", "password456");
        var user3 = await userService.RegisterUserAsync("bob_baker", "password789");
        
        var italian = await categoryService.CreateCategoryAsync("Italian");
        var dessert = await categoryService.CreateCategoryAsync("Dessert");
        var vegetarian = await categoryService.CreateCategoryAsync("Vegetarian");
        var breakfast = await categoryService.CreateCategoryAsync("Breakfast");
        
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
        
        await recipeService.CreateRecipeAsync(
            "Classic Spaghetti Carbonara",
            "A traditional Italian pasta dish with eggs, cheese, and bacon",
            user1.UserId,
            new List<(Guid, string)>
            {
                (pasta.IngredientId, "400g"),
                (eggs.IngredientId, "4 large"),
                (cheese.IngredientId, "100g grated"),
                (butter.IngredientId, "2 tbsp")
            },
            new List<Guid> { italian.CategoryId },
            new List<string>
            {
                "Boil water and cook pasta according to package instructions",
                "Beat eggs with grated cheese in a bowl",
                "Drain pasta and mix with egg mixture while hot",
                "Serve immediately with extra cheese"
            }
        );
        
        await recipeService.CreateRecipeAsync(
            "Chocolate Chip Pancakes",
            "Fluffy pancakes with chocolate chips",
            user2.UserId,
            new List<(Guid, string)>
            {
                (flour.IngredientId, "2 cups"),
                (sugar.IngredientId, "2 tbsp"),
                (eggs.IngredientId, "2 large"),
                (milk.IngredientId, "1.5 cups"),
                (butter.IngredientId, "3 tbsp melted"),
                (chocolate.IngredientId, "1 cup chips")
            },
            new List<Guid> { dessert.CategoryId, breakfast.CategoryId },
            new List<string>
            {
                "Mix flour and sugar in a large bowl",
                "Whisk eggs, milk, and melted butter together",
                "Combine wet and dry ingredients",
                "Fold in chocolate chips",
                "Cook on griddle until golden brown"
            }
        );
        
        await recipeService.CreateRecipeAsync(
            "Margherita Pizza",
            "Classic Italian pizza with tomato, mozzarella, and basil",
            user3.UserId,
            new List<(Guid, string)>
            {
                (flour.IngredientId, "500g"),
                (tomato.IngredientId, "400g crushed"),
                (cheese.IngredientId, "250g mozzarella"),
                (basil.IngredientId, "Fresh leaves")
            },
            new List<Guid> { italian.CategoryId, vegetarian.CategoryId },
            new List<string>
            {
                "Prepare pizza dough with flour, water, yeast, and salt",
                "Let dough rise for 1 hour",
                "Roll out dough and spread tomato sauce",
                "Add mozzarella cheese and basil leaves",
                "Bake at 250°C for 10-12 minutes"
            }
        );
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
