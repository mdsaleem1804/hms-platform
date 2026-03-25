using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpGet]
    public async Task<ApiResponse<List<AppointmentDto>>> GetAll()
    {
        var appointments = await _appointmentService.GetAllAppointmentsAsync();
        return ApiResponse<List<AppointmentDto>>.SuccessResponse(appointments, "Appointments retrieved successfully");
    }

    [HttpGet("{id}")]
    public async Task<ApiResponse<AppointmentDto>> GetById(string id)
    {
        var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
        return appointment == null
            ? ApiResponse<AppointmentDto>.FailureResponse("Appointment not found")
            : ApiResponse<AppointmentDto>.SuccessResponse(appointment);
    }

    [HttpPost]
    public async Task<ApiResponse<AppointmentDto>> Create([FromBody] CreateAppointmentDto dto)
    {
        var appointment = await _appointmentService.CreateAppointmentAsync(dto);
        return ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment created successfully");
    }

    [HttpPut("{id}")]
    public async Task<ApiResponse<AppointmentDto>> Update(string id, [FromBody] UpdateAppointmentDto dto)
    {
        var appointment = await _appointmentService.UpdateAppointmentAsync(id, dto);
        return appointment == null
            ? ApiResponse<AppointmentDto>.FailureResponse("Appointment not found")
            : ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment updated successfully");
    }

    [HttpDelete("{id}")]
    public async Task<ApiResponse<bool>> Delete(string id)
    {
        var success = await _appointmentService.DeleteAppointmentAsync(id);
        return success
            ? ApiResponse<bool>.SuccessResponse(true, "Appointment deleted successfully")
            : ApiResponse<bool>.FailureResponse("Appointment not found");
    }
}

public interface IAppointmentService
{
    Task<List<AppointmentDto>> GetAllAppointmentsAsync();
    Task<AppointmentDto?> GetAppointmentByIdAsync(string id);
    Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto dto);
    Task<AppointmentDto?> UpdateAppointmentAsync(string id, UpdateAppointmentDto dto);
    Task<bool> DeleteAppointmentAsync(string id);
}

public class AppointmentService : IAppointmentService
{
    public async Task<List<AppointmentDto>> GetAllAppointmentsAsync()
    {
        // TODO: Implement using repository
        return await Task.FromResult(new List<AppointmentDto>());
    }

    public async Task<AppointmentDto?> GetAppointmentByIdAsync(string id)
    {
        // TODO: Implement using repository
        return await Task.FromResult<AppointmentDto?>(null);
    }

    public async Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto dto)
    {
        // TODO: Implement business logic
        return await Task.FromResult(new AppointmentDto());
    }

    public async Task<AppointmentDto?> UpdateAppointmentAsync(string id, UpdateAppointmentDto dto)
    {
        // TODO: Implement business logic
        return await Task.FromResult<AppointmentDto?>(null);
    }

    public async Task<bool> DeleteAppointmentAsync(string id)
    {
        // TODO: Implement using repository
        return await Task.FromResult(false);
    }
}

public class AppointmentDto
{
    public string Id { get; set; } = string.Empty;
    public string AppointmentNo { get; set; } = string.Empty;
    public string PatientId { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int TokenNumber { get; set; }
    public string Status { get; set; } = "Scheduled";
    public string VisitType { get; set; } = string.Empty;
}

public class CreateAppointmentDto
{
    public string PatientId { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string VisitType { get; set; } = string.Empty;
}

public class UpdateAppointmentDto
{
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
}

