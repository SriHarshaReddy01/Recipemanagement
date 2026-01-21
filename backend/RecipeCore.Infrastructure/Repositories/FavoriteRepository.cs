using Microsoft.EntityFrameworkCore;
using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;
using RecipeCore.Infrastructure.Persistence;

namespace RecipeCore.Infrastructure.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly RecipeDbContext _context;

    public FavoriteRepository(RecipeDbContext context)
    {
        _context = context;
    }

    public async Task<Favorite?> GetFavoriteAsync(Guid userId, Guid recipeId)
    {
        return await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.RecipeId == recipeId);
    }

    public async Task<IEnumerable<Recipe>> GetUserFavoritesAsync(Guid userId)
    {
        return await _context.Favorites
            .Where(f => f.UserId == userId)
            .Include(f => f.Recipe)
                .ThenInclude(r => r.Owner)
            .Include(f => f.Recipe)
                .ThenInclude(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
            .Include(f => f.Recipe)
                .ThenInclude(r => r.RecipeCategories)
                    .ThenInclude(rc => rc.Category)
            .Include(f => f.Recipe)
                .ThenInclude(r => r.Steps)
            .Select(f => f.Recipe)
            .ToListAsync();
    }

    public async Task AddFavoriteAsync(Favorite favorite)
    {
        await _context.Favorites.AddAsync(favorite);
    }

    public async Task RemoveFavoriteAsync(Guid userId, Guid recipeId)
    {
        var favorite = await GetFavoriteAsync(userId, recipeId);
        if (favorite != null)
        {
            _context.Favorites.Remove(favorite);
        }
    }

    public async Task<bool> IsFavoriteAsync(Guid userId, Guid recipeId)
    {
        return await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.RecipeId == recipeId);
    }
}
