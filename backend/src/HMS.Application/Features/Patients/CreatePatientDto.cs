using System.Text.Json.Serialization;

namespace HMS.Application.Features.Patients;

public class CreatePatientDto
{
    [JsonPropertyName("patient_name")]
    public string PatientName { get; set; } = string.Empty;
    public string? Uhid { get; set; }
    public DateTime Dob { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string?  Photo { get; set; } = string.Empty;
    public string IdProofType { get; set; } = string.Empty;
    public string IdProofNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "ACTIVE";
    
    // Nested objects
    public EmergencyContactDto EmergencyContact { get; set; } = new();
    public AttenderDto Attender { get; set; } = new();
    public ReferralDto Referral { get; set; } = new();
}
