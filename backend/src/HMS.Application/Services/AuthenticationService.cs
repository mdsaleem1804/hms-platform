using HMS.Application.DTOs.Auth;
using HMS.Domain.Entities;
using HMS.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace HMS.Application.Services;

public interface IAuthenticationService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<bool> RegisterAsync(CreateUserRequest request);
}

public class AuthenticationService : IAuthenticationService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<AuthenticationService> _logger;

    public AuthenticationService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        ILogger<AuthenticationService> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Email and password are required");

        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
        {
            _logger.LogWarning($"Login failed: User not found or inactive - {request.Email}");
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning($"Login failed: Invalid password - {request.Email}");
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        var token = _jwtTokenService.GenerateToken(user);
        var redirectUrl = GetRedirectUrl(user.Role.ToString());

        return new LoginResponse
        {
            Token = token,
            Role = user.Role.ToString(),
            UserId = user.Id,
            UserName = user.Name,
            UserEmail = user.Email,
            RedirectUrl = redirectUrl
        };
    }

    public async Task<bool> RegisterAsync(CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Email and password are required");

        if (await _userRepository.EmailExistsAsync(request.Email))
            throw new InvalidOperationException("Email already exists");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role,
            DepartmentId = request.DepartmentId,
            IsActive = true,
            PasswordHash = _passwordHasher.HashPassword(request.Password)
        };

        try
        {
            await _userRepository.CreateAsync(user);
            _logger.LogInformation($"User registered successfully: {request.Email}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error registering user: {request.Email}");
            throw;
        }
    }

    private static string GetRedirectUrl(string role)
    {
        return role switch
        {
            "SuperAdmin" => "/admin/dashboard",
            "Admin" => "/admin/dashboard",
            "Doctor" => "/doctor/dashboard",
            "Patient" => "/patient/dashboard",
            "Accountant" => "/accountant/dashboard",
            "Receptionist" => "/receptionist/dashboard",
            "Pharmacist" => "/pharmacist/dashboard",
            "Pathologist" => "/pathologist/dashboard",
            "Radiologist" => "/radiologist/dashboard",
            "Nurse" => "/nurse/dashboard",
            _ => "/dashboard"
        };
    }
}
