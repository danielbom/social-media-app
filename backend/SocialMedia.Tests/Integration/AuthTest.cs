using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using SocialMedia.Tests.Utilities;
using Xunit;
using Xunit.Abstractions;

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

    private ICollection<string> userIds = new List<string>();

    public AuthTest(ITestOutputHelper helper)
    {
        Logger = new("AuthTest", helper);
        Server = new Server(helper);
    }

    [Fact]
    public async void LoginBadRequest1()
    {
        var body = "";
        using var client = Server.CreateClient();
        var response = await client.PostAsync("/Auth/Login", Server.CreateBody(body));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async void LoginBadRequest2()
    {
        var body = "{}";
        using var client = Server.CreateClient();
        var response = await client.PostAsync("/Auth/Login", Server.CreateBody(body));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async void LoginOk()
    {
        var body = @"{ ""username"": ""user"", ""password"": ""123mudar"" }";
        using var client = Server.CreateClient();
        var response = await client.PostAsync("/Auth/Login", Server.CreateBody(body));
        var content = await response.Content.ReadAsStringAsync();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Logger.LogInformation(content);
        Assert.Contains(@"""token"":", content);
    }

    [Fact]
    public async void RegisterBadRequest()
    {
        var body = "";
        using var client = Server.CreateClient();
        var response = await client.PostAsync("/Auth/Register", Server.CreateBody(body));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async void RegisterOk()
    {
        var body = @"{ ""username"": ""test-user"", ""password"": ""some-password"" }";
        using var client = Server.CreateClient();
        var response = await client.PostAsync("/Auth/Register", Server.CreateBody(body));
        var content = await response.Content.ReadAsStringAsync();
        var registerResponse = JsonConvert.DeserializeObject<RegisterResponse>(content);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(registerResponse);
        userIds.Add(registerResponse!.Id);
    }

    public void Dispose()
    {
        using var context = Server.CreateContext();
        foreach (var id in userIds)
        {
            var user = context.Users.Find(Guid.Parse(id));
            context.Users.Remove(user!);
            context.SaveChanges();
        }
    }
}
