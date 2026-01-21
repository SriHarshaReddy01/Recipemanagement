using Microsoft.AspNetCore.Mvc;
using RecipeCore.Application.Services;
using RecipeCore.Domain.Entities;

namespace RecipeCore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var user = await _userService.RegisterUserAsync(request.Username, request.Password);
            return CreatedAtAction(nameof(GetById), new { id = user.UserId }, user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("authenticate")]
    public async Task<ActionResult<User>> Authenticate([FromBody] AuthenticateRequest request)
    {
        var user = await _userService.AuthenticateAsync(request.Username, request.Password);
        if (user == null)
            return Unauthorized(new { error = "Invalid credentials" });
        return Ok(user);
    }
}

public record RegisterRequest(string Username, string Password);
public record AuthenticateRequest(string Username, string Password);
