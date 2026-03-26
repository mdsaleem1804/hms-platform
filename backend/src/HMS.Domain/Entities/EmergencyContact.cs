namespace HMS.Domain.Entities;

public class EmergencyContact
{
    public long Id { get; set; }
    public long PatientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;

    public Patient? Patient { get; set; }
}
