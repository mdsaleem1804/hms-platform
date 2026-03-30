using HMS.Application.Features.Billing;
using HMS.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BillingController : ControllerBase
{
    private readonly IBillingService _billingService;
    private readonly IDoctorServiceRateService _rateService;
    private readonly ILogger<BillingController> _logger;

    public BillingController(
        IBillingService billingService,
        IDoctorServiceRateService rateService,
        ILogger<BillingController> logger)
    {
        _billingService = billingService;
        _rateService = rateService;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<BillingDto>>> Create([FromBody] CreateBillingDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var created = await _billingService.CreateAsync(request);
        _logger.LogInformation("Billing created successfully with ID: {BillingId}", created.Id);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            ApiResponse<BillingDto>.SuccessResponse(created, "Billing created successfully")
        );
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<BillingPagedResultDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] string? doctorId = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var result = await _billingService.GetPagedAsync(new BillingListQueryDto
        {
            Page = page,
            PageSize = pageSize,
            Search = search,
            Status = status,
            DoctorId = doctorId,
            FromDate = fromDate,
            ToDate = toDate,
        });

        return Ok(ApiResponse<BillingPagedResultDto>.SuccessResponse(result, "Billings retrieved successfully"));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<BillingDto>>> GetById(string id)
    {
        var billing = await _billingService.GetByIdAsync(id);
        if (billing == null)
        {
            throw new KeyNotFoundException($"Billing with ID {id} not found");
        }

        return Ok(ApiResponse<BillingDto>.SuccessResponse(billing, "Billing retrieved successfully"));
    }

    [HttpGet("by-number/{billNumber}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<BillingDto>>> GetByBillNumber(string billNumber)
    {
        var billing = await _billingService.GetByBillNumberAsync(billNumber);
        if (billing == null)
        {
            throw new KeyNotFoundException($"Billing with Bill Number {billNumber} not found");
        }

        return Ok(ApiResponse<BillingDto>.SuccessResponse(billing, "Billing retrieved successfully"));
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<BillingDto>>> Update(string id, [FromBody] UpdateBillingDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var updated = await _billingService.UpdateAsync(id, request);
        _logger.LogInformation("Billing updated successfully with ID: {BillingId}", id);

        return Ok(ApiResponse<BillingDto>.SuccessResponse(updated, "Billing updated successfully"));
    }

    [HttpDelete("{id}/cancel")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object?>>> Cancel(string id)
    {
        await _billingService.CancelAsync(id);
        _logger.LogInformation("Billing cancelled successfully with ID: {BillingId}", id);

        return Ok(ApiResponse<object?>.SuccessResponse(null, "Billing cancelled successfully"));
    }

    /// <summary>
    /// Get suggested rate for a doctor and service on a specific date
    /// Useful for validation and auto-population in the billing form
    /// </summary>
    [HttpGet("suggest-rate/{doctorId}/{serviceName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<SuggestedRateDto>>> GetSuggestedRate(
        string doctorId,
        string serviceName,
        [FromQuery] DateTime? date = null)
    {
        if (string.IsNullOrWhiteSpace(doctorId) || string.IsNullOrWhiteSpace(serviceName))
        {
            throw new ArgumentException("Doctor ID and Service Name are required");
        }

        try
        {
            var rate = await _rateService.GetServiceRateAsync(doctorId, serviceName, date);
            if (rate <= 0)
            {
                return NotFound(ApiResponse<SuggestedRateDto>.FailureResponse(
                    $"No active rate found for doctor {doctorId} and service {serviceName}"));
            }

            return Ok(ApiResponse<SuggestedRateDto>.SuccessResponse(
                new SuggestedRateDto { Rate = rate },
                "Suggested rate retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting suggested rate for doctor {DoctorId} and service {ServiceName}",
                doctorId, serviceName);
            throw;
        }
    }
}

/// <summary>
/// DTO for suggested rate response
/// </summary>
public class SuggestedRateDto
{
    public decimal Rate { get; set; }
}
