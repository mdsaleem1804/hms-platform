using HMS.Domain.Entities;
using HMS.Domain.Enums;

namespace HMS.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task<List<User>> GetAllAsync();
    Task<List<User>> GetByRoleAsync(UserRole role);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(string id);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> SaveChangesAsync();
}
