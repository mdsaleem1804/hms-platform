using System.Text.Json;

namespace HMS.Domain.Entities;

public class Referral
{
    public long Id { get; set; }
    public long PatientId { get; set; }
    public JsonDocument? Data { get; set; }

    public Patient? Patient { get; set; }
}
