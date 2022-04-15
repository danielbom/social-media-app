using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using SocialMedia.Api.Controllers;
using SocialMedia.Tests.Mocks;
using SocialMedia.Tests.Utilities;
using Xunit;
using Xunit.Abstractions;

namespace SocialMedia.Tests.Integration;

public class PostsTest : IDisposable
{
    private Logger Logger;
    private Server Server;
    private Authenticator Authenticator;

    private ICollection<string> PostIds = new List<string>();

    public PostsTest(ITestOutputHelper helper)
    {
        Logger = new("PostTest", helper);
        Server = new Server(helper);
        Authenticator = new Authenticator(Server);
    }

    [Fact]
    public async void PostIndexUnauthorized()
    {
        // Setup
        var auth = await Authenticator.Execute(UserSample.ToAuthLogin());
        using var client = Server.CreateClient();
        // Exercise
        var response = await client.GetAsync($"/Posts/{auth.User.Id}");
        // Verify
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async void PostIndexUserNotFound()
    {
        // Setup
        var auth = await Authenticator.Execute(UserSample.ToAuthLogin());
        Server.Token = auth.Token;
        using var client = Server.CreateClient();
        // Exercise
        var response = await client.GetAsync($"/Posts/{Guid.Empty}");
        // Verify
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async void PostIndexOk()
    {
        // Setup
        var auth = await Authenticator.Execute(UserSample.ToAuthLogin());
        Server.Token = auth.Token;
        using var client = Server.CreateClient();
        // Exercise
        var response = await client.GetAsync($"/Posts/{auth.User.Id}");
        // Verify
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async void PostCreate()
    {
        // Setup
        var auth = await Authenticator.Execute(UserSample.ToAuthLogin());
        Server.Token = auth.Token;
        using var client = Server.CreateClient();
        // Exercise
        var response = await client.PostAsync("/Posts", Server.CreateBody(new PostCreate("sample")));
        var content = await response.Content.ReadAsStringAsync();
        var definition = new { Id = "" };
        var result = JsonConvert.DeserializeAnonymousType(content, definition);
        // Verify
        Assert.NotNull(result);
        PostIds.Add(result!.Id);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    public void Dispose()
    {
        using var context = Server.CreateContext();
        foreach (var id in PostIds)
        {
            var post = context.Posts.Find(Guid.Parse(id));
            context.Posts.Remove(post!);
            context.SaveChanges();
        }
    }
}
