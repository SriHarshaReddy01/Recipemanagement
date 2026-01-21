using RecipeCore.Domain.Entities;

namespace RecipeCore.Application.Interfaces;

public interface IIngredientRepository : IRepository<Ingredient>
{
    Task<Ingredient?> GetByNameAsync(string name);
    Task<bool> IngredientNameExistsAsync(string name);
}
