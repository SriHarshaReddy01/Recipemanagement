//add new 
using Microsoft.EntityFrameworkCore;
using RecipeCore.Application.Interfaces;
using RecipeCore.Infrastructure.Persistence;
//add domain entities
using RecipeCore.Domain.Entities;

namespace RecipeCore.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly RecipeDbContext _context;
    private IUserRepository? _users;
    private IRecipeRepository? _recipes;
    private IIngredientRepository? _ingredients;
    private ICategoryRepository? _categories;
    private IFavoriteRepository? _favorites;

    public UnitOfWork(RecipeDbContext context)
    {
        _context = context;
    }

    public IUserRepository Users => _users ??= new UserRepository(_context);
    public IRecipeRepository Recipes => _recipes ??= new RecipeRepository(_context);
    public IIngredientRepository Ingredients => _ingredients ??= new IngredientRepository(_context);
    public ICategoryRepository Categories => _categories ??= new CategoryRepository(_context);
    public IFavoriteRepository Favorites => _favorites ??= new FavoriteRepository(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    //provide method for Deleting RecipeIngredint by recipeId
    public async Task DeleteRecipeIngredientsAsync(Guid recipeId)
    {
        await _context.RecipeIngredients.Where(ri => ri.RecipeId == recipeId).ExecuteDeleteAsync();
    }

    //provide method for Deleting RecipeCategory by recipeId
    public async Task DeleteRecipeCategoriesAsync(Guid recipeId)
    {
        await _context.RecipeCategories
                .Where(rc => rc.RecipeId == recipeId)
                .ExecuteDeleteAsync();
    }

    //provide method for Deleting RecipeSteps by recipeId
    public async Task DeleteRecipeStepsAsync(Guid recipeId)
    {
        await _context.RecipeSteps
                .Where(rs => rs.RecipeId == recipeId)
                .ExecuteDeleteAsync();
    }

    //provide method for Detaching tracked entities related to a recipe    
    public void DetachRecipe(Guid recipeId)
    {
        var trackedEntities = _context.ChangeTracker.Entries()
        .Where(e =>
                (e.Entity is Recipe r && r.RecipeId == recipeId) ||
                (e.Entity is RecipeIngredient ri && ri.RecipeId == recipeId) ||
                (e.Entity is RecipeCategory rc && rc.RecipeId == recipeId) ||
                (e.Entity is RecipeStep rs && rs.RecipeId == recipeId))
                .ToList();
        foreach (var entity in trackedEntities)
        {
            entity.State = EntityState.Detached;

        }
    }


    public void Dispose()
    {
        _context.Dispose();
    }
}
