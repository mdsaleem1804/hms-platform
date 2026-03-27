using HMS.Application.Features.Appointments;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;
    private readonly ILogger<AppointmentsController> _logger;

    public AppointmentsController(IAppointmentService appointmentService, ILogger<AppointmentsController> logger)
    {
        _appointmentService = appointmentService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<AppointmentDto>>>> GetAll()
    {
        _logger.LogInformation("Fetching all appointments");
        var appointments = await _appointmentService.GetAllAppointmentsAsync();
        return Ok(ApiResponse<List<AppointmentDto>>.SuccessResponse(appointments, "Appointments retrieved successfully"));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<AppointmentDto>>> GetById(string id)
    {
        _logger.LogInformation("Fetching appointment with ID: {AppointmentId}", id);
        var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
        if (appointment == null)
        {
            throw new KeyNotFoundException($"Appointment with ID {id} not found");
        }

        return Ok(ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment retrieved successfully"));
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<AppointmentDto>>> Create([FromBody] CreateAppointmentDto dto)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var appointment = await _appointmentService.CreateAppointmentAsync(dto);
        _logger.LogInformation("Appointment created successfully with ID: {AppointmentId}", appointment.Id);

        return CreatedAtAction(
            nameof(GetById),
            new { id = appointment.Id },
            ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment created successfully")
        );
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<AppointmentDto>>> Update(string id, [FromBody] UpdateAppointmentDto dto)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var appointment = await _appointmentService.UpdateAppointmentAsync(id, dto);
        _logger.LogInformation("Appointment updated successfully with ID: {AppointmentId}", id);
        return Ok(ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment updated successfully"));
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object?>>> Delete(string id)
    {
        await _appointmentService.DeleteAppointmentAsync(id);
        _logger.LogInformation("Appointment deleted successfully with ID: {AppointmentId}", id);
        return Ok(ApiResponse<object?>.SuccessResponse(null, "Appointment deleted successfully"));
    }
}

