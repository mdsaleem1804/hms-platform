using HMS.Application.Features.Dashboard;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    [HttpGet("metrics")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<DashboardMetricsDto>>> GetMetrics([FromQuery] int days = 7)
    {
        _logger.LogInformation("Fetching dashboard metrics for {Days} day(s)", days);
        var metrics = await _dashboardService.GetMetricsAsync(days);
        return Ok(ApiResponse<DashboardMetricsDto>.SuccessResponse(metrics, "Dashboard metrics retrieved successfully"));
    }

    [HttpGet("revenue-rates")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<RevenueRateDto>>>> GetRevenueRates()
    {
        _logger.LogInformation("Fetching revenue rates");
        var rates = await _dashboardService.GetRevenueRatesAsync();
        return Ok(ApiResponse<List<RevenueRateDto>>.SuccessResponse(rates, "Revenue rates retrieved successfully"));
    }

    [HttpGet("revenue-rates/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<RevenueRateDto>>> GetRevenueRateById(string id)
    {
        _logger.LogInformation("Fetching revenue rate {RateId}", id);
        var rate = await _dashboardService.GetRevenueRateByIdAsync(id);
        return Ok(ApiResponse<RevenueRateDto>.SuccessResponse(rate, "Revenue rate retrieved successfully"));
    }

    [HttpPost("revenue-rates")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<RevenueRateDto>>> CreateRevenueRate([FromBody] CreateRevenueRateRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        _logger.LogInformation("Creating revenue rate for {VisitType}", request.VisitType);
        var created = await _dashboardService.CreateRevenueRateAsync(request);
        return CreatedAtAction(
            nameof(GetRevenueRateById),
            new { id = created.Id },
            ApiResponse<RevenueRateDto>.SuccessResponse(created, "Revenue rate created successfully")
        );
    }

    [HttpPut("revenue-rates")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<RevenueRateDto>>>> UpdateRevenueRates([FromBody] UpdateRevenueRatesRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        _logger.LogInformation("Updating {Count} revenue rates", request.Rates?.Count ?? 0);
        var rates = await _dashboardService.UpdateRevenueRatesAsync(request);
        return Ok(ApiResponse<List<RevenueRateDto>>.SuccessResponse(rates, "Revenue rates updated successfully"));
    }

    [HttpPut("revenue-rates/{id}")]
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

        _logger.LogInformation("Updating revenue rate {RateId}", id);
        var rate = await _dashboardService.UpdateRevenueRateAsync(id, request);
        return Ok(ApiResponse<RevenueRateDto>.SuccessResponse(rate, "Revenue rate updated successfully"));
    }

    [HttpDelete("revenue-rates/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object?>>> DeleteRevenueRate(string id)
    {
        _logger.LogInformation("Deleting revenue rate {RateId}", id);
        await _dashboardService.DeleteRevenueRateAsync(id);
        return Ok(ApiResponse<object?>.SuccessResponse(null, "Revenue rate deleted successfully"));
    }

    [HttpGet("hospital-settings")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<HospitalSettingsDto>>> GetHospitalSettings()
    {
        _logger.LogInformation("Fetching hospital settings");
        var settings = await _dashboardService.GetHospitalSettingsAsync();
        return Ok(ApiResponse<HospitalSettingsDto>.SuccessResponse(settings, "Hospital settings retrieved successfully"));
    }

    [HttpPut("hospital-settings")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<HospitalSettingsDto>>> UpdateHospitalSettings([FromBody] UpdateHospitalSettingsRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        _logger.LogInformation("Updating hospital settings");
        var settings = await _dashboardService.UpdateHospitalSettingsAsync(request);
        return Ok(ApiResponse<HospitalSettingsDto>.SuccessResponse(settings, "Hospital settings updated successfully"));
    }
}
