using HMS.Application.Repositories;
using HMS.Domain.Entities;

namespace HMS.Application.Features.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly IDashboardMetricsRepository _dashboardMetricsRepository;
    private readonly IRevenueRateRepository _revenueRateRepository;

    public DashboardService(
        IDashboardMetricsRepository dashboardMetricsRepository,
        IRevenueRateRepository revenueRateRepository)
    {
        _dashboardMetricsRepository = dashboardMetricsRepository;
        _revenueRateRepository = revenueRateRepository;
    }

    public async Task<DashboardMetricsDto> GetMetricsAsync(int days = 7)
    {
        var safeDays = Math.Clamp(days, 1, 30);
        var today = DateTime.UtcNow.Date;
        var startDate = today.AddDays(-(safeDays - 1));

        // EF Core DbContext is not thread-safe; run queries sequentially
        var todaysPatients = await _dashboardMetricsRepository.GetPatientsCreatedOnDateAsync(today);
        var todaysAppointments = await _dashboardMetricsRepository.GetAppointmentsOnDateAsync(today);
        var statusBreakdownRaw = await _dashboardMetricsRepository.GetAppointmentStatusBreakdownAsync(today);
        var visitTypeCounts = await _dashboardMetricsRepository.GetAppointmentVisitTypeCountsAsync(today);
        var patientCounts = await _dashboardMetricsRepository.GetDailyPatientCountsAsync(startDate, today);
        var appointmentCounts = await _dashboardMetricsRepository.GetDailyAppointmentCountsAsync(startDate, today);

        var visitTypeRates = await GetVisitTypeRatesAsync();
        var revenueToday = CalculateRevenue(visitTypeCounts, visitTypeRates);

        var statusBreakdown = statusBreakdownRaw
            .OrderByDescending(item => item.Value)
            .Select(item => new AppointmentStatusMetricDto
            {
                Status = item.Key,
                Count = item.Value,
            })
            .ToList();

        var trends = Enumerable.Range(0, safeDays)
            .Select(offset => startDate.AddDays(offset))
            .Select(date => new DailyTrendPointDto
            {
                Date = date.ToString("yyyy-MM-dd"),
                Patients = patientCounts.TryGetValue(date, out var pCount) ? pCount : 0,
                Appointments = appointmentCounts.TryGetValue(date, out var aCount) ? aCount : 0,
            })
            .ToList();

        return new DashboardMetricsDto
        {
            Summary = new DashboardSummaryDto
            {
                TodaysPatients = todaysPatients,
                TodaysAppointments = todaysAppointments,
                RevenueToday = revenueToday,
            },
            AppointmentStatusBreakdown = statusBreakdown,
            DailyTrends = trends,
        };
    }

    public async Task<List<RevenueRateDto>> GetRevenueRatesAsync()
    {
        var rates = await _revenueRateRepository.GetAllAsync();

        if (!rates.Any())
        {
            var defaults = GetDefaultVisitTypeRates();
            await _revenueRateRepository.UpsertManyAsync(defaults.Select(item => new RevenueRate
            {
                VisitType = item.Key,
                Rate = item.Value,
            }));

            rates = await _revenueRateRepository.GetAllAsync();
        }

        return rates
            .OrderBy(rate => rate.VisitType)
            .Select(rate => new RevenueRateDto
            {
                VisitType = rate.VisitType,
                Rate = rate.Rate,
            })
            .ToList();
    }

    public async Task<List<RevenueRateDto>> UpdateRevenueRatesAsync(UpdateRevenueRatesRequestDto request)
    {
        if (request.Rates == null || request.Rates.Count == 0)
        {
            throw new ArgumentException("At least one revenue rate is required");
        }

        var normalized = request.Rates
            .Where(rate => !string.IsNullOrWhiteSpace(rate.VisitType))
            .Select(rate => new RevenueRate
            {
                VisitType = rate.VisitType.Trim().ToLowerInvariant(),
                Rate = rate.Rate,
            })
            .ToList();

        if (normalized.Any(rate => rate.Rate < 0))
        {
            throw new ArgumentException("Revenue rate cannot be negative");
        }

        await _revenueRateRepository.UpsertManyAsync(normalized);
        return await GetRevenueRatesAsync();
    }

    private async Task<Dictionary<string, decimal>> GetVisitTypeRatesAsync()
    {
        var rates = await GetRevenueRatesAsync();
        return rates.ToDictionary(
            rate => rate.VisitType,
            rate => rate.Rate,
            StringComparer.OrdinalIgnoreCase
        );
    }

    private static Dictionary<string, decimal> GetDefaultVisitTypeRates()
    {
        return new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase)
        {
            ["consultation"] = 500m,
            ["follow_up"] = 350m,
            ["check_up"] = 400m,
            ["procedure"] = 1200m,
            ["emergency"] = 1500m,
        };
    }

    private static decimal CalculateRevenue(Dictionary<string, int> visitTypeCounts, Dictionary<string, decimal> visitTypeRates)
    {
        decimal total = 0m;

        foreach (var item in visitTypeCounts)
        {
            if (item.Value <= 0)
            {
                continue;
            }

            if (visitTypeRates.TryGetValue(item.Key, out var rate))
            {
                total += rate * item.Value;
            }
        }

        return total;
    }
}
