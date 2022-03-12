using Microsoft.AspNetCore.Mvc;
using SocialMedia.Data;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.Authorization;
using SocialMedia.Api.Repositories;
using System.ComponentModel.DataAnnotations;

namespace SocialMedia.Api.Controllers;

public class PostCreate
{
    [Required]
    [MaxLength(255)]
    public string Content { get; set; }

    public PostCreate(string content)
    {
        Content = content;
    }
}

[ApiController]
[Route("[controller]")]
[Authorize]
public class PostController : ODataController
{
    private readonly AppDbContext DbContext;
    private readonly UserRepository UserRepository;
    private readonly PostRepository PostRepository;

    public PostController(AppDbContext dbContext, PostRepository postRepository, UserRepository userRepository)
    {
        DbContext = dbContext;
        PostRepository = postRepository;
        UserRepository = userRepository;
    }

    [HttpGet]
    [EnableQuery]
    public IActionResult Index()
    {
        return Ok(DbContext.Posts);
    }

    [HttpGet("{id}")]
    [EnableQuery]
    public IActionResult Show(Guid id)
    {
        return Ok(DbContext.Posts.Find(id));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PostCreate body)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = UserRepository.FindByUsername(User.Identity?.Name!);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var post = PostRepository.Create(body.Content, user);
        await DbContext.Posts.AddAsync(post);
        await DbContext.SaveChangesAsync();
        post.Author = null;

        return Ok(post);
    }
}
