namespace HMS.Domain.Entities;

public class AppointmentReminder
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string AppointmentId { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string Timing { get; set; } = string.Empty;

    public Appointment? Appointment { get; set; }
}