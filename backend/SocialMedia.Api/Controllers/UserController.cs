using Microsoft.AspNetCore.Mvc;
using SocialMedia.Data;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.Authorization;
using SocialMedia.Api.Repositories;

namespace SocialMedia.Api.Controllers;

public class UpdateUser
{
    public string? Role { get; set; }

    public UpdateUser(string? role)
    {
        Role = role;
    }
}

[ApiController]
[Route("[controller]")]
[Authorize(Roles = "admin")]
public class UserController : ODataController
{
    private readonly AppDbContext DbContext;
    private readonly UserRepository UserRepository;

    public UserController(AppDbContext dbContext, UserRepository userRepository)
    {
        DbContext = dbContext;
        UserRepository = userRepository;
    }

    [HttpGet]
    [EnableQuery]
    public IActionResult Index()
    {
        return Ok(DbContext.Users);
    }

    [HttpGet("{id}")]
    [EnableQuery]
    public IActionResult Show([FromODataUri] Guid id)
    {
        return Ok(UserRepository.FindById(id));
    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> Update(Guid userId, [FromBody] UpdateUser body)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await UserRepository.FindById(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var updated = false;

        if (body.Role != null)
        {
            user.Role = body.Role;
            updated = true;
        }

        if (updated)
        {
            DbContext.Users.Update(user);
            await DbContext.SaveChangesAsync();
        }
        return Ok(user);
    }
}
