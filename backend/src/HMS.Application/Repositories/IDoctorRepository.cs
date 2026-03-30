using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IDoctorRepository
{
    Task<Doctor?> GetByIdAsync(string id);
    Task<IList<Doctor>> GetAllAsync();
    Task<IList<Doctor>> GetByDepartmentIdAsync(string departmentId);
    Task<List<Doctor>> SearchAsync(string query, int limit);
    Task<Doctor> CreateAsync(Doctor doctor);
    Task UpdateAsync(Doctor doctor);
    Task DeleteAsync(string id);
}
