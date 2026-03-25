namespace HMS.Domain.Entities;

public class Appointment : BaseEntity
{
    public string AppointmentNo { get; set; } = string.Empty;
    public string PatientId { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int TokenNumber { get; set; }
    public string Status { get; set; } = "Scheduled";
    public string VisitType { get; set; } = string.Empty;

    public Patient? Patient { get; set; }
}
