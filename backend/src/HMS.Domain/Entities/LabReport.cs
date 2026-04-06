namespace HMS.Domain.Entities;

public class LabReport : BaseEntity
{
    public long PatientId { get; set; }
    public string ReportNumber { get; set; } = string.Empty;
    public string TestName { get; set; } = string.Empty;
    public string TestCategory { get; set; } = string.Empty; // e.g., "Blood", "Urine", "Scan"
    public string OrderedByDoctorId { get; set; } = string.Empty;
    
    // Report details
    public DateTime TestDate { get; set; }
    public DateTime ResultDate { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Completed, Reviewed
    public string? TestResult { get; set; } // JSON format for multiple results
    public string? ReferenceRange { get; set; }
    public string? NormalValue { get; set; }
    public string? ObservedValue { get; set; }
    public bool IsAbnormal { get; set; }
    
    // Lab details
    public string LabName { get; set; } = string.Empty;
    public string? TechnicianName { get; set; }
    public string? PathologistName { get; set; }
    
    // File reference
    public string? ReportFilePath { get; set; }
    public string? Notes { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Patient? Patient { get; set; }
    public Doctor? OrderedByDoctor { get; set; }
}
