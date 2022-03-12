using Microsoft.AspNetCore.Mvc;
using SocialMedia.Data;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.Authorization;
using SocialMedia.Api.Repositories;
using System.ComponentModel.DataAnnotations;

namespace SocialMedia.Api.Controllers;

public class CommentCreate
{
    [Required]
    [MaxLength(255)]
    public string Content { get; set; }
    [Required]
    public Guid PostId { get; set; }

    public Guid? CommentId { get; set; }

    public CommentCreate(string content, Guid postId, Guid? commentId = null)
    {
        Content = content;
        PostId = postId;
        CommentId = commentId;
    }
}

[ApiController]
[Route("[controller]")]
[Authorize]
public class CommentController : ODataController
{
    private readonly AppDbContext DbContext;
    private readonly UserRepository UserRepository;
    private readonly PostRepository PostRepository;
    private readonly CommentRepository CommentRepository;

    public CommentController(AppDbContext dbContext, UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository)
    {
        DbContext = dbContext;
        UserRepository = userRepository;
        PostRepository = postRepository;
        CommentRepository = commentRepository;
    }

    [HttpGet]
    [EnableQuery]
    public IActionResult Index()
    {
        return Ok(DbContext.Comments);
    }

    [HttpGet("{id}")]
    [EnableQuery]
    public IActionResult Show([FromODataUri] Guid id)
    {
        return Ok(DbContext.Comments.Find(id));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CommentCreate body)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = UserRepository.FindByUsername(User.Identity?.Name!);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var post = PostRepository.FindById(body.PostId);
        if (post == null)
            return NotFound(new { message = "Post not found" });

        Comment? commentParent = null;
        if (body.CommentId.HasValue)
            commentParent = CommentRepository.FindById(body.CommentId.Value);

        var Comment = CommentRepository.Create(body.Content, post, user, commentParent);
        await DbContext.Comments.AddAsync(Comment);
        await DbContext.SaveChangesAsync();
        Comment.Author = null;

        return Ok(Comment);
    }
}
