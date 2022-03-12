using Microsoft.AspNetCore.Mvc;
using SocialMedia.Data;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.Authorization;

namespace SocialMedia.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class PostController : ODataController
{
    public class PostCreate
    {
        public string? Content { get; set; }
    }

    private readonly AppDbContext DbContext;
    private readonly ILogger<PostController> Logger;

    public PostController(AppDbContext dbContext, ILogger<PostController> logger)
    {
        DbContext = dbContext;
        Logger = logger;
    }

    [HttpGet]
    [EnableQuery]
    public IActionResult Index()
    {
        return Ok(DbContext.Posts);
    }

    [HttpGet("{id}")]
    [EnableQuery]
    public IActionResult Show([FromODataUri] Guid id)
    {
        return Ok(DbContext.Posts.Find(id));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] PostCreate? body)
    {
        if (body == null || body.Content == null)
            return BadRequest(new { message = "Invalid body" });

        var username = User.Identity?.Name;
        var user = DbContext.Users.SingleOrDefault(x => x.Username == username);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var post = new Post(Guid.NewGuid(), body.Content)
        {
            Author = user
        };
        await DbContext.Posts.AddAsync(post);
        await DbContext.SaveChangesAsync();
        post.Author.Password = "";

        return Ok(post);
    }
}
