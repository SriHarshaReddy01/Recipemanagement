using RecipeCore.Application.Interfaces;
using RecipeCore.Infrastructure.Persistence;

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

    public void Dispose()
    {
        _context.Dispose();
    }
}
