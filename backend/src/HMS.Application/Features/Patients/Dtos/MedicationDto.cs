namespace HMS.Application.Features.Patients;

public class MedicationDto
{
    public string Id { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string MedicationName { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public string? PrescribedByDoctorId { get; set; }
    public string? PrescribedByDoctorName { get; set; }
    public DateTime? PrescriptionDate { get; set; }
    public string? SideEffects { get; set; }
    public string? Contraindications { get; set; }
    public string? Instructions { get; set; }
    public bool? IsMandatory { get; set; }
    public int? RefillCount { get; set; }
    public int? RefillsRemaining { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
