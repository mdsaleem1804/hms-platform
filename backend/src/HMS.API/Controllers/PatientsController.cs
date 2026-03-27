using Microsoft.AspNetCore.Mvc;
using HMS.Application.Features.Patients;

namespace HMS.API.Controllers;

/// <summary>
/// Patients API Controller
/// All exceptions are handled globally by GlobalExceptionMiddleware
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _patientService;
    private readonly ILogger<PatientsController> _logger;

    public PatientsController(IPatientService patientService, ILogger<PatientsController> logger)
    {
        _patientService = patientService;
        _logger = logger;
    }

    /// <summary>
    /// Create a new patient registration
    /// </summary>
    /// <param name="request">Patient registration data</param>
    /// <returns>201 Created with patient details including auto-generated Id and UHID</returns>
    /// <remarks>
    /// Exceptions are handled by GlobalExceptionMiddleware:
    /// - ArgumentException → 400 Bad Request
    /// - InvalidOperationException → 400 Bad Request (duplicate mobile)
    /// - Unhandled exceptions → 500 Internal Server Error
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PatientDto>>> CreatePatient([FromBody] CreatePatientDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var createdPatient = await _patientService.CreatePatientAsync(request);

        return CreatedAtAction(
            nameof(GetPatientById),
            new { id = createdPatient.Id },
            ApiResponse<PatientDto>.SuccessResponse(createdPatient, "Patient registered successfully")
        );
    }

    /// <summary>
    /// Get patients with optional search, filters and pagination
    /// </summary>
    /// <returns>200 OK with paged patient list</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PagedResultDto<PatientDto>>>> GetAllPatients(
        [FromQuery(Name = "q")] string? search,
        [FromQuery] string? gender,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        _logger.LogInformation(
            "Fetching patients page {Page} with pageSize {PageSize}, search={Search}, gender={Gender}, status={Status}",
            page,
            pageSize,
            search,
            gender,
            status);

        var result = await _patientService.GetPatientsAsync(new PatientListQueryDto
        {
            Search = search,
            Gender = gender,
            Status = status,
            Page = page,
            PageSize = pageSize,
        });

        return Ok(ApiResponse<PagedResultDto<PatientDto>>.SuccessResponse(result, "Patients retrieved successfully"));
    }

    /// <summary>
    /// Search patients by name, UHID, or mobile number.
    /// Returns lightweight summary records suitable for dropdowns and search inputs.
    /// </summary>
    /// <param name="q">Search term (min 1 character)</param>
    /// <param name="limit">Max results to return (1–50, default 10)</param>
    /// <returns>200 OK with list of matching patient summaries</returns>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<PatientSummaryDto>>>> SearchPatients(
        [FromQuery] string q,
        [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            throw new ArgumentException("Search query 'q' is required");
        }

        _logger.LogInformation("Searching patients with query: {Query}, limit: {Limit}", q, limit);
        var results = await _patientService.SearchPatientsAsync(q, limit);
        return Ok(ApiResponse<List<PatientSummaryDto>>.SuccessResponse(results, $"{results.Count} patient(s) found"));
    }

    /// <summary>
    /// Get a specific patient by ID
    /// </summary>
    /// <param name="id">Patient ID</param>
    /// <returns>200 OK with patient details</returns>
    /// <remarks>
    /// Throws KeyNotFoundException if patient not found → 404 Not Found (via middleware)
    /// </remarks>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PatientDto>>> GetPatientById(long id)
    {
        _logger.LogInformation("Fetching patient with ID: {PatientId}", id);
        
        var patient = await _patientService.GetPatientByIdAsync(id);
        if (patient == null)
        {
            throw new KeyNotFoundException($"Patient with ID {id} not found");
        }

        return Ok(ApiResponse<PatientDto>.SuccessResponse(patient, "Patient retrieved successfully"));
    }

    /// <summary>
    /// Update a patient
    /// </summary>
    /// <param name="id">Patient ID</param>
    /// <param name="request">Updated patient data</param>
    /// <returns>200 OK with updated patient details</returns>
    /// <remarks>
    /// Exceptions are handled by GlobalExceptionMiddleware:
    /// - ArgumentException → 400 Bad Request (validation errors)
    /// - InvalidOperationException → 400 Bad Request (patient not found, duplicate mobile)
    /// </remarks>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PatientDto>>> UpdatePatient(long id, [FromBody] UpdatePatientDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        _logger.LogInformation("Updating patient with ID: {PatientId}", id);
        request.Id = id;
        var updatedPatient = await _patientService.UpdatePatientAsync(id, request);

        return Ok(ApiResponse<PatientDto>.SuccessResponse(updatedPatient, "Patient updated successfully"));
    }

    /// <summary>
    /// Delete a patient
    /// </summary>
    /// <param name="id">Patient ID</param>
    /// <returns>200 OK if successful</returns>
    /// <remarks>
    /// Throws InvalidOperationException if patient not found → mapped to 400 by middleware
    /// (Consider updating middleware to map InvalidOperationException("not found") to 404)
    /// </remarks>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object?>>> DeletePatient(long id)
    {
        _logger.LogInformation("Deleting patient with ID: {PatientId}", id);
        
        await _patientService.DeletePatientAsync(id);
        return Ok(ApiResponse<object?>.SuccessResponse(null, "Patient deleted successfully"));
    }
}
