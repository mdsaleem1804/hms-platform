namespace HMS.Application.Features.Dashboard;

public class DashboardSummaryDto
{
    public int TodaysPatients { get; set; }
    public int TodaysAppointments { get; set; }
    public decimal RevenueToday { get; set; }
}

public class AppointmentStatusMetricDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class DailyTrendPointDto
{
    public string Date { get; set; } = string.Empty;
    public int Patients { get; set; }
    public int Appointments { get; set; }
}

public class DashboardMetricsDto
{
    public DashboardSummaryDto Summary { get; set; } = new();
    public List<AppointmentStatusMetricDto> AppointmentStatusBreakdown { get; set; } = [];
    public List<DailyTrendPointDto> DailyTrends { get; set; } = [];
}

public class RevenueRateDto
{
    public string VisitType { get; set; } = string.Empty;
    public decimal Rate { get; set; }
}

public class UpdateRevenueRatesRequestDto
{
    public List<RevenueRateDto> Rates { get; set; } = [];
}
