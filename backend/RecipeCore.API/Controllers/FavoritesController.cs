using Microsoft.AspNetCore.Mvc;
using RecipeCore.Application.Services;
using RecipeCore.Domain.Entities;

namespace RecipeCore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly FavoriteService _favoriteService;

    public FavoritesController(FavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetUserFavorites(Guid userId)
    {
        var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
        return Ok(favorites);
    }

    [HttpPost]
    public async Task<ActionResult> AddFavorite([FromBody] AddFavoriteRequest request)
    {
        try
        {
            await _favoriteService.AddFavoriteAsync(request.UserId, request.RecipeId);
            return Ok(new { message = "Favorite added successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveFavorite([FromBody] RemoveFavoriteRequest request)
    {
        try
        {
            await _favoriteService.RemoveFavoriteAsync(request.UserId, request.RecipeId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("check")]
    public async Task<ActionResult<bool>> IsFavorite([FromQuery] Guid userId, [FromQuery] Guid recipeId)
    {
        var isFavorite = await _favoriteService.IsFavoriteAsync(userId, recipeId);
        return Ok(new { isFavorite });
    }
}

public record AddFavoriteRequest(Guid UserId, Guid RecipeId);
public record RemoveFavoriteRequest(Guid UserId, Guid RecipeId);
