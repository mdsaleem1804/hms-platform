namespace HMS.Application.Features.Patients;

public class VitalSignsDto
{
    public string Id { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public decimal? Temperature { get; set; }
    public int? SystolicBP { get; set; }
    public int? DiastolicBP { get; set; }
    public int? PulseRate { get; set; }
    public int? RespiratoryRate { get; set; }
    public decimal? OxygenSaturation { get; set; }
    public decimal? Weight { get; set; }
    public decimal? Height { get; set; }
    public decimal? BMI { get; set; }
    public string? Notes { get; set; }
    public string? RecordedByUserId { get; set; }
    public string? RecordedByUserName { get; set; }
    public DateTime RecordedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
