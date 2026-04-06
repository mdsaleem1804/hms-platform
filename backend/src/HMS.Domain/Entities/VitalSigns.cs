namespace HMS.Domain.Entities;

public class VitalSigns : BaseEntity
{
    public long PatientId { get; set; }
    public string RecordedByUserId { get; set; } = string.Empty;
    
    // Vital measurements
    public decimal Temperature { get; set; } // in Celsius
    public int SystolicBP { get; set; } // Systolic Blood Pressure
    public int DiastolicBP { get; set; } // Diastolic Blood Pressure
    public int PulseRate { get; set; } // Heart rate in BPM
    public int RespiratoryRate { get; set; } // Breaths per minute
    public decimal OxygenSaturation { get; set; } // SpO2 in percentage
    public decimal Weight { get; set; } // in kg
    public decimal Height { get; set; } // in cm
    public decimal BMI { get; set; } // Body Mass Index
    public string Notes { get; set; } = string.Empty;
    
    // Timestamps
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Patient? Patient { get; set; }
}
