using HMS.Domain.Interfaces;

namespace HMS.Infrastructure.UhidGeneration;

/// <summary>
/// Generates UHID using sequence format with date prefix.
/// Format: UHID-YYYYMMDD-000001
/// Example: UHID-20260326-000001
/// </summary>
public class SequenceUhidGenerator : IUhidGenerator
{
    private static long _sequence = 0;
    private static readonly object _lockObject = new object();

    public string Generate()
    {
        lock (_lockObject)
        {
            _sequence++;
            var datePrefix = DateTime.UtcNow.ToString("yyyyMMdd");
            var sequenceNumber = _sequence.ToString("D6");
            return $"UHID-{datePrefix}-{sequenceNumber}";
        }
    }
}
