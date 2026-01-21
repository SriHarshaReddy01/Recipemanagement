namespace RecipeCore.Domain.Entities;

public class Category
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public ICollection<RecipeCategory> RecipeCategories { get; set; } = new List<RecipeCategory>();
}
