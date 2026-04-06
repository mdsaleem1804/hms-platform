namespace HMS.Application.Features.Patients;

public class ProgressNoteDto
{
    public string Id { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string NoteType { get; set; } = "Progress";
    public string NoteContent { get; set; } = string.Empty;
    public string? Diagnosis { get; set; }
    public string? TreatmentPlan { get; set; }
    public string? Observations { get; set; }
    public string? Recommendations { get; set; }
    public bool IsCritical { get; set; }
    public string? EnteredByUserId { get; set; }
    public string? EnteredByUserName { get; set; }
    public string? EnteredByUserRole { get; set; }
    public DateTime NotedAt { get; set; }
    public string? Signature { get; set; }
    public string? AttachedFilePath { get; set; }
    public bool IsConfidential { get; set; }
    public string? AcknowledgedByDoctorId { get; set; }
    public DateTime? AcknowledgedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
