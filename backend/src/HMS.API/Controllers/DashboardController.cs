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
}
