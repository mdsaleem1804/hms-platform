using HMS.Application.Features.Dashboard;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers;

[ApiController]
[Route("api/hospital-rate-settings")]
public class HospitalRateSettingsController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<HospitalRateSettingsController> _logger;

    public HospitalRateSettingsController(IDashboardService dashboardService, ILogger<HospitalRateSettingsController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<RevenueRateDto>>>> GetRevenueRates()
    {
        _logger.LogInformation("Fetching hospital standard rates");
        var rates = await _dashboardService.GetRevenueRatesAsync();
        return Ok(ApiResponse<List<RevenueRateDto>>.SuccessResponse(rates, "Revenue rates retrieved successfully"));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<RevenueRateDto>>> GetRevenueRateById(string id)
    {
        _logger.LogInformation("Fetching hospital standard rate {RateId}", id);
        var rate = await _dashboardService.GetRevenueRateByIdAsync(id);
        return Ok(ApiResponse<RevenueRateDto>.SuccessResponse(rate, "Revenue rate retrieved successfully"));
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<RevenueRateDto>>> CreateRevenueRate([FromBody] CreateRevenueRateRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        _logger.LogInformation("Creating hospital standard rate for {VisitType}", request.VisitType);
        var created = await _dashboardService.CreateRevenueRateAsync(request);
        return CreatedAtAction(
            nameof(GetRevenueRateById),
            new { id = created.Id },
            ApiResponse<RevenueRateDto>.SuccessResponse(created, "Revenue rate created successfully")
        );
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<RevenueRateDto>>>> UpdateRevenueRates([FromBody] UpdateRevenueRatesRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        _logger.LogInformation("Updating {Count} hospital standard rates", request.Rates?.Count ?? 0);
        var rates = await _dashboardService.UpdateRevenueRatesAsync(request);
        return Ok(ApiResponse<List<RevenueRateDto>>.SuccessResponse(rates, "Revenue rates updated successfully"));
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<RevenueRateDto>>> UpdateRevenueRate(string id, [FromBody] UpdateRevenueRateRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        _logger.LogInformation("Updating hospital standard rate {RateId}", id);
        var rate = await _dashboardService.UpdateRevenueRateAsync(id, request);
        return Ok(ApiResponse<RevenueRateDto>.SuccessResponse(rate, "Revenue rate updated successfully"));
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object?>>> DeleteRevenueRate(string id)
    {
        _logger.LogInformation("Deleting hospital standard rate {RateId}", id);
        await _dashboardService.DeleteRevenueRateAsync(id);
        return Ok(ApiResponse<object?>.SuccessResponse(null, "Revenue rate deleted successfully"));
    }
}
