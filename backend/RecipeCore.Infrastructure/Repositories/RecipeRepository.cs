using Microsoft.EntityFrameworkCore;
using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;
using RecipeCore.Infrastructure.Persistence;

namespace RecipeCore.Infrastructure.Repositories;

public class RecipeRepository : Repository<Recipe>, IRecipeRepository
{
    public RecipeRepository(RecipeDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Recipe>> GetAllAsync()
    {
        return await _dbSet
            .Include(r => r.Owner)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
            .Include(r => r.RecipeCategories)
                .ThenInclude(rc => rc.Category)
            .Include(r => r.Steps)
            .ToListAsync();
    }

    public async Task<Recipe?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(r => r.Name == name);
    }

    public async Task<bool> RecipeNameExistsAsync(string name)
    {
        return await _dbSet.AnyAsync(r => r.Name == name);
    }

    public async Task<IEnumerable<Recipe>> GetByUserIdAsync(Guid userId)
    {
        return await _dbSet
            .Where(r => r.OwnerUserId == userId)
            .Include(r => r.Owner)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
            .Include(r => r.RecipeCategories)
                .ThenInclude(rc => rc.Category)
            .Include(r => r.Steps)
            .ToListAsync();
    }

    public async Task<IEnumerable<Recipe>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _dbSet
            .Where(r => r.RecipeCategories.Any(rc => rc.CategoryId == categoryId))
            .Include(r => r.Owner)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
            .Include(r => r.RecipeCategories)
                .ThenInclude(rc => rc.Category)
            .Include(r => r.Steps)
            .ToListAsync();
    }

    public async Task<IEnumerable<Recipe>> GetByIngredientIdAsync(Guid ingredientId)
    {
        return await _dbSet
            .Where(r => r.RecipeIngredients.Any(ri => ri.IngredientId == ingredientId))
            .Include(r => r.Owner)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
            .Include(r => r.RecipeCategories)
                .ThenInclude(rc => rc.Category)
            .Include(r => r.Steps)
            .ToListAsync();
    }

    public async Task<Recipe?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(r => r.Owner)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
            .Include(r => r.RecipeCategories)
                .ThenInclude(rc => rc.Category)
            .Include(r => r.Steps.OrderBy(s => s.StepNumber))
            .FirstOrDefaultAsync(r => r.RecipeId == id);
    }

    // Methods to add child entities to DBcontext
    public async Task AddRecipeIngredientAsync(RecipeIngredient recipeIngredient)
    {
        await _context.RecipeIngredients.AddAsync(recipeIngredient);
    }
    public async Task AddRecipeCategoryAsync(RecipeCategory recipeCategory)
    {
        await _context.RecipeCategories.AddAsync(recipeCategory);
    }
    public async Task AddRecipeStepAsync(RecipeStep recipeStep)
    {
        await _context.RecipeSteps.AddAsync(recipeStep);
    }
}
