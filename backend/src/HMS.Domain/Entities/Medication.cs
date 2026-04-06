namespace HMS.Domain.Entities;

public class Medication : BaseEntity
{
    public long PatientId { get; set; }
    public string MedicationName { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty; // e.g., "500mg"
    public string Frequency { get; set; } = string.Empty; // e.g., "Twice daily"
    public string Route { get; set; } = string.Empty; // e.g., "Oral", "Intravenous"
    public string Reason { get; set; } = string.Empty; // Reason for medication
    public string PrescribedByDoctorId { get; set; } = string.Empty;
    
    // Dates
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Additional info
    public string? SideEffects { get; set; }
    public string? Contraindications { get; set; }
    public string? Notes { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Patient? Patient { get; set; }
    public Doctor? PrescribedByDoctor { get; set; }
}
