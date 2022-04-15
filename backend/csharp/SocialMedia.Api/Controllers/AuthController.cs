using Microsoft.AspNetCore.Mvc;
using SocialMedia.Data;
using SocialMedia.Api.Services;
using SocialMedia.Api.Repositories;
using System.ComponentModel.DataAnnotations;

namespace SocialMedia.Api.Controllers;

public class AuthLogin
{
    [Required]
    [MinLength(3)]
    [MaxLength(30)]
    public string Username { get; set; }
    [Required]
    [MinLength(8)]
    [MaxLength(30)]
    public string Password { get; set; }

    public AuthLogin(string username, string password)
    {
        Username = username;
        Password = password;
    }
}
public class AuthRegister
{
    [Required]
    [MinLength(3)]
    [MaxLength(30)]
    public string Username { get; set; }
    [Required]
    [MinLength(8)]
    [MaxLength(30)]
    public string Password { get; set; }

    public AuthRegister(string username, string password)
    {
        Username = username;
        Password = password;
    }
}

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext DbContext;
    private readonly UserRepository UserRepository;
    private readonly TokenService TokenService;
    private readonly PasswordService PasswordService;

    public AuthController(AppDbContext dbContext, TokenService tokenService, PasswordService passwordService, UserRepository userRepository)
    {
        DbContext = dbContext;
        UserRepository = userRepository;
        TokenService = tokenService;
        PasswordService = passwordService;
    }

    [HttpPost]
    [Route("Login")]
    public async Task<ActionResult<dynamic>> Login([FromBody] AuthLogin body)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var user = UserRepository.FindByUsername(body.Username);
        if (user == null)
            return NotFound(new { message = "User not found" });

        bool verified = PasswordService.Verify(body.Password, user.Password);
        if (!verified)
            return Unauthorized(new { message = "Invalid password" });

        var token = await TokenService.GenerateToken(user);

        return new { token, user };
    }

    [HttpPost]
    [Route("Register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<dynamic>> Register([FromBody] AuthRegister body)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var userExists = UserRepository.FindByUsername(body.Username);
        if (userExists != null)
            return BadRequest(new { message = "User already exists" });

        var user = UserRepository.Create(body.Username, body.Password);
        await DbContext.Users.AddAsync(user);
        await DbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
    }
}
