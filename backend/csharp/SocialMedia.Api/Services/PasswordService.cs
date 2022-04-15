using BCryptNet = BCrypt.Net.BCrypt;

namespace SocialMedia.Api.Services;

public class PasswordService
{
    public bool Verify(string rawPassword, string hashPassword)
    {
        return BCryptNet.Verify(rawPassword, hashPassword);
    }

    public string HashPassword(string rawPassword)
    {
        return BCryptNet.HashPassword(rawPassword);
    }
}
