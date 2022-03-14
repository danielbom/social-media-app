using Microsoft.AspNetCore.Mvc;
using SocialMedia.Data;
using Microsoft.AspNetCore.OData.Routing.Controllers;
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

public class CommentCreate
{
    [Required]
    [MaxLength(255)]
    public string Content { get; set; }

    public CommentCreate(string content)
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
    private readonly CommentRepository CommentRepository;

    public PostController(AppDbContext dbContext, PostRepository postRepository, CommentRepository commentRepository, UserRepository userRepository)
    {
        DbContext = dbContext;
        PostRepository = postRepository;
        UserRepository = userRepository;
        CommentRepository = commentRepository;
    }

    [HttpGet("{userId}")]
    [EnableQuery]
    public async Task<IActionResult> Index(Guid userId)
    {
        var user = await UserRepository.FindById(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(DbContext.Posts.Where(x => x.Author!.Id == user.Id));
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

    [HttpGet("{postId}/Comment")]
    [EnableQuery]
    public IActionResult CommentIndex(Guid postId)
    {
        var post = PostRepository.FindById(postId);
        if (post == null)
            return NotFound(new { message = "Post not found" });

        return Ok(DbContext.Comments.Where(x => x.PostParent!.Id == post.Id).Select(x => new
        {
            Id = x.Id,
            Content = x.Content,
            Likes = x.Likes,
            Author = x.Author,
        }));
    }

    [HttpPost("{postId}/Comment")]
    public async Task<IActionResult> CommentCreate(Guid postId, [FromBody] CommentCreate body)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = UserRepository.FindByUsername(User.Identity?.Name!);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var post = PostRepository.FindById(postId);
        if (post == null)
            return NotFound(new { message = "Post not found" });

        var comment = CommentRepository.Create(body.Content, post, user);
        await DbContext.Comments.AddAsync(comment);
        await DbContext.SaveChangesAsync();

        return Ok(comment);
    }
}
