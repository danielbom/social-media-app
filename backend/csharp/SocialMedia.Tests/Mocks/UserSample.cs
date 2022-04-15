using SocialMedia.Api.Controllers;

namespace SocialMedia.Tests.Mocks;
class UserSample
{
    public static readonly string Username = "user";
    public static readonly string Password = "123mudar";

    public static string ToJson()
    {
        return $@"{{ ""username"": ""{Username}"", ""password"": ""{Password}"" }}";
    }

    public static AuthLogin ToAuthLogin()
    {
        return new AuthLogin(Username, Password);
    }
}
