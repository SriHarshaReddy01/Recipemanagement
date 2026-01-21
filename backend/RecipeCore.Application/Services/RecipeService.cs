using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;

namespace RecipeCore.Application.Services;

public class RecipeService
{
    private readonly IUnitOfWork _unitOfWork;

    public RecipeService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Recipe> CreateRecipeAsync(
        string name,
        string description,
        Guid ownerUserId,
        List<(Guid ingredientId, string quantity)> ingredients,
        List<Guid> categoryIds,
        List<string> steps)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Recipe name cannot be empty");

        if (await _unitOfWork.Recipes.RecipeNameExistsAsync(name))
            throw new InvalidOperationException($"Recipe with name '{name}' already exists");

        if (ingredients == null || ingredients.Count == 0)
            throw new ArgumentException("Recipe must have at least one ingredient");

        if (categoryIds == null || categoryIds.Count == 0)
            throw new ArgumentException("Recipe must have at least one category");

        if (steps == null || steps.Count == 0)
            throw new ArgumentException("Recipe must have at least one preparation step");

        var user = await _unitOfWork.Users.GetByIdAsync(ownerUserId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        var recipe = new Recipe
        {
            RecipeId = Guid.NewGuid(),
            Name = name,
            Description = description,
            OwnerUserId = ownerUserId,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var (ingredientId, quantity) in ingredients)
        {
            var ingredient = await _unitOfWork.Ingredients.GetByIdAsync(ingredientId);
            if (ingredient == null)
                throw new InvalidOperationException($"Ingredient with ID {ingredientId} not found");

            recipe.RecipeIngredients.Add(new RecipeIngredient
            {
                RecipeId = recipe.RecipeId,
                IngredientId = ingredientId,
                Quantity = quantity
            });
        }

        foreach (var categoryId in categoryIds)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
            if (category == null)
                throw new InvalidOperationException($"Category with ID {categoryId} not found");

            recipe.RecipeCategories.Add(new RecipeCategory
            {
                RecipeId = recipe.RecipeId,
                CategoryId = categoryId
            });
        }

        for (int i = 0; i < steps.Count; i++)
        {
            recipe.Steps.Add(new RecipeStep
            {
                RecipeStepId = Guid.NewGuid(),
                RecipeId = recipe.RecipeId,
                StepNumber = i + 1,
                Description = steps[i]
            });
        }

        await _unitOfWork.Recipes.AddAsync(recipe);
        await _unitOfWork.SaveChangesAsync();

        return recipe;
    }

    public async Task<Recipe> UpdateRecipeAsync(
        Guid recipeId,
        string name,
        string description,
        List<(Guid ingredientId, string quantity)> ingredients,
        List<Guid> categoryIds,
        List<string> steps)
    {
        var recipe = await _unitOfWork.Recipes.GetByIdWithDetailsAsync(recipeId);
        if (recipe == null)
            throw new InvalidOperationException("Recipe not found");

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Recipe name cannot be empty");

        var existingRecipe = await _unitOfWork.Recipes.GetByNameAsync(name);
        if (existingRecipe != null && existingRecipe.RecipeId != recipeId)
            throw new InvalidOperationException($"Recipe with name '{name}' already exists");

        if (ingredients == null || ingredients.Count == 0)
            throw new ArgumentException("Recipe must have at least one ingredient");

        if (categoryIds == null || categoryIds.Count == 0)
            throw new ArgumentException("Recipe must have at least one category");

        if (steps == null || steps.Count == 0)
            throw new ArgumentException("Recipe must have at least one preparation step");

        recipe.Name = name;
        recipe.Description = description;

        recipe.RecipeIngredients.Clear();
        foreach (var (ingredientId, quantity) in ingredients)
        {
            var ingredient = await _unitOfWork.Ingredients.GetByIdAsync(ingredientId);
            if (ingredient == null)
                throw new InvalidOperationException($"Ingredient with ID {ingredientId} not found");

            recipe.RecipeIngredients.Add(new RecipeIngredient
            {
                RecipeId = recipe.RecipeId,
                IngredientId = ingredientId,
                Quantity = quantity
            });
        }

        recipe.RecipeCategories.Clear();
        foreach (var categoryId in categoryIds)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
            if (category == null)
                throw new InvalidOperationException($"Category with ID {categoryId} not found");

            recipe.RecipeCategories.Add(new RecipeCategory
            {
                RecipeId = recipe.RecipeId,
                CategoryId = categoryId
            });
        }

        recipe.Steps.Clear();
        for (int i = 0; i < steps.Count; i++)
        {
            recipe.Steps.Add(new RecipeStep
            {
                RecipeStepId = Guid.NewGuid(),
                RecipeId = recipe.RecipeId,
                StepNumber = i + 1,
                Description = steps[i]
            });
        }

        await _unitOfWork.Recipes.UpdateAsync(recipe);
        await _unitOfWork.SaveChangesAsync();

        return recipe;
    }

    public async Task DeleteRecipeAsync(Guid recipeId)
    {
        var recipe = await _unitOfWork.Recipes.GetByIdAsync(recipeId);
        if (recipe == null)
            throw new InvalidOperationException("Recipe not found");

        await _unitOfWork.Recipes.DeleteAsync(recipe);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<Recipe?> GetRecipeByIdAsync(Guid recipeId)
    {
        return await _unitOfWork.Recipes.GetByIdWithDetailsAsync(recipeId);
    }

    public async Task<IEnumerable<Recipe>> GetAllRecipesAsync()
    {
        return await _unitOfWork.Recipes.GetAllAsync();
    }

    public async Task<IEnumerable<Recipe>> GetRecipesByUserAsync(Guid userId)
    {
        return await _unitOfWork.Recipes.GetByUserIdAsync(userId);
    }

    public async Task<IEnumerable<Recipe>> GetRecipesByCategoryAsync(Guid categoryId)
    {
        return await _unitOfWork.Recipes.GetByCategoryIdAsync(categoryId);
    }

    public async Task<IEnumerable<Recipe>> GetRecipesByIngredientAsync(Guid ingredientId)
    {
        return await _unitOfWork.Recipes.GetByIngredientIdAsync(ingredientId);
    }
}
