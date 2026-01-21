namespace RecipeCore.Domain.Entities;

public class RecipeStep
{
    public Guid RecipeStepId { get; set; }
    public Guid RecipeId { get; set; }
    public int StepNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    
    public Recipe Recipe { get; set; } = null!;
}
