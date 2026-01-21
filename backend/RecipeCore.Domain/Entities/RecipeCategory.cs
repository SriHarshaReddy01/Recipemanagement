namespace RecipeCore.Domain.Entities;

public class RecipeCategory
{
    public Guid RecipeId { get; set; }
    public Guid CategoryId { get; set; }
    
    public Recipe Recipe { get; set; } = null!;
    public Category Category { get; set; } = null!;
}
