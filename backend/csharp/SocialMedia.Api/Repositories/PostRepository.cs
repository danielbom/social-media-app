using SocialMedia.Data;

namespace SocialMedia.Api.Repositories;

public class PostRepository
{
    private readonly AppDbContext DbContext;

    public PostRepository(AppDbContext dbContext)
    {
        DbContext = dbContext;
    }

    public Post? FindById(Guid id)
    {
        return DbContext.Posts.Find(id);
    }

    public Post Create(string content, User author)
    {
        return new Post(Guid.NewGuid(), content)
        {
            Author = author
        };
    }
}
