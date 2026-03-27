using HMS.Application.Features.Doctors;
using HMS.Application.Repositories;
using HMS.Domain.Entities;
using System.Text.RegularExpressions;

namespace HMS.Application.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly IDepartmentRepository _departmentRepository;

    public DoctorService(IDoctorRepository doctorRepository, IDepartmentRepository departmentRepository)
    {
        _doctorRepository = doctorRepository;
        _departmentRepository = departmentRepository;
    }

    public async Task<DoctorDto?> GetByIdAsync(string id)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id);
        return doctor == null ? null : MapToDto(doctor);
    }

    public async Task<IList<DoctorSummaryDto>> GetAllAsync()
    {
        var doctors = await _doctorRepository.GetAllAsync();
        return doctors.Select(MapToSummaryDto).ToList();
    }

    public async Task<IList<DoctorSummaryDto>> GetByDepartmentIdAsync(string departmentId)
    {
        var doctors = await _doctorRepository.GetByDepartmentIdAsync(departmentId);
        return doctors.Select(MapToSummaryDto).ToList();
    }

    public async Task<DoctorDto> CreateAsync(CreateDoctorDto createDto, string createdBy)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(createDto.Name))
            throw new ArgumentException("Doctor name is required");
        if (string.IsNullOrWhiteSpace(createDto.Specialization))
            throw new ArgumentException("Specialization is required");
        if (string.IsNullOrWhiteSpace(createDto.DepartmentId))
            throw new ArgumentException("Department is required");

        // Validate mobile number format
        if (!IsValidMobileNumber(createDto.Mobile))
            throw new ArgumentException("Mobile number must be 10 digits");

        // Verify department exists
        var department = await _departmentRepository.GetByIdAsync(createDto.DepartmentId);
        if (department == null)
            throw new KeyNotFoundException($"Department with ID {createDto.DepartmentId} not found");

        var doctor = new Doctor
        {
            Id = Guid.NewGuid().ToString(),
            Name = createDto.Name.Trim(),
            Specialization = createDto.Specialization.Trim(),
            Mobile = createDto.Mobile.Trim(),
            DepartmentId = createDto.DepartmentId,
            CreatedBy = createdBy,
            UpdatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _doctorRepository.CreateAsync(doctor);
        return MapToDto(created);
    }

    public async Task UpdateAsync(string id, CreateDoctorDto updateDto, string updatedBy)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id);
        if (doctor == null)
            throw new KeyNotFoundException($"Doctor with ID {id} not found");

        if (!string.IsNullOrWhiteSpace(updateDto.DepartmentId) && updateDto.DepartmentId != doctor.DepartmentId)
        {
            var department = await _departmentRepository.GetByIdAsync(updateDto.DepartmentId);
            if (department == null)
                throw new KeyNotFoundException($"Department with ID {updateDto.DepartmentId} not found");
            doctor.DepartmentId = updateDto.DepartmentId;
        }

        doctor.Name = updateDto.Name?.Trim() ?? doctor.Name;
        doctor.Specialization = updateDto.Specialization?.Trim() ?? doctor.Specialization;
        doctor.Mobile = updateDto.Mobile?.Trim() ?? doctor.Mobile;
        doctor.UpdatedBy = updatedBy;
        doctor.UpdatedAt = DateTime.UtcNow;

        await _doctorRepository.UpdateAsync(doctor);
    }

    public async Task DeleteAsync(string id)
    {
        await _doctorRepository.DeleteAsync(id);
    }

    private static DoctorDto MapToDto(Doctor doctor) => new()
    {
        Id = doctor.Id,
        Name = doctor.Name,
        Specialization = doctor.Specialization,
        Mobile = doctor.Mobile,
        DepartmentId = doctor.DepartmentId,
        CreatedBy = doctor.CreatedBy,
        UpdatedBy = doctor.UpdatedBy,
        CreatedAt = doctor.CreatedAt,
        UpdatedAt = doctor.UpdatedAt
    };

    private static DoctorSummaryDto MapToSummaryDto(Doctor doctor) => new()
    {
        Id = doctor.Id,
        Name = doctor.Name,
        Specialization = doctor.Specialization,
        DepartmentId = doctor.DepartmentId
    };

    private static bool IsValidMobileNumber(string? mobile)
    {
        if (string.IsNullOrWhiteSpace(mobile))
            return false;
        // Match exactly 10 digits
        return Regex.IsMatch(mobile, @"^\d{10}$");
    }
}
