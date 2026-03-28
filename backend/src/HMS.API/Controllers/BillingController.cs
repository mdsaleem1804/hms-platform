using HMS.Application.Features.Billing;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BillingController : ControllerBase
{
    private readonly IBillingService _billingService;
    private readonly ILogger<BillingController> _logger;

    public BillingController(IBillingService billingService, ILogger<BillingController> logger)
    {
        _billingService = billingService;
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
}
