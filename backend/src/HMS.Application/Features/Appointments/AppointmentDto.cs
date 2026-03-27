namespace HMS.Application.Features.Appointments;

public class AppointmentReminderDto
{
    public string Id { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string Timing { get; set; } = string.Empty;
}

public class CreateAppointmentReminderDto
{
    public string Channel { get; set; } = string.Empty;
    public string Timing { get; set; } = string.Empty;
}

public class AppointmentDto
{
    public string Id { get; set; } = string.Empty;
    public int DisplayId { get; set; }
    public string AppointmentNo { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string PatientUhid { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string DoctorSpecialization { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int TokenNumber { get; set; }
    public string Status { get; set; } = string.Empty;
    public string VisitType { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<AppointmentReminderDto> Reminders { get; set; } = new();
}

public class CreateAppointmentDto
{
    public long PatientId { get; set; }
    public string DoctorId { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string VisitType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public List<CreateAppointmentReminderDto> Reminders { get; set; } = new();
}

public class UpdateAppointmentDto : CreateAppointmentDto
{
}