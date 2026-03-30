using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IDoctorServiceRateRepository
{
    Task<DoctorServiceRate?> GetByIdAsync(string id);
    Task<List<DoctorServiceRate>> GetByDoctorIdAsync(string doctorId);
    Task<DoctorServiceRate?> GetByDoctorAndServiceAsync(string doctorId, string serviceName);
    Task<List<DoctorServiceRate>> GetActiveRatesByDoctorAndDateAsync(string doctorId, DateTime date);
    Task<List<DoctorServiceRate>> GetAllAsync(int page = 1, int pageSize = 10);
    Task<List<DoctorServiceRate>> GetByServiceNameAsync(string serviceName);
    Task<DoctorServiceRate> CreateAsync(DoctorServiceRate rate);
    Task UpdateAsync(DoctorServiceRate rate);
    Task DeleteAsync(string id);
    Task<bool> ExistsAsync(string doctorId, string serviceName);
    Task<int> GetCountByDoctorAsync(string doctorId);
}
