using Microsoft.AspNetCore.Mvc;
using HMS.Application.Features.DoctorServiceRates;
using HMS.Application.Services;

namespace HMS.API.Controllers;

/// <summary>
/// Doctor Service Rates API Controller
/// Manage service rates for different doctors
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DoctorServiceRatesController : ControllerBase
{
    private readonly IDoctorServiceRateService _service;
    private readonly ILogger<DoctorServiceRatesController> _logger;

    public DoctorServiceRatesController(IDoctorServiceRateService service, ILogger<DoctorServiceRatesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all doctor service rates with pagination
    /// </summary>
    /// <param name="page">Page number (default 1)</param>
    /// <param name="pageSize">Items per page (default 10)</param>
    /// <returns>200 OK with paged list of doctor service rates</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<DoctorServiceRateSummaryDto>>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        _logger.LogInformation("Fetching doctor service rates page {Page} with pageSize {PageSize}", page, pageSize);
        var rates = await _service.GetAllAsync(page, pageSize);
        return Ok(ApiResponse<List<DoctorServiceRateSummaryDto>>.SuccessResponse(
            rates,
            $"{rates.Count} rate(s) retrieved"
        ));
    }

    /// <summary>
    /// Get service rates for a specific doctor
    /// </summary>
    /// <param name="doctorId">Doctor ID</param>
    /// <returns>200 OK with list of service rates for the doctor</returns>
    [HttpGet("doctor/{doctorId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<DoctorServiceRateSummaryDto>>>> GetByDoctor(string doctorId)
    {
        _logger.LogInformation("Fetching service rates for doctor {DoctorId}", doctorId);
        var rates = await _service.GetByDoctorIdAsync(doctorId);
        
        if (!rates.Any())
            throw new KeyNotFoundException($"No service rates found for doctor {doctorId}");

        return Ok(ApiResponse<List<DoctorServiceRateSummaryDto>>.SuccessResponse(
            rates,
            $"{rates.Count} service rate(s) found for this doctor"
        ));
    }

    /// <summary>
    /// Get a specific service rate by ID
    /// </summary>
    /// <param name="id">Service rate ID</param>
    /// <returns>200 OK with service rate details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<DoctorServiceRateDto>>> GetById(string id)
    {
        _logger.LogInformation("Fetching service rate {RateId}", id);
        var rate = await _service.GetByIdAsync(id);
        
        if (rate == null)
            throw new KeyNotFoundException($"Service rate with ID {id} not found");

        return Ok(ApiResponse<DoctorServiceRateDto>.SuccessResponse(rate, "Service rate retrieved successfully"));
    }

    /// <summary>
    /// Get the rate for a specific service by a specific doctor on a given date
    /// </summary>
    /// <param name="doctorId">Doctor ID</param>
    /// <param name="serviceName">Service name</param>
    /// <param name="date">Date (optional, defaults to today)</param>
    /// <returns>200 OK with the service rate as a decimal</returns>
    [HttpGet("rate/{doctorId}/{serviceName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<decimal>>> GetServiceRate(
        string doctorId,
        string serviceName,
        [FromQuery] DateTime? date = null)
    {
        _logger.LogInformation("Fetching rate for doctor {DoctorId}, service {ServiceName}, date {Date}", 
            doctorId, serviceName, date ?? DateTime.UtcNow);
        
        try
        {
            var rate = await _service.GetServiceRateAsync(doctorId, serviceName, date);
            return Ok(ApiResponse<decimal>.SuccessResponse(rate, "Service rate retrieved successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            throw new KeyNotFoundException(ex.Message);
        }
    }

    /// <summary>
    /// Create a new doctor service rate
    /// </summary>
    /// <param name="request">Service rate creation data</param>
    /// <returns>201 Created with service rate details</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<DoctorServiceRateDto>>> Create([FromBody] CreateDoctorServiceRateDto request)
    {
        if (!ModelState.IsValid)
            throw new ArgumentException("Invalid request data");

        _logger.LogInformation("Creating service rate for doctor {DoctorId}, service {ServiceName}", 
            request.DoctorId, request.ServiceName);

        var createdBy = User?.Identity?.Name ?? "System";
        var rate = await _service.CreateAsync(request, createdBy);

        return CreatedAtAction(
            nameof(GetById),
            new { id = rate.Id },
            ApiResponse<DoctorServiceRateDto>.SuccessResponse(rate, "Service rate created successfully")
        );
    }

    /// <summary>
    /// Update an existing doctor service rate
    /// </summary>
    /// <param name="id">Service rate ID</param>
    /// <param name="request">Updated service rate data</param>
    /// <returns>200 OK with updated service rate</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<DoctorServiceRateDto>>> Update(
        string id,
        [FromBody] CreateDoctorServiceRateDto request)
    {
        if (!ModelState.IsValid)
            throw new ArgumentException("Invalid request data");

        _logger.LogInformation("Updating service rate {RateId}", id);

        var updatedBy = User?.Identity?.Name ?? "System";
        var rate = await _service.UpdateAsync(id, request, updatedBy);

        return Ok(ApiResponse<DoctorServiceRateDto>.SuccessResponse(rate, "Service rate updated successfully"));
    }

    /// <summary>
    /// Delete a doctor service rate
    /// </summary>
    /// <param name="id">Service rate ID</param>
    /// <returns>204 No Content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(string id)
    {
        _logger.LogInformation("Deleting service rate {RateId}", id);
        await _service.DeleteAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Check if a service rate exists for a specific doctor and service
    /// </summary>
    /// <param name="doctorId">Doctor ID</param>
    /// <param name="serviceName">Service name</param>
    /// <returns>200 OK with boolean result</returns>
    [HttpHead("{doctorId}/{serviceName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CheckExists(string doctorId, string serviceName)
    {
        _logger.LogInformation("Checking if service rate exists for doctor {DoctorId}, service {ServiceName}", 
            doctorId, serviceName);
        var exists = await _service.ExistsAsync(doctorId, serviceName);
        
        if (exists)
            return Ok();
        return NotFound();
    }
}
