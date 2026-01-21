using Microsoft.EntityFrameworkCore;
using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;
using RecipeCore.Infrastructure.Persistence;

namespace RecipeCore.Infrastructure.Repositories;

public class IngredientRepository : Repository<Ingredient>, IIngredientRepository
{
    public IngredientRepository(RecipeDbContext context) : base(context)
    {
    }

    public async Task<Ingredient?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(i => i.Name == name);
    }

    public async Task<bool> IngredientNameExistsAsync(string name)
    {
        return await _dbSet.AnyAsync(i => i.Name == name);
    }
}
