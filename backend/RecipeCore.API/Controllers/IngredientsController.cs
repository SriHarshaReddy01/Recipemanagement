using Microsoft.AspNetCore.Mvc;
using RecipeCore.Application.Services;
using RecipeCore.Domain.Entities;

namespace RecipeCore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IngredientsController : ControllerBase
{
    private readonly IngredientService _ingredientService;

    public IngredientsController(IngredientService ingredientService)
    {
        _ingredientService = ingredientService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ingredient>>> GetAll()
    {
        var ingredients = await _ingredientService.GetAllIngredientsAsync();
        return Ok(ingredients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Ingredient>> GetById(Guid id)
    {
        var ingredient = await _ingredientService.GetIngredientByIdAsync(id);
        if (ingredient == null)
            return NotFound();
        return Ok(ingredient);
    }

    [HttpPost]
    public async Task<ActionResult<Ingredient>> Create([FromBody] CreateIngredientRequest request)
    {
        try
        {
            var ingredient = await _ingredientService.CreateIngredientAsync(request.Name);
            return CreatedAtAction(nameof(GetById), new { id = ingredient.IngredientId }, ingredient);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public record CreateIngredientRequest(string Name);
