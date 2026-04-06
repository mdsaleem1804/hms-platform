namespace HMS.Domain.Entities;

public class AdmissionDetails : BaseEntity
{
    public long PatientId { get; set; }
    public string AdmissionNumber { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string AssignedDoctorId { get; set; } = string.Empty;
    
    // Admission info
    public DateTime AdmissionDate { get; set; }
    public string AdmissionType { get; set; } = "Emergency"; // Emergency, Planned, Routine
    public string ReasonForAdmission { get; set; } = string.Empty;
    public string PrimaryDiagnosis { get; set; } = string.Empty;
    public string? SecondaryDiagnosis { get; set; }
    
    // Room and bed
    public string? RoomNumber { get; set; }
    public string? BedNumber { get; set; }
    public string? RoomType { get; set; } = "General"; // General, Private, ICU, HDU
    public decimal? RoomCharges { get; set; }
    
    // Discharge info
    public DateTime? DischargeDate { get; set; }
    public string? DischargeStatus { get; set; } = "Active"; // Active, Discharged, DAMA, Expired
    public string? DischargeNotes { get; set; }
    public string? FollowUpInstructions { get; set; }
    
    // Additional info
    public string? ReferredFrom { get; set; }
    public string? ReferredTo { get; set; }
    public string? SpecialRequirements { get; set; }
    public bool RequiresICU { get; set; }
    public bool IsEmergency { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Patient? Patient { get; set; }
    public Doctor? AssignedDoctor { get; set; }
}
