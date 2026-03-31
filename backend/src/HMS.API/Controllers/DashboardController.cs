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
