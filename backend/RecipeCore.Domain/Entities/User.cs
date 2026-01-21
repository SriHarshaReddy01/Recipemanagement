namespace RecipeCore.Domain.Entities;

public class User
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}
