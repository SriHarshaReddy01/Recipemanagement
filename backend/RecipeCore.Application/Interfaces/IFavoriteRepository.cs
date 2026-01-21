using RecipeCore.Domain.Entities;

namespace RecipeCore.Application.Interfaces;

public interface IFavoriteRepository
{
    Task<Favorite?> GetFavoriteAsync(Guid userId, Guid recipeId);
    Task<IEnumerable<Recipe>> GetUserFavoritesAsync(Guid userId);
    Task AddFavoriteAsync(Favorite favorite);
    Task RemoveFavoriteAsync(Guid userId, Guid recipeId);
    Task<bool> IsFavoriteAsync(Guid userId, Guid recipeId);
}
