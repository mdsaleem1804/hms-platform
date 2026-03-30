using HMS.Application.Features.DoctorServiceRates;

namespace HMS.Application.Services;

public interface IDoctorServiceRateService
{
    Task<DoctorServiceRateDto?> GetByIdAsync(string id);
    Task<List<DoctorServiceRateSummaryDto>> GetByDoctorIdAsync(string doctorId);
    Task<decimal> GetServiceRateAsync(string doctorId, string serviceName, DateTime? date = null);
    Task<DoctorServiceRateDto> CreateAsync(CreateDoctorServiceRateDto request, string createdBy);
    Task<DoctorServiceRateDto> UpdateAsync(string id, CreateDoctorServiceRateDto request, string updatedBy);
    Task DeleteAsync(string id);
    Task<List<DoctorServiceRateSummaryDto>> GetAllAsync(int page = 1, int pageSize = 10);
    Task<bool> ExistsAsync(string doctorId, string serviceName);
}
