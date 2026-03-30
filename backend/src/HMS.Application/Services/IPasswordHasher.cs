namespace HMS.Application.Services;

/// <summary>
/// Interface for password hashing and verification services
/// </summary>
public interface IPasswordHasher
{
    /// <summary>
    /// Hash a password with salt
    /// </summary>
    string HashPassword(string password);

    /// <summary>
    /// Verify a password against its hash
    /// </summary>
    bool VerifyPassword(string password, string hash);
}
