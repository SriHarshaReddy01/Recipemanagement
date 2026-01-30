namespace RecipeCore.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IRecipeRepository Recipes { get; }
    IIngredientRepository Ingredients { get; }
    ICategoryRepository Categories { get; }
    IFavoriteRepository Favorites { get; }

    Task<int> SaveChangesAsync();

    //provides methods for deleting child entities and clear change tracker
    Task DeleteRecipeIngredientsAsync(Guid recipeId);
    Task DeleteRecipeCategoriesAsync(Guid recipeId);
    Task DeleteRecipeStepsAsync(Guid recipeId);
    void DetachRecipe(Guid recipeId);
}
