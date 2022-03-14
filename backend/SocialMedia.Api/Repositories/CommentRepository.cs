using SocialMedia.Data;

namespace SocialMedia.Api.Repositories;

public class CommentRepository
{
    private readonly AppDbContext DbContext;

    public CommentRepository(AppDbContext dbContext)
    {
        DbContext = dbContext;
    }

    public Comment? FindById(Guid id)
    {
        return DbContext.Comments.Find(id);
    }

    public Comment Create(string content, Post post, User author)
    {
        return new Comment(Guid.NewGuid(), content)
        {
            Author = author,
            PostParent = post,
        };
    }

    public Comment CreateAnswer(string content, Comment commentParent, User author)
    {
        return new Comment(Guid.NewGuid(), content)
        {
            Author = author,
            CommentParent = commentParent,
        };
    }
}
