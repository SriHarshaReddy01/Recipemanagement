using Microsoft.EntityFrameworkCore;
using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;
using RecipeCore.Infrastructure.Persistence;

namespace RecipeCore.Infrastructure.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(RecipeDbContext context) : base(context)
    {
    }

    public async Task<Category?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.Name == name);
    }

    public async Task<bool> CategoryNameExistsAsync(string name)
    {
        return await _dbSet.AnyAsync(c => c.Name == name);
    }
}
