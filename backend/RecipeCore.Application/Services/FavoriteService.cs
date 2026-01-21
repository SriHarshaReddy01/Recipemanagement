using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;

namespace RecipeCore.Application.Services;

public class FavoriteService
{
    private readonly IUnitOfWork _unitOfWork;

    public FavoriteService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task AddFavoriteAsync(Guid userId, Guid recipeId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        var recipe = await _unitOfWork.Recipes.GetByIdAsync(recipeId);
        if (recipe == null)
            throw new InvalidOperationException("Recipe not found");

        if (recipe.OwnerUserId == userId)
            throw new InvalidOperationException("Users cannot favorite their own recipes");

        if (await _unitOfWork.Favorites.IsFavoriteAsync(userId, recipeId))
            throw new InvalidOperationException("Recipe is already in favorites");

        var favorite = new Favorite
        {
            UserId = userId,
            RecipeId = recipeId,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Favorites.AddFavoriteAsync(favorite);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveFavoriteAsync(Guid userId, Guid recipeId)
    {
        if (!await _unitOfWork.Favorites.IsFavoriteAsync(userId, recipeId))
            throw new InvalidOperationException("Recipe is not in favorites");

        await _unitOfWork.Favorites.RemoveFavoriteAsync(userId, recipeId);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<Recipe>> GetUserFavoritesAsync(Guid userId)
    {
        return await _unitOfWork.Favorites.GetUserFavoritesAsync(userId);
    }

    public async Task<bool> IsFavoriteAsync(Guid userId, Guid recipeId)
    {
        return await _unitOfWork.Favorites.IsFavoriteAsync(userId, recipeId);
    }
}
