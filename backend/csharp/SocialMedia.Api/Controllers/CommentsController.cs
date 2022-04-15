using Microsoft.AspNetCore.Mvc;
using SocialMedia.Data;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.Authorization;
using SocialMedia.Api.Repositories;

namespace SocialMedia.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class CommentsController : ODataController
{
    private readonly AppDbContext DbContext;
    private readonly UserRepository UserRepository;
    private readonly PostRepository PostRepository;
    private readonly CommentRepository CommentRepository;

    public CommentsController(AppDbContext dbContext, UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository)
    {
        DbContext = dbContext;
        UserRepository = userRepository;
        PostRepository = postRepository;
        CommentRepository = commentRepository;
    }

    [HttpGet("{id}")]
    [EnableQuery]
    public IActionResult Show([FromODataUri] Guid id)
    {
        return Ok(CommentRepository.FindById(id));
    }

    [HttpPost("{commentId}/Answers")]
    public async Task<IActionResult> Answer(Guid commentId, [FromBody] CommentCreate body)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var user = UserRepository.FindByUsername(User.Identity?.Name!);
        if (user == null)
            return BadRequest(new { message = "User not found" });

        var comment = CommentRepository.FindById(commentId);
        if (comment == null)
            return BadRequest(new { message = "Comment not found" });

        var answer = CommentRepository.CreateAnswer(body.Content, comment, user);
        await DbContext.Comments.AddAsync(answer);
        await DbContext.SaveChangesAsync();

        return Ok(answer);
    }
}
