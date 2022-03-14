using System.Net;
using SocialMedia.Tests.Utilities;
using Xunit;
using Xunit.Abstractions;

namespace SocialMedia.Tests.Integration;

public class AuthTest
{
    private Logger Logger;
    private Server Server;

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
}
