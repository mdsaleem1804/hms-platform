namespace HMS.Application.Features.Patients;

public class LabReportDto
{
    public string Id { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string ReportNumber { get; set; } = string.Empty;
    public string TestName { get; set; } = string.Empty;
    public string TestCategory { get; set; } = string.Empty;
    public DateTime TestDate { get; set; }
    public DateTime? ResultDate { get; set; }
    public string Status { get; set; } = "Pending";
    public string? TestResult { get; set; }
    public bool IsAbnormal { get; set; }
    public string? AbnormalityReason { get; set; }
    public string? NormalRange { get; set; }
    public string? ReportFilePath { get; set; }
    public string? OrderedByDoctorId { get; set; }
    public string? OrderedByDoctorName { get; set; }
    public string? ReferenceLab { get; set; }
    public decimal? Cost { get; set; }
    public string? Notes { get; set; }
    public string? Recommendations { get; set; }
    public bool IsPatientCritical { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
