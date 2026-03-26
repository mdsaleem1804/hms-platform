namespace HMS.Domain.Entities;

public class Attender
{
    public long Id { get; set; }
    public long PatientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string IdProofType { get; set; } = string.Empty;
    public string IdProofNumber { get; set; } = string.Empty;

    public Patient? Patient { get; set; }
}
