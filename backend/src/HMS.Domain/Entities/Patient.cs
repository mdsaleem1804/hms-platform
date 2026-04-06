namespace HMS.Domain.Entities;

public class Patient
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
    public string?  Photo { get; set; } = string.Empty;
    public string IdProofType { get; set; } = string.Empty;
    public string IdProofNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "ACTIVE";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<EmergencyContact> EmergencyContacts { get; set; } = new List<EmergencyContact>();
    public ICollection<Attender> Attenders { get; set; } = new List<Attender>();
    public ICollection<Referral> Referrals { get; set; } = new List<Referral>();
    public ICollection<Billing> Billings { get; set; } = new List<Billing>();
    
    // Medical data relationships
    public MedicalHistory? MedicalHistory { get; set; }
    public AdmissionDetails? CurrentAdmission { get; set; }
    public ICollection<AdmissionDetails> AdmissionHistory { get; set; } = new List<AdmissionDetails>();
    public ICollection<VitalSigns> VitalSigns { get; set; } = new List<VitalSigns>();
    public ICollection<Medication> Medications { get; set; } = new List<Medication>();
    public ICollection<LabReport> LabReports { get; set; } = new List<LabReport>();
    public ICollection<ProgressNote> ProgressNotes { get; set; } = new List<ProgressNote>();
}
