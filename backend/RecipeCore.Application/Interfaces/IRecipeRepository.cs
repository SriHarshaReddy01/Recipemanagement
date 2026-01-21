using RecipeCore.Domain.Entities;

namespace RecipeCore.Application.Interfaces;

public interface IRecipeRepository : IRepository<Recipe>
{
    Task<Recipe?> GetByNameAsync(string name);
    Task<bool> RecipeNameExistsAsync(string name);
    Task<IEnumerable<Recipe>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Recipe>> GetByCategoryIdAsync(Guid categoryId);
    Task<IEnumerable<Recipe>> GetByIngredientIdAsync(Guid ingredientId);
    Task<Recipe?> GetByIdWithDetailsAsync(Guid id);
}
