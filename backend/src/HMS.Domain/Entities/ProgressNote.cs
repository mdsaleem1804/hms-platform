namespace HMS.Domain.Entities;

public class ProgressNote : BaseEntity
{
    public long PatientId { get; set; }
    public string EnteredByUserId { get; set; } = string.Empty;
    public string EnteredByUserRole { get; set; } = string.Empty; // "Doctor", "Nurse", "PhysioTherapist", etc.
    public string Title { get; set; } = string.Empty;
    public string NoteType { get; set; } = "General"; // General, Medical, Progress, Discharge
    
    // Note content
    public string NoteContent { get; set; } = string.Empty;
    
    // Clinical observations (optional)
    public string? Diagnosis { get; set; }
    public string? TreatmentPlan { get; set; }
    public string? Observations { get; set; }
    public string? Recommendations { get; set; }
    
    // Severity flag
    public bool IsCritical { get; set; }
    
    // Timestamps
    public DateTime NotedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Patient? Patient { get; set; }
}
