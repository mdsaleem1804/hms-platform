using HMS.Application.DTOs.Auth;
using HMS.Application.Services;
using HMS.Domain.Enums;
using HMS.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    /// <summary>
    /// Get all users (Admin/SuperAdmin only)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<ApiResponse<List<UserDto>>>> GetAllUsers(
        [FromQuery] string? role = null)
    {
        try
        {
            List<UserDto> users;

            if (!string.IsNullOrEmpty(role) && Enum.TryParse<UserRole>(role, out var userRole))
            {
                var userList = await _userRepository.GetByRoleAsync(userRole);
                users = MapToDto(userList);
            }
            else
            {
                var userList = await _userRepository.GetAllAsync();
                users = MapToDto(userList);
            }

            return Ok(new ApiResponse<List<UserDto>>
            {
                Success = true,
                Message = $"Retrieved {users.Count} users",
                Data = users
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return StatusCode(500, new ApiResponse<List<UserDto>>
            {
                Success = false,
                Message = "An error occurred while retrieving users"
            });
        }
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetUserById(string id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "User not found"
                });

            return Ok(new ApiResponse<UserDto>
            {
                Success = true,
                Message = "User retrieved successfully",
                Data = MapToDto(user)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving user {id}");
            return StatusCode(500, new ApiResponse<UserDto>
            {
                Success = false,
                Message = "An error occurred while retrieving the user"
            });
        }
    }

    /// <summary>
    /// Create a new user (Admin/SuperAdmin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<ApiResponse<UserDto>>> CreateUser(
        [FromBody] CreateUserRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "Invalid request data"
                });

            if (await _userRepository.EmailExistsAsync(request.Email))
                return BadRequest(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "Email already exists"
                });

            var user = new HMS.Domain.Entities.User
            {
                Name = request.Name,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Role = request.Role,
                DepartmentId = request.DepartmentId,
                IsActive = true,
                PasswordHash = _passwordHasher.HashPassword(request.Password)
            };

            var createdUser = await _userRepository.CreateAsync(user);
            _logger.LogInformation($"User created: {createdUser.Email}");

            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id },
                new ApiResponse<UserDto>
                {
                    Success = true,
                    Message = "User created successfully",
                    Data = MapToDto(createdUser)
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, new ApiResponse<UserDto>
            {
                Success = false,
                Message = "An error occurred while creating the user"
            });
        }
    }

    /// <summary>
    /// Update user (Admin/SuperAdmin or own profile)
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(
        string id,
        [FromBody] UpdateUserRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "Invalid request data"
                });

            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "User not found"
                });

            // Update allowed fields
            user.Name = request.Name;
            user.PhoneNumber = request.PhoneNumber;
            user.IsActive = request.IsActive;
            if (!string.IsNullOrEmpty(request.DepartmentId))
                user.DepartmentId = request.DepartmentId;

            var updatedUser = await _userRepository.UpdateAsync(user);
            _logger.LogInformation($"User updated: {updatedUser.Email}");

            return Ok(new ApiResponse<UserDto>
            {
                Success = true,
                Message = "User updated successfully",
                Data = MapToDto(updatedUser)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating user {id}");
            return StatusCode(500, new ApiResponse<UserDto>
            {
                Success = false,
                Message = "An error occurred while updating the user"
            });
        }
    }

    /// <summary>
    /// Delete user (Admin/SuperAdmin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUser(string id)
    {
        try
        {
            var success = await _userRepository.DeleteAsync(id);
            if (!success)
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "User not found"
                });

            _logger.LogInformation($"User deleted: {id}");
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "User deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting user {id}");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "An error occurred while deleting the user"
            });
        }
    }

    private static UserDto MapToDto(HMS.Domain.Entities.User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role,
            IsActive = user.IsActive,
            DepartmentId = user.DepartmentId,
            CreatedAt = user.CreatedAt
        };
    }

    private static List<UserDto> MapToDto(List<HMS.Domain.Entities.User> users)
    {
        return users.Select(MapToDto).ToList();
    }
}
