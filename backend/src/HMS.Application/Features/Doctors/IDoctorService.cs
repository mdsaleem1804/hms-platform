using HMS.Application.Features.Doctors;

namespace HMS.Application.Services;

public interface IDoctorService
{
    Task<DoctorDto?> GetByIdAsync(string id);
    Task<IList<DoctorSummaryDto>> GetAllAsync();
    Task<IList<DoctorSummaryDto>> GetByDepartmentIdAsync(string departmentId);
    Task<DoctorDto> CreateAsync(CreateDoctorDto createDto, string createdBy);
    Task UpdateAsync(string id, CreateDoctorDto updateDto, string updatedBy);
    Task DeleteAsync(string id);
}
