using HMS.Application.Features.Departments;

namespace HMS.Application.Services;

public interface IDepartmentService
{
    Task<DepartmentDto?> GetByIdAsync(string id);
    Task<IList<DepartmentSummaryDto>> GetAllAsync();
    Task<DepartmentDto> CreateAsync(CreateDepartmentDto createDto, string createdBy);
    Task UpdateAsync(string id, CreateDepartmentDto updateDto, string updatedBy);
    Task DeleteAsync(string id);
}
