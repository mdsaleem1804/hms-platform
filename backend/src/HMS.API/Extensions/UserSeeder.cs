using HMS.Application.Services;
using HMS.Domain.Entities;
using HMS.Domain.Enums;
using HMS.Infrastructure.Persistence;

namespace HMS.API.Extensions;

/// <summary>
/// Helper class to seed default users into the database
/// </summary>
public static class UserSeeder
{
    public static async Task SeedDefaultUsersAsync(AppDbContext context, IPasswordHasher passwordHasher)
    {
        // Clear existing users to ensure fresh seeding with correct password hashing
        var existingUsers = context.Users.ToList();
        if (existingUsers.Any())
        {
            context.Users.RemoveRange(existingUsers);
            await context.SaveChangesAsync();
        }

        var defaultUsers = new List<User>
        {
            // SuperAdmin
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Super Administrator",
                Email = "superadmin@hospital.com",
                PasswordHash = passwordHasher.HashPassword("SuperAdmin@123"),
                PhoneNumber = "+91-9876543210",
                Role = UserRole.SuperAdmin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Admin
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Hospital Administrator",
                Email = "admin@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Admin@123"),
                PhoneNumber = "+91-9876543211",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Doctor 1
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Dr. Rajesh Kumar",
                Email = "doctor1@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Doctor@123"),
                PhoneNumber = "+91-9876543212",
                Role = UserRole.Doctor,
                DepartmentId = "dept_001",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Doctor 2
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Dr. Priya Sharma",
                Email = "doctor2@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Doctor@123"),
                PhoneNumber = "+91-9876543213",
                Role = UserRole.Doctor,
                DepartmentId = "dept_002",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Accountant
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Accounting Manager",
                Email = "accountant@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Accountant@123"),
                PhoneNumber = "+91-9876543214",
                Role = UserRole.Accountant,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Receptionist
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Front Desk Receptionist",
                Email = "receptionist@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Receptionist@123"),
                PhoneNumber = "+91-9876543215",
                Role = UserRole.Receptionist,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Pharmacist
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Pharmacy Manager",
                Email = "pharmacist@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Pharmacist@123"),
                PhoneNumber = "+91-9876543216",
                Role = UserRole.Pharmacist,
                DepartmentId = "dept_pharmacy",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Pathologist
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Senior Pathologist",
                Email = "pathologist@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Pathologist@123"),
                PhoneNumber = "+91-9876543217",
                Role = UserRole.Pathologist,
                DepartmentId = "dept_pathology",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Radiologist
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Consultant Radiologist",
                Email = "radiologist@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Radiologist@123"),
                PhoneNumber = "+91-9876543218",
                Role = UserRole.Radiologist,
                DepartmentId = "dept_radiology",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Nurse
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Head Nurse",
                Email = "nurse@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Nurse@123"),
                PhoneNumber = "+91-9876543219",
                Role = UserRole.Nurse,
                DepartmentId = "dept_nursing",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Patient
            new User
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "John Doe",
                Email = "patient@hospital.com",
                PasswordHash = passwordHasher.HashPassword("Patient@123"),
                PhoneNumber = "+91-9876543220",
                Role = UserRole.Patient,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(defaultUsers);
        await context.SaveChangesAsync();
    }
}
