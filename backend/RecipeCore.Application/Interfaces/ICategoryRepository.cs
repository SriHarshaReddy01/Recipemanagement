using RecipeCore.Domain.Entities;

namespace RecipeCore.Application.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetByNameAsync(string name);
    Task<bool> CategoryNameExistsAsync(string name);
}
