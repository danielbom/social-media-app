using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SocialMedia.Api.Controllers;

namespace SocialMedia.Tests.Utilities;

class Authenticator
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }

        public User(Guid id, string username, string role)
        {
            Id = id;
            Username = username;
            Role = role;
        }
    }

    public class Response
    {
        public string Token { get; set; }
        public User User { get; set; }

        public Response(string token, User user)
        {
            Token = token;
            User = user;
        }
    }

    public Server Server { get; private set; }

    public Authenticator(Server server)
    {
        Server = server;
    }

    public async Task<Response> Execute(AuthLogin body)
    {
        using var client = Server.CreateClient();
        var bodyString = JsonConvert.SerializeObject(body);
        var response = await client.PostAsync("/Auth/Login", Server.CreateBody(bodyString));
        var content = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<Response>(content)!;
    }
}
