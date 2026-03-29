using HMS.Application.Features.Departments;
using HMS.Application.Repositories;
using HMS.Domain.Entities;

namespace HMS.Application.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departmentRepository;

    public DepartmentService(IDepartmentRepository departmentRepository)
    {
        _departmentRepository = departmentRepository;
    }

    public async Task<DepartmentDto?> GetByIdAsync(string id)
    {
        var department = await _departmentRepository.GetByIdAsync(id);
        return department == null ? null : MapToDto(department);
    }

    public async Task<IList<DepartmentSummaryDto>> GetAllAsync()
    {
        var departments = await _departmentRepository.GetAllAsync();
        return departments.Select(MapToSummaryDto).ToList();
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto createDto, string createdBy)
    {
        if (string.IsNullOrWhiteSpace(createDto.Name))
            throw new ArgumentException("Department name is required");

        var department = new Department
        {
            Id = Guid.NewGuid().ToString(),
            Name = createDto.Name.Trim(),
            Description = createDto.Description?.Trim(),
            CreatedBy = createdBy,
            UpdatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _departmentRepository.CreateAsync(department);
        return MapToDto(created);
    }

    public async Task UpdateAsync(string id, CreateDepartmentDto updateDto, string updatedBy)
    {
        var department = await _departmentRepository.GetByIdAsync(id);
        if (department == null)
            throw new KeyNotFoundException($"Department with ID {id} not found");

        if (department.CreatedAt.Date != DateTime.UtcNow.Date)
            throw new InvalidOperationException("Editing is allowed only for records created today");

        department.Name = updateDto.Name?.Trim() ?? department.Name;
        department.Description = updateDto.Description?.Trim();
        department.UpdatedBy = updatedBy;
        department.UpdatedAt = DateTime.UtcNow;

        await _departmentRepository.UpdateAsync(department);
    }

    public async Task DeleteAsync(string id)
    {
        await _departmentRepository.DeleteAsync(id);
    }

    private static DepartmentDto MapToDto(Department department) => new()
    {
        Id = department.Id,
        Name = department.Name,
        Description = department.Description,
        CreatedBy = department.CreatedBy,
        UpdatedBy = department.UpdatedBy,
        CreatedAt = department.CreatedAt,
        UpdatedAt = department.UpdatedAt
    };

    private static DepartmentSummaryDto MapToSummaryDto(Department department) => new()
    {
        Id = department.Id,
        Name = department.Name
    };
}
