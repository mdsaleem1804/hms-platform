namespace HMS.Application.Features.Patients;

using HMS.Application.Features.Appointments;
using HMS.Application.Features.Billing;

public class PatientDetailsDto
{
    public long Id { get; set; }
    public string Uhid { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public DateTime Dob { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string? Photo { get; set; } = string.Empty;
    public string IdProofType { get; set; } = string.Empty;
    public string IdProofNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "ACTIVE";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<AppointmentDto> PreviousAppointments { get; set; } = new();
    public AppointmentDto? CurrentAppointment { get; set; }

    // Billing categorized by visit type
    public List<BillingDto> OpdBillings { get; set; } = new();
    public List<BillingDto> EcgBillings { get; set; } = new();
    public List<BillingDto> XrayBillings { get; set; } = new();
    public List<BillingDto> LabBillings { get; set; } = new();
    public List<BillingDto> IpBillings { get; set; } = new();
}