using HMS.Application.Repositories;
using HMS.Domain.Entities;

namespace HMS.Application.Features.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly IDashboardMetricsRepository _dashboardMetricsRepository;
    private readonly IRevenueRateRepository _revenueRateRepository;
    private readonly IHospitalSettingsRepository _hospitalSettingsRepository;

    public DashboardService(
        IDashboardMetricsRepository dashboardMetricsRepository,
        IRevenueRateRepository revenueRateRepository,
        IHospitalSettingsRepository hospitalSettingsRepository)
    {
        _dashboardMetricsRepository = dashboardMetricsRepository;
        _revenueRateRepository = revenueRateRepository;
        _hospitalSettingsRepository = hospitalSettingsRepository;
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

    public async Task<HospitalSettingsDto> GetHospitalSettingsAsync()
    {
        var settings = await _hospitalSettingsRepository.GetAsync();
        if (settings == null)
        {
            return new HospitalSettingsDto
            {
                HospitalName = "Hospital",
                Country = "India",
                ReportHeaderTagline = "Healthcare Management System",
                ReportFooterNote = "Thank you for choosing our hospital. Please retain this bill for your records.",
            };
        }

        return MapHospitalSettings(settings);
    }

    public async Task<HospitalSettingsDto> UpdateHospitalSettingsAsync(UpdateHospitalSettingsRequestDto request)
    {
        var name = request.HospitalName?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Hospital name is required");
        }

        var upserted = await _hospitalSettingsRepository.UpsertAsync(new HospitalSettings
        {
            HospitalName = name,
            AddressLine1 = request.AddressLine1?.Trim() ?? string.Empty,
            AddressLine2 = request.AddressLine2?.Trim() ?? string.Empty,
            City = request.City?.Trim() ?? string.Empty,
            State = request.State?.Trim() ?? string.Empty,
            PostalCode = request.PostalCode?.Trim() ?? string.Empty,
            Country = request.Country?.Trim() ?? string.Empty,
            PhoneNumber = request.PhoneNumber?.Trim() ?? string.Empty,
            AlternatePhoneNumber = request.AlternatePhoneNumber?.Trim() ?? string.Empty,
            Email = request.Email?.Trim() ?? string.Empty,
            Website = request.Website?.Trim() ?? string.Empty,
            GstNumber = request.GstNumber?.Trim() ?? string.Empty,
            RegistrationNumber = request.RegistrationNumber?.Trim() ?? string.Empty,
            ReportHeaderTagline = request.ReportHeaderTagline?.Trim() ?? string.Empty,
            ReportFooterNote = request.ReportFooterNote?.Trim() ?? string.Empty,
        });

        return MapHospitalSettings(upserted);
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

    private static HospitalSettingsDto MapHospitalSettings(HospitalSettings settings)
    {
        return new HospitalSettingsDto
        {
            HospitalName = settings.HospitalName,
            AddressLine1 = settings.AddressLine1,
            AddressLine2 = settings.AddressLine2,
            City = settings.City,
            State = settings.State,
            PostalCode = settings.PostalCode,
            Country = settings.Country,
            PhoneNumber = settings.PhoneNumber,
            AlternatePhoneNumber = settings.AlternatePhoneNumber,
            Email = settings.Email,
            Website = settings.Website,
            GstNumber = settings.GstNumber,
            RegistrationNumber = settings.RegistrationNumber,
            ReportHeaderTagline = settings.ReportHeaderTagline,
            ReportFooterNote = settings.ReportFooterNote,
        };
    }
}
