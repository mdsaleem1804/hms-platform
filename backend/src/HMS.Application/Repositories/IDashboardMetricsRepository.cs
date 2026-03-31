namespace HMS.Application.Repositories;

public interface IDashboardMetricsRepository
{
    Task<int> GetPatientsCreatedOnDateAsync(DateTime date);
    Task<int> GetAppointmentsOnDateAsync(DateTime date);
    Task<decimal> GetBillingRevenueOnDateAsync(DateTime date);
    Task<Dictionary<string, int>> GetAppointmentStatusBreakdownAsync(DateTime date);
    Task<Dictionary<string, int>> GetAppointmentVisitTypeCountsAsync(DateTime date);
    Task<Dictionary<DateTime, int>> GetDailyPatientCountsAsync(DateTime startDate, DateTime endDate);
    Task<Dictionary<DateTime, int>> GetDailyAppointmentCountsAsync(DateTime startDate, DateTime endDate);
}
