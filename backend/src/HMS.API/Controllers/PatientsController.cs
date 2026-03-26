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
    /// Get all patients
    /// </summary>
    /// <returns>200 OK with list of patients</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<PatientDto>>>> GetAllPatients()
    {
        _logger.LogInformation("Fetching all patients");
        var patients = await _patientService.GetAllPatientsAsync();
        return Ok(ApiResponse<List<PatientDto>>.SuccessResponse(patients, "Patients retrieved successfully"));
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
