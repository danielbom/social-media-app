using System;
using SocialMedia.Data;
using SocialMedia.Tests.Utilities;
using Xunit;
using Xunit.Abstractions;

namespace SocialMedia.Tests.Unit;

public class AutoTimestampTest : IDisposable
{
    private Server Server;

    private Guid? UserId;

    public AutoTimestampTest(ITestOutputHelper helper)
    {
        Server = new Server(helper);
    }

    [Fact]
    public void AutoTimestampMustVerifyAnnotation()
    {
        Assert.True(AutoTimestamp.HasAnnotation(typeof(User)));
        Assert.False(AutoTimestamp.HasAnnotation(typeof(LearningTest)));
    }

    [Fact]
    public void AutoTimestampMustWorks()
    {
        // Setup
        using var context = Server.CreateContext();
        var user = new User(Guid.NewGuid(), "test", "", "user");
        // Exercise
        UserId = user.Id;
        context.Users.Add(user);
        context.SaveChanges();
        // Verify
        var createTime = DateTime.UtcNow;
        Assert.Equal(createTime.Date, user.CreatedAt.Date);
        Assert.Equal(createTime.Date, user.UpdatedAt.Date);

        // Exercise
        user.Username = user.Username + "x";
        context.Users.Update(user);
        context.SaveChanges();
        // Verify
        var updateTime = DateTime.UtcNow;
        Assert.Equal(createTime.Date, user.CreatedAt.Date);
        Assert.Equal(updateTime.Date, user.UpdatedAt.Date);
    }

    public void Dispose()
    {
        if (UserId != null)
        {
            using var context = Server.CreateContext();
            var user = context.Users.Find(UserId);
            context.Users.Remove(user!);
            context.SaveChanges();
        }
    }
}