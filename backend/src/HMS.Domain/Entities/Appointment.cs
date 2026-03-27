namespace HMS.Domain.Entities;

public class Appointment : BaseEntity
{
    public int DisplayId { get; set; }
    public string AppointmentNo { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string DoctorId { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int TokenNumber { get; set; }
    public string Status { get; set; } = "Scheduled";
    public string VisitType { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Priority { get; set; } = "Normal";
    public string Notes { get; set; } = string.Empty;

    public Patient? Patient { get; set; }
    public Doctor? Doctor { get; set; }
    public ICollection<AppointmentReminder> Reminders { get; set; } = new List<AppointmentReminder>();
}
