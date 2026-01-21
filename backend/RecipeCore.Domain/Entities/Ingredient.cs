namespace RecipeCore.Domain.Entities;

public class Ingredient
{
    public Guid IngredientId { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
}
