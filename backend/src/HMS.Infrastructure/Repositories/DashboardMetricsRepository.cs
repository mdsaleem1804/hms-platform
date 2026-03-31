using HMS.Application.Repositories;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Infrastructure.Repositories;

public class DashboardMetricsRepository : IDashboardMetricsRepository
{
    private readonly AppDbContext _dbContext;

    public DashboardMetricsRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> GetPatientsCreatedOnDateAsync(DateTime date)
    {
        return await _dbContext.Patients
            .AsNoTracking()
            .CountAsync(patient => patient.CreatedAt.Date == date.Date);
    }

    public async Task<int> GetAppointmentsOnDateAsync(DateTime date)
    {
        return await _dbContext.Appointments
            .AsNoTracking()
            .Where(appointment => !appointment.IsDeleted)
            .CountAsync(appointment => appointment.AppointmentDate.Date == date.Date);
    }

    public async Task<decimal> GetBillingRevenueOnDateAsync(DateTime date)
    {
        var total = await _dbContext.Billings
            .AsNoTracking()
            .Where(billing => !billing.IsDeleted && billing.Date.Date == date.Date)
            .Select(billing => (decimal?)billing.NetAmount)
            .SumAsync();

        return total ?? 0m;
    }

    public async Task<Dictionary<string, int>> GetAppointmentStatusBreakdownAsync(DateTime date)
    {
        var grouped = await _dbContext.Appointments
            .AsNoTracking()
            .Where(appointment => !appointment.IsDeleted && appointment.AppointmentDate.Date == date.Date)
            .GroupBy(appointment => appointment.Status)
            .Select(group => new
            {
                Status = string.IsNullOrWhiteSpace(group.Key) ? "unknown" : group.Key.Trim().ToLower(),
                Count = group.Count(),
            })
            .ToListAsync();

        return grouped.ToDictionary(
            item => item.Status,
            item => item.Count,
            StringComparer.OrdinalIgnoreCase
        );
    }

    public async Task<Dictionary<string, int>> GetAppointmentVisitTypeCountsAsync(DateTime date)
    {
        var grouped = await _dbContext.Appointments
            .AsNoTracking()
            .Where(appointment => !appointment.IsDeleted && appointment.AppointmentDate.Date == date.Date)
            .GroupBy(appointment => appointment.VisitType)
            .Select(group => new
            {
                VisitType = string.IsNullOrWhiteSpace(group.Key) ? "unknown" : group.Key.Trim().ToLower(),
                Count = group.Count(),
            })
            .ToListAsync();

        return grouped.ToDictionary(
            item => item.VisitType,
            item => item.Count,
            StringComparer.OrdinalIgnoreCase
        );
    }

    public async Task<Dictionary<DateTime, int>> GetDailyPatientCountsAsync(DateTime startDate, DateTime endDate)
    {
        var grouped = await _dbContext.Patients
            .AsNoTracking()
            .Where(patient => patient.CreatedAt.Date >= startDate.Date && patient.CreatedAt.Date <= endDate.Date)
            .GroupBy(patient => patient.CreatedAt.Date)
            .Select(group => new
            {
                Date = group.Key,
                Count = group.Count(),
            })
            .ToListAsync();

        return grouped.ToDictionary(item => item.Date, item => item.Count);
    }

    public async Task<Dictionary<DateTime, int>> GetDailyAppointmentCountsAsync(DateTime startDate, DateTime endDate)
    {
        var grouped = await _dbContext.Appointments
            .AsNoTracking()
            .Where(appointment =>
                !appointment.IsDeleted &&
                appointment.AppointmentDate.Date >= startDate.Date &&
                appointment.AppointmentDate.Date <= endDate.Date)
            .GroupBy(appointment => appointment.AppointmentDate.Date)
            .Select(group => new
            {
                Date = group.Key,
                Count = group.Count(),
            })
            .ToListAsync();

        return grouped.ToDictionary(item => item.Date, item => item.Count);
    }
}
