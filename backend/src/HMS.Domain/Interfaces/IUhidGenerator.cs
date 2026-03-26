namespace HMS.Domain.Interfaces;

/// <summary>
/// Interface for generating unique hospital IDs (UHID).
/// Implementations can vary (timestamp-based, sequence-based, custom format, etc.)
/// </summary>
public interface IUhidGenerator
{
    /// <summary>
    /// Generates a unique hospital ID.
    /// </summary>
    /// <returns>A unique UHID string</returns>
    string Generate();
}
