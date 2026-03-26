using HMS.Domain.Interfaces;

namespace HMS.Infrastructure.UhidGeneration;

/// <summary>
/// Generates UHID using timestamp format.
/// Format: UHID-YYYYMMDDHHmmss
/// Example: UHID-20260326124530
/// </summary>
public class TimestampUhidGenerator : IUhidGenerator
{
    public string Generate()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        return $"UHID-{timestamp}";
    }
}
