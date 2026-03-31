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

        var todaysPatients = await _dashboardMetricsRepository.GetPatientsCreatedOnDateAsync(today);
        var todaysAppointments = await _dashboardMetricsRepository.GetAppointmentsOnDateAsync(today);
        var revenueToday = await _dashboardMetricsRepository.GetBillingRevenueOnDateAsync(today);
        var statusBreakdownRaw = await _dashboardMetricsRepository.GetAppointmentStatusBreakdownAsync(today);
        var patientCounts = await _dashboardMetricsRepository.GetDailyPatientCountsAsync(startDate, today);
        var appointmentCounts = await _dashboardMetricsRepository.GetDailyAppointmentCountsAsync(startDate, today);

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

    public async Task<List<RevenueRateDto>> GetRevenueRatesAsync(string? module = null, bool onlyActive = false)
    {
        var normalizedModule = NormalizeModuleOrNull(module);
        var rates = await _revenueRateRepository.GetAllAsync(normalizedModule, onlyActive);

        if (!rates.Any() && string.IsNullOrEmpty(normalizedModule))
        {
            var defaults = GetDefaultVisitTypeRates();
            await _revenueRateRepository.UpsertManyAsync(defaults.Select(item => new RevenueRate
            {
                Module = RevenueRateModules.Opd,
                ServiceCode = item.Key,
                DisplayName = ToTitleCase(item.Key),
                IsActive = true,
                VisitType = item.Key,
                Rate = item.Value,
            }));

            rates = await _revenueRateRepository.GetAllAsync(normalizedModule, onlyActive);
        }

        return rates
            .OrderBy(rate => rate.VisitType)
            .Select(MapRevenueRate)
            .ToList();
    }

    public async Task<RevenueRateDto> GetRevenueRateByIdAsync(string id)
    {
        var rate = await _revenueRateRepository.GetByIdAsync(id);
        if (rate is null)
        {
            throw new KeyNotFoundException("Revenue rate not found");
        }

        return MapRevenueRate(rate);
    }

    public async Task<RevenueRateDto> CreateRevenueRateAsync(CreateRevenueRateRequestDto request)
    {
        var normalizedModule = NormalizeModuleOrThrow(request.Module);
        var normalizedServiceCode = NormalizeServiceCode(request.ServiceCode, request.VisitType);
        var displayName = NormalizeDisplayName(request.DisplayName, normalizedServiceCode);
        ValidateRevenueRate(normalizedModule, normalizedServiceCode, request.Rate);

        if (await _revenueRateRepository.ExistsByModuleAndServiceCodeAsync(normalizedModule, normalizedServiceCode))
        {
            throw new ArgumentException("A hospital standard rate with this module and service code already exists");
        }

        var created = await _revenueRateRepository.CreateAsync(new RevenueRate
        {
            Module = normalizedModule,
            ServiceCode = normalizedServiceCode,
            DisplayName = displayName,
            IsActive = request.IsActive,
            VisitType = normalizedServiceCode,
            Rate = request.Rate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });

        return MapRevenueRate(created);
    }

    public async Task<RevenueRateDto> UpdateRevenueRateAsync(string id, UpdateRevenueRateRequestDto request)
    {
        var existing = await _revenueRateRepository.GetByIdAsync(id);
        if (existing is null)
        {
            throw new KeyNotFoundException("Revenue rate not found");
        }

        var normalizedModule = NormalizeModuleOrThrow(request.Module);
        var normalizedServiceCode = NormalizeServiceCode(request.ServiceCode, request.VisitType);
        var displayName = NormalizeDisplayName(request.DisplayName, normalizedServiceCode);
        ValidateRevenueRate(normalizedModule, normalizedServiceCode, request.Rate);

        if (await _revenueRateRepository.ExistsByModuleAndServiceCodeAsync(normalizedModule, normalizedServiceCode, id))
        {
            throw new ArgumentException("A hospital standard rate with this module and service code already exists");
        }

        existing.Module = normalizedModule;
        existing.ServiceCode = normalizedServiceCode;
        existing.DisplayName = displayName;
        existing.IsActive = request.IsActive;
        existing.VisitType = normalizedServiceCode;
        existing.Rate = request.Rate;

        var updated = await _revenueRateRepository.UpdateAsync(existing);
        return MapRevenueRate(updated);
    }

    public async Task DeleteRevenueRateAsync(string id)
    {
        var existing = await _revenueRateRepository.GetByIdAsync(id);
        if (existing is null)
        {
            throw new KeyNotFoundException("Revenue rate not found");
        }

        await _revenueRateRepository.DeleteAsync(id);
    }

    public async Task<List<RevenueRateDto>> UpdateRevenueRatesAsync(UpdateRevenueRatesRequestDto request)
    {
        if (request.Rates == null || request.Rates.Count == 0)
        {
            throw new ArgumentException("At least one revenue rate is required");
        }

        var normalized = request.Rates
            .Where(rate => !string.IsNullOrWhiteSpace(rate.VisitType))
            .Select(rate =>
            {
                var module = NormalizeModuleOrThrow(rate.Module);
                var serviceCode = NormalizeServiceCode(rate.ServiceCode, rate.VisitType);
                var displayName = NormalizeDisplayName(rate.DisplayName, serviceCode);
                ValidateRevenueRate(module, serviceCode, rate.Rate);

                return new RevenueRate
                {
                    Module = module,
                    ServiceCode = serviceCode,
                    DisplayName = displayName,
                    IsActive = rate.IsActive,
                    VisitType = serviceCode,
                    Rate = rate.Rate,
                };
            })
            .ToList();

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

    private static string NormalizeServiceCode(string serviceCode, string? visitType)
    {
        var fromServiceCode = serviceCode?.Trim() ?? string.Empty;
        if (!string.IsNullOrWhiteSpace(fromServiceCode))
        {
            return fromServiceCode.ToLowerInvariant();
        }

        return (visitType ?? string.Empty).Trim().ToLowerInvariant();
    }

    private static string NormalizeDisplayName(string displayName, string serviceCode)
    {
        if (!string.IsNullOrWhiteSpace(displayName))
        {
            return displayName.Trim();
        }

        return ToTitleCase(serviceCode);
    }

    private static string NormalizeModuleOrThrow(string module)
    {
        var normalized = module.Trim().ToUpperInvariant();
        if (!RevenueRateModules.All.Contains(normalized))
        {
            throw new ArgumentException($"Unsupported module '{module}'. Allowed values: OPD, IPD, ECG, XRAY, LAB");
        }

        return normalized;
    }

    private static string? NormalizeModuleOrNull(string? module)
    {
        if (string.IsNullOrWhiteSpace(module))
        {
            return null;
        }

        return NormalizeModuleOrThrow(module);
    }

    private static void ValidateRevenueRate(string module, string serviceCode, decimal rate)
    {
        if (string.IsNullOrWhiteSpace(serviceCode))
        {
            throw new ArgumentException("Service code is required");
        }

        if (!System.Text.RegularExpressions.Regex.IsMatch(serviceCode, "^[a-z0-9][a-z0-9_-]*$"))
        {
            throw new ArgumentException("Service code must be lowercase and can only contain letters, numbers, '_' or '-'");
        }

        if (rate < 0)
        {
            throw new ArgumentException("Revenue rate cannot be negative");
        }
    }

    private static string ToTitleCase(string serviceCode)
    {
        return string.Join(' ', serviceCode
            .Replace('-', ' ')
            .Replace('_', ' ')
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(part => char.ToUpperInvariant(part[0]) + part[1..]));
    }

    private static RevenueRateDto MapRevenueRate(RevenueRate rate)
    {
        var normalizedModule = string.IsNullOrWhiteSpace(rate.Module)
            ? RevenueRateModules.Opd
            : rate.Module.Trim().ToUpperInvariant();
        var serviceCode = string.IsNullOrWhiteSpace(rate.ServiceCode)
            ? rate.VisitType
            : rate.ServiceCode;

        return new RevenueRateDto
        {
            Id = rate.Id,
            Module = normalizedModule,
            ServiceCode = serviceCode,
            DisplayName = string.IsNullOrWhiteSpace(rate.DisplayName) ? ToTitleCase(serviceCode) : rate.DisplayName,
            IsActive = rate.IsActive,
            VisitType = serviceCode,
            Rate = rate.Rate,
        };
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
