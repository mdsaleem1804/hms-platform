namespace HMS.Application.Features.Dashboard;

public interface IDashboardService
{
    Task<DashboardMetricsDto> GetMetricsAsync(int days = 7);
    Task<List<RevenueRateDto>> GetRevenueRatesAsync();
    Task<RevenueRateDto> GetRevenueRateByIdAsync(string id);
    Task<RevenueRateDto> CreateRevenueRateAsync(CreateRevenueRateRequestDto request);
    Task<RevenueRateDto> UpdateRevenueRateAsync(string id, UpdateRevenueRateRequestDto request);
    Task DeleteRevenueRateAsync(string id);
    Task<List<RevenueRateDto>> UpdateRevenueRatesAsync(UpdateRevenueRatesRequestDto request);
    Task<HospitalSettingsDto> GetHospitalSettingsAsync();
    Task<HospitalSettingsDto> UpdateHospitalSettingsAsync(UpdateHospitalSettingsRequestDto request);
}
