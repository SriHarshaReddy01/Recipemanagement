namespace RecipeCore.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IRecipeRepository Recipes { get; }
    IIngredientRepository Ingredients { get; }
    ICategoryRepository Categories { get; }
    IFavoriteRepository Favorites { get; }
    
    Task<int> SaveChangesAsync();
}
