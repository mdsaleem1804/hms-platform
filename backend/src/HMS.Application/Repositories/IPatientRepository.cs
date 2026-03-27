using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IPatientRepository
{
    Task<Patient?> GetByMobileAsync(string mobile);
    Task<Patient?> GetByIdAsync(long id);
    Task<Patient?> GetByUhidAsync(string uhid);
    Task<List<Patient>> GetAllAsync();
    Task<(List<Patient> Items, int TotalRecords)> GetPagedAsync(string? search, string? gender, string? status, int page, int pageSize);
    Task<List<Patient>> SearchAsync(string query, int limit);
    Task<Patient> CreateAsync(Patient patient);
    Task<Patient> UpdateAsync(Patient patient);
    Task<bool> DeleteAsync(long id);
}
