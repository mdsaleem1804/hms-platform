using HMS.Domain.Enums;

namespace HMS.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Patient;
    public bool IsActive { get; set; } = true;
    
    // Optional fields for linking to other entities
    public string? DepartmentId { get; set; }
    public string? ReferenceId { get; set; }  // Links to Doctor or Patient table
}
