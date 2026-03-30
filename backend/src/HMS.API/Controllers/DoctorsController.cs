using Microsoft.AspNetCore.Mvc;
using HMS.Application.Features.Doctors;
using HMS.Application.Services;

namespace HMS.API.Controllers;

/// <summary>
/// Doctors API Controller
/// All exceptions are handled globally by GlobalExceptionMiddleware
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorService _doctorService;
    private readonly ILogger<DoctorsController> _logger;

    public DoctorsController(IDoctorService doctorService, ILogger<DoctorsController> logger)
    {
        _doctorService = doctorService;
        _logger = logger;
    }

    /// <summary>
    /// Get all doctors
    /// </summary>
    /// <returns>List of all active doctors</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<DoctorSummaryDto>>>> GetAll()
    {
        _logger.LogInformation("Fetching all doctors");
        var doctors = await _doctorService.GetAllAsync();
        return Ok(ApiResponse<List<DoctorSummaryDto>>.SuccessResponse(
            doctors.ToList(),
            $"{doctors.Count} doctor(s) found"
        ));
    }

    /// <summary>
    /// Get doctors by department ID
    /// </summary>
    /// <param name="departmentId">Department ID</param>
    /// <returns>List of doctors in the specified department</returns>
    [HttpGet("by-department/{departmentId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<DoctorSummaryDto>>>> GetByDepartment(string departmentId)
    {
        _logger.LogInformation("Fetching doctors for department ID: {DepartmentId}", departmentId);
        var doctors = await _doctorService.GetByDepartmentIdAsync(departmentId);
        return Ok(ApiResponse<List<DoctorSummaryDto>>.SuccessResponse(
            doctors.ToList(),
            $"{doctors.Count} doctor(s) found for this department"
        ));
    }

    /// <summary>
    /// Search doctors by name or specialization.
    /// Returns lightweight summary records suitable for dropdowns and search inputs.
    /// </summary>
    /// <param name="query">Search term (min 1 character)</param>
    /// <param name="limit">Max results to return (1–50, default 10)</param>
    /// <returns>200 OK with list of matching doctor summaries</returns>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<DoctorSummaryDto>>>> SearchDoctors(
        [FromQuery] string query,
        [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            throw new ArgumentException("Search query is required");
        }

        _logger.LogInformation("Searching doctors with query: {Query}, limit: {Limit}", query, limit);
        var results = await _doctorService.SearchAsync(query, limit);
        return Ok(ApiResponse<List<DoctorSummaryDto>>.SuccessResponse(results, $"{results.Count} doctor(s) found"));
    }

    /// <summary>
    /// Get doctor by ID
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <returns>Doctor details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<DoctorDto>>> GetById(string id)
    {
        _logger.LogInformation("Fetching doctor with ID: {DoctorId}", id);
        var doctor = await _doctorService.GetByIdAsync(id);
        
        if (doctor == null)
            throw new KeyNotFoundException($"Doctor with ID {id} not found");

        return Ok(ApiResponse<DoctorDto>.SuccessResponse(doctor, "Doctor retrieved successfully"));
    }

    /// <summary>
    /// Create a new doctor
    /// </summary>
    /// <param name="request">Doctor creation data</param>
    /// <returns>201 Created with doctor details</returns>
    /// <remarks>
    /// Exceptions are handled by GlobalExceptionMiddleware:
    /// - ArgumentException → 400 Bad Request
    /// - KeyNotFoundException → 404 Not Found
    /// - Unhandled exceptions → 500 Internal Server Error
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<DoctorDto>>> Create([FromBody] CreateDoctorDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var createdBy = User?.Identity?.Name ?? "System";
        var createdDoctor = await _doctorService.CreateAsync(request, createdBy);

        _logger.LogInformation("Doctor created successfully with ID: {DoctorId}", createdDoctor.Id);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdDoctor.Id },
            ApiResponse<DoctorDto>.SuccessResponse(createdDoctor, "Doctor created successfully")
        );
    }

    /// <summary>
    /// Update an existing doctor
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <param name="request">Updated doctor data</param>
    /// <returns>200 OK</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<string>>> Update(string id, [FromBody] CreateDoctorDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var updatedBy = User?.Identity?.Name ?? "System";
        await _doctorService.UpdateAsync(id, request, updatedBy);

        _logger.LogInformation("Doctor updated successfully with ID: {DoctorId}", id);

        return Ok(ApiResponse<string>.SuccessResponse("Doctor updated successfully", "Update completed"));
    }

    /// <summary>
    /// Delete a doctor
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <returns>204 No Content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(string id)
    {
        await _doctorService.DeleteAsync(id);
        _logger.LogInformation("Doctor deleted successfully with ID: {DoctorId}", id);
        return NoContent();
    }
}
