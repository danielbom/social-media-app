using Microsoft.AspNetCore.Mvc;
using SocialMedia.Data;
using SocialMedia.Api.Services;
using BCryptNet = BCrypt.Net.BCrypt;

namespace SocialMedia.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    public class AuthLogin
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
    public class AuthRegister
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }

    private readonly AppDbContext DbContext;

    public AuthController(AppDbContext dbContext)
    {
        DbContext = dbContext;
    }

    [HttpPost]
    [Route("Login")]
    public async Task<ActionResult<dynamic>> Login([FromBody] AuthLogin? body)
    {
        if (body == null || body.Username == null)
            return BadRequest(new { message = "Invalid body" });

        var user = DbContext.Users.SingleOrDefault(x => x.Username == body.Username);
        if (user == null)
            return NotFound(new { message = "User not found" });

        bool verified = BCryptNet.Verify(body.Password, user.Password);
        if (!verified)
            return Unauthorized(new { message = "Invalid password" });

        var token = await TokenService.GenerateToken(user);
        user.Password = "";

        return new
        {
            user = new
            {
                id = user.Id,
                username = user.Username,
                role = user.Role
            },
            token = token
        };
    }

    [HttpPost]
    [Route("Register")]
    public async Task<ActionResult<dynamic>> Register([FromBody] AuthRegister? body)
    {
        if (body == null || body.Username == null || body.Password == null)
            return BadRequest(new { message = "Invalid body" });

        var hash = BCrypt.Net.BCrypt.HashPassword(body.Password);
        var user = new User(Guid.NewGuid(), body.Username, hash, "user");
        await DbContext.Users.AddAsync(user);
        await DbContext.SaveChangesAsync();
        user.Password = "";

        return new
        {
            id = user.Id,
            username = user.Username,
            role = user.Role
        };
    }
}
