using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using SocialMedia.Tests.Utilities;
using Xunit;
using Xunit.Abstractions;

using SocialMedia.Tests.Mocks;

namespace SocialMedia.Tests.Integration;

class RegisterResponse
{
    public string Id { get; set; }

    public RegisterResponse(string id)
    {
        Id = id;
    }
}

public class AuthTest : IDisposable
{
    private Logger Logger;
    private Server Server;

    private ICollection<string> UserIds = new List<string>();

    public AuthTest(ITestOutputHelper helper)
    {
        Logger = new("AuthTest", helper);
        Server = new Server(helper);
    }

    [Fact]
    public async void LoginBadRequest1()
    {
        // Setup
        var body = "";
        using var client = Server.CreateClient();
        // Exercise
        var response = await client.PostAsync("/Auth/Login", Server.CreateBody(body));
        // Verify
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async void LoginBadRequest2()
    {
        // Setup
        var body = "{}";
        using var client = Server.CreateClient();
        // Exercise
        var response = await client.PostAsync("/Auth/Login", Server.CreateBody(body));
        // Verify
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async void LoginOk()
    {
        // Setup
        var body = UserSample.ToJson();
        using var client = Server.CreateClient();
        // Exercise
        var response = await client.PostAsync("/Auth/Login", Server.CreateBody(body));
        var content = await response.Content.ReadAsStringAsync();
        // Verify
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(@"""token"":", content);
    }

    [Fact]
    public async void RegisterBadRequest()
    {
        // Setup
        var body = "";
        using var client = Server.CreateClient();
        var response = await client.PostAsync("/Auth/Register", Server.CreateBody(body));
        // Verify
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async void RegisterOk()
    {
        // Setup
        var body = @"{ ""username"": ""test-user"", ""password"": ""some-password"" }";
        using var client = Server.CreateClient();
        // Exercise
        var response = await client.PostAsync("/Auth/Register", Server.CreateBody(body));
        var content = await response.Content.ReadAsStringAsync();
        var definition = new { Id = "" };
        var result = JsonConvert.DeserializeAnonymousType(content, definition);
        // Verify
        Assert.NotNull(result);
        UserIds.Add(result!.Id);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    public void Dispose()
    {
        using var context = Server.CreateContext();
        foreach (var id in UserIds)
        {
            var user = context.Users.Find(Guid.Parse(id));
            context.Users.Remove(user!);
            context.SaveChanges();
        }
    }
}
