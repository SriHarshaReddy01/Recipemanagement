using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;

namespace RecipeCore.Application.Services;

public class IngredientService
{
    private readonly IUnitOfWork _unitOfWork;

    public IngredientService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Ingredient> CreateIngredientAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Ingredient name cannot be empty");

        if (await _unitOfWork.Ingredients.IngredientNameExistsAsync(name))
            throw new InvalidOperationException($"Ingredient with name '{name}' already exists");

        var ingredient = new Ingredient
        {
            IngredientId = Guid.NewGuid(),
            Name = name
        };

        await _unitOfWork.Ingredients.AddAsync(ingredient);
        await _unitOfWork.SaveChangesAsync();

        return ingredient;
    }

    public async Task<Ingredient> GetOrCreateIngredientAsync(string name)
    {
        var existing = await _unitOfWork.Ingredients.GetByNameAsync(name);
        if (existing != null)
            return existing;

        return await CreateIngredientAsync(name);
    }

    public async Task<Ingredient?> GetIngredientByIdAsync(Guid ingredientId)
    {
        return await _unitOfWork.Ingredients.GetByIdAsync(ingredientId);
    }

    public async Task<Ingredient?> GetIngredientByNameAsync(string name)
    {
        return await _unitOfWork.Ingredients.GetByNameAsync(name);
    }

    public async Task<IEnumerable<Ingredient>> GetAllIngredientsAsync()
    {
        return await _unitOfWork.Ingredients.GetAllAsync();
    }
}
