using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IDepartmentRepository
{
    Task<Department?> GetByIdAsync(string id);
    Task<IList<Department>> GetAllAsync();
    Task<Department> CreateAsync(Department department);
    Task UpdateAsync(Department department);
    Task DeleteAsync(string id);
}
