namespace HMS.Application.Features.Dashboard;

public interface IDashboardService
{
    Task<DashboardMetricsDto> GetMetricsAsync(int days = 7);
    Task<List<RevenueRateDto>> GetRevenueRatesAsync();
    Task<List<RevenueRateDto>> UpdateRevenueRatesAsync(UpdateRevenueRatesRequestDto request);
}
