using Microsoft.EntityFrameworkCore;
using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;
using RecipeCore.Infrastructure.Persistence;

namespace RecipeCore.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(RecipeDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<bool> UsernameExistsAsync(string username)
    {
        return await _dbSet.AnyAsync(u => u.Username == username);
    }
}
