namespace HMS.Infrastructure.UhidGeneration;

/// <summary>
/// Configuration options for UHID generator selection.
/// </summary>
public class UhidGeneratorOptions
{
    /// <summary>
    /// The type of UHID generator to use.
    /// Options: "Timestamp", "Sequence"
    /// Default: "Timestamp"
    /// </summary>
    public string GeneratorType { get; set; } = "Timestamp";
}
