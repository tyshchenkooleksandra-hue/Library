using Microsoft.AspNetCore.Mvc;
using Library.Business.Interfaces;
using Library.Business.DTOs.Auth;

namespace Library.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(
        IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        var result = await _authService.RegisterAsync(model);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new
        {
            message = "User registered successfully!"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var response = await _authService.LoginAsync(model);

        if (!response.Success)
        {
            return Unauthorized(new
            {
                message = response.Message
            });
        }

        return Ok(response.Data);
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string email, string token)
    {
        var result =
            await _authService.ConfirmEmailAsync(email,token);

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                message = "Invalid confirmation token."
            });
        }

        return Ok(new
        {
            message =  "Email confirmed successfully!"
        });
    }
}
