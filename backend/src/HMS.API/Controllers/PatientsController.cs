using Microsoft.AspNetCore.Mvc;
using HMS.Application.Features.Patients;

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

    /// <summary>
    /// Create a new patient registration
    /// </summary>
    /// <param name="request">Patient registration data</param>
    /// <returns>201 Created with patient details including auto-generated Id and UHID</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<PatientDto>>> CreatePatient([FromBody] CreatePatientDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<PatientDto>.FailureResponse("Invalid request data"));
            }

            var createdPatient = await _patientService.CreatePatientAsync(request);

            return CreatedAtAction(
                nameof(GetPatientById),
                new { id = createdPatient.Id },
                ApiResponse<PatientDto>.SuccessResponse(createdPatient, "Patient registered successfully")
            );
        }
        catch (ArgumentException error)
        {
            return BadRequest(ApiResponse<PatientDto>.FailureResponse(error.Message));
        }
        catch (InvalidOperationException error)
        {
            return BadRequest(ApiResponse<PatientDto>.FailureResponse(error.Message));
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                ApiResponse<PatientDto>.FailureResponse("An error occurred while creating the patient")
            );
        }
    }

    /// <summary>
    /// Get all patients
    /// </summary>
    /// <returns>200 OK with list of patients</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<PatientDto>>>> GetAllPatients()
    {
        try
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(ApiResponse<List<PatientDto>>.SuccessResponse(patients, "Patients retrieved successfully"));
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                ApiResponse<List<PatientDto>>.FailureResponse("An error occurred while retrieving patients")
            );
        }
    }

    /// <summary>
    /// Get a specific patient by ID
    /// </summary>
    /// <param name="id">Patient ID</param>
    /// <returns>200 OK with patient details or 404 Not Found</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PatientDto>>> GetPatientById(long id)
    {
        try
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            
            if (patient == null)
            {
                return NotFound(ApiResponse<PatientDto>.FailureResponse($"Patient with ID {id} not found"));
            }

            return Ok(ApiResponse<PatientDto>.SuccessResponse(patient, "Patient retrieved successfully"));
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                ApiResponse<PatientDto>.FailureResponse("An error occurred while retrieving the patient")
            );
        }
    }

    /// <summary>
    /// Update a patient
    /// </summary>
    /// <param name="id">Patient ID</param>
    /// <param name="request">Updated patient data</param>
    /// <returns>200 OK with updated patient details or 404 Not Found</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<PatientDto>>> UpdatePatient(long id, [FromBody] UpdatePatientDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<PatientDto>.FailureResponse("Invalid request data"));
            }

            request.Id = id;
            var updatedPatient = await _patientService.UpdatePatientAsync(id, request);

            return Ok(ApiResponse<PatientDto>.SuccessResponse(updatedPatient, "Patient updated successfully"));
        }
        catch (ArgumentException error)
        {
            return BadRequest(ApiResponse<PatientDto>.FailureResponse(error.Message));
        }
        catch (InvalidOperationException error)
        {
            return BadRequest(ApiResponse<PatientDto>.FailureResponse(error.Message));
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                ApiResponse<PatientDto>.FailureResponse("An error occurred while updating the patient")
            );
        }
    }

    /// <summary>
    /// Delete a patient
    /// </summary>
    /// <param name="id">Patient ID</param>
    /// <returns>200 OK if successful or 404 Not Found</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeletePatient(long id)
    {
        try
        {
            var result = await _patientService.DeletePatientAsync(id);
            
            if (!result)
            {
                return NotFound(ApiResponse<object>.FailureResponse($"Patient with ID {id} not found"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, "Patient deleted successfully"));
        }
        catch (InvalidOperationException error)
        {
            return NotFound(ApiResponse<object>.FailureResponse(error.Message));
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                ApiResponse<object>.FailureResponse("An error occurred while deleting the patient")
            );
        }
    }
}
