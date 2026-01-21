using Microsoft.AspNetCore.Mvc;
using RecipeCore.Application.Services;
using RecipeCore.Domain.Entities;

namespace RecipeCore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly RecipeService _recipeService;

    public RecipesController(RecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetAll()
    {
        var recipes = await _recipeService.GetAllRecipesAsync();
        return Ok(recipes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Recipe>> GetById(Guid id)
    {
        var recipe = await _recipeService.GetRecipeByIdAsync(id);
        if (recipe == null)
            return NotFound();
        return Ok(recipe);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetByUser(Guid userId)
    {
        var recipes = await _recipeService.GetRecipesByUserAsync(userId);
        return Ok(recipes);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetByCategory(Guid categoryId)
    {
        var recipes = await _recipeService.GetRecipesByCategoryAsync(categoryId);
        return Ok(recipes);
    }

    [HttpGet("ingredient/{ingredientId}")]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetByIngredient(Guid ingredientId)
    {
        var recipes = await _recipeService.GetRecipesByIngredientAsync(ingredientId);
        return Ok(recipes);
    }

    [HttpPost]
    public async Task<ActionResult<Recipe>> Create([FromBody] CreateRecipeRequest request)
    {
        try
        {
            var ingredients = request.Ingredients.Select(i => (i.IngredientId, i.Quantity)).ToList();
            var recipe = await _recipeService.CreateRecipeAsync(
                request.Name,
                request.Description,
                request.OwnerUserId,
                ingredients,
                request.CategoryIds,
                request.Steps
            );
            return CreatedAtAction(nameof(GetById), new { id = recipe.RecipeId }, recipe);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Recipe>> Update(Guid id, [FromBody] UpdateRecipeRequest request)
    {
        try
        {
            var ingredients = request.Ingredients.Select(i => (i.IngredientId, i.Quantity)).ToList();
            var recipe = await _recipeService.UpdateRecipeAsync(
                id,
                request.Name,
                request.Description,
                ingredients,
                request.CategoryIds,
                request.Steps
            );
            return Ok(recipe);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _recipeService.DeleteRecipeAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public record CreateRecipeRequest(
    string Name,
    string Description,
    Guid OwnerUserId,
    List<RecipeIngredientDto> Ingredients,
    List<Guid> CategoryIds,
    List<string> Steps
);

public record UpdateRecipeRequest(
    string Name,
    string Description,
    List<RecipeIngredientDto> Ingredients,
    List<Guid> CategoryIds,
    List<string> Steps
);

public record RecipeIngredientDto(Guid IngredientId, string Quantity);
