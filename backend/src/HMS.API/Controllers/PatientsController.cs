using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientsController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    [HttpGet]
    public async Task<ApiResponse<List<PatientDto>>> GetAll()
    {
        var patients = await _patientService.GetAllPatientsAsync();
        return ApiResponse<List<PatientDto>>.SuccessResponse(patients, "Patients retrieved successfully");
    }

    [HttpGet("{id}")]
    public async Task<ApiResponse<PatientDto>> GetById(string id)
    {
        var patient = await _patientService.GetPatientByIdAsync(id);
        return patient == null
            ? ApiResponse<PatientDto>.FailureResponse("Patient not found")
            : ApiResponse<PatientDto>.SuccessResponse(patient);
    }

    [HttpPost]
    public async Task<ApiResponse<PatientDto>> Create([FromBody] CreatePatientDto dto)
    {
        var patient = await _patientService.CreatePatientAsync(dto);
        return ApiResponse<PatientDto>.SuccessResponse(patient, "Patient created successfully");
    }

    [HttpPut("{id}")]
    public async Task<ApiResponse<PatientDto>> Update(string id, [FromBody] UpdatePatientDto dto)
    {
        var patient = await _patientService.UpdatePatientAsync(id, dto);
        return patient == null
            ? ApiResponse<PatientDto>.FailureResponse("Patient not found")
            : ApiResponse<PatientDto>.SuccessResponse(patient, "Patient updated successfully");
    }

    [HttpDelete("{id}")]
    public async Task<ApiResponse<bool>> Delete(string id)
    {
        var success = await _patientService.DeletePatientAsync(id);
        return success
            ? ApiResponse<bool>.SuccessResponse(true, "Patient deleted successfully")
            : ApiResponse<bool>.FailureResponse("Patient not found");
    }
}

public interface IPatientService
{
    Task<List<PatientDto>> GetAllPatientsAsync();
    Task<PatientDto?> GetPatientByIdAsync(string id);
    Task<PatientDto> CreatePatientAsync(CreatePatientDto dto);
    Task<PatientDto?> UpdatePatientAsync(string id, UpdatePatientDto dto);
    Task<bool> DeletePatientAsync(string id);
}

public class PatientService : IPatientService
{
    public async Task<List<PatientDto>> GetAllPatientsAsync()
    {
        // TODO: Implement using repository
        return await Task.FromResult(new List<PatientDto>());
    }

    public async Task<PatientDto?> GetPatientByIdAsync(string id)
    {
        // TODO: Implement using repository
        return await Task.FromResult<PatientDto?>(null);
    }

    public async Task<PatientDto> CreatePatientAsync(CreatePatientDto dto)
    {
        // TODO: Implement business logic
        return await Task.FromResult(new PatientDto());
    }

    public async Task<PatientDto?> UpdatePatientAsync(string id, UpdatePatientDto dto)
    {
        // TODO: Implement business logic
        return await Task.FromResult<PatientDto?>(null);
    }

    public async Task<bool> DeletePatientAsync(string id)
    {
        // TODO: Implement using repository
        return await Task.FromResult(false);
    }
}

public class PatientDto
{
    public string Id { get; set; } = string.Empty;
    public string UHID { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
}

public class CreatePatientDto
{
    public string UHID { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
}

public class UpdatePatientDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
}
