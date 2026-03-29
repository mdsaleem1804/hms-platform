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

public class HospitalSettingsDto
{
    public string HospitalName { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string AddressLine2 { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string AlternatePhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string GstNumber { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string ReportHeaderTagline { get; set; } = string.Empty;
    public string ReportFooterNote { get; set; } = string.Empty;
}

public class UpdateHospitalSettingsRequestDto
{
    public string HospitalName { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string AddressLine2 { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string AlternatePhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string GstNumber { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string ReportHeaderTagline { get; set; } = string.Empty;
    public string ReportFooterNote { get; set; } = string.Empty;
}
