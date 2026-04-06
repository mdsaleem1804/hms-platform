namespace HMS.Application.Features.Patients;

public class AdmissionDetailsDto
{
    public string Id { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string AdmissionNumber { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string AssignedDoctorId { get; set; } = string.Empty;
    public string AssignedDoctorName { get; set; } = string.Empty;
    public DateTime AdmissionDate { get; set; }
    public string AdmissionType { get; set; } = "Emergency";
    public string ReasonForAdmission { get; set; } = string.Empty;
    public string PrimaryDiagnosis { get; set; } = string.Empty;
    public string? SecondaryDiagnosis { get; set; }
    public string? RoomNumber { get; set; }
    public string? BedNumber { get; set; }
    public string? RoomType { get; set; }
    public decimal? RoomCharges { get; set; }
    public DateTime? DischargeDate { get; set; }
    public string? DischargeStatus { get; set; }
    public string? DischargeNotes { get; set; }
    public string? FollowUpInstructions { get; set; }
    public string? ReferredFrom { get; set; }
    public string? ReferredTo { get; set; }
    public string? SpecialRequirements { get; set; }
    public bool RequiresICU { get; set; }
    public bool IsEmergency { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
