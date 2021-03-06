using SocialMedia.Api.Services;
using SocialMedia.Data;

namespace SocialMedia.Api.Repositories;

public class UserRepository
{
    private readonly AppDbContext DbContext;
    private readonly PasswordService PasswordService;

    public UserRepository(AppDbContext dbContext, PasswordService passwordService)
    {
        DbContext = dbContext;
        PasswordService = passwordService;
    }

    public User? FindByUsername(string username)
    {
        return DbContext.Users.SingleOrDefault(x => x.Username == username);
    }

    public User Create(string username, string password)
    {
        var hashPassword = PasswordService.HashPassword(password);
        return new User(Guid.NewGuid(), username, hashPassword, "user");
    }

    internal async Task<User?> FindById(Guid id)
    {
        var user = await DbContext.Users.FindAsync(id);
        return user;
    }
}
