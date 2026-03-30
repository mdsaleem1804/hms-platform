namespace HMS.Domain.Entities;

/// <summary>
/// Represents the rate charged by a specific doctor for a specific service.
/// Allows different doctors to have different rates for the same service.
/// </summary>
public class DoctorServiceRate : BaseEntity
{
    /// <summary>
    /// Doctor ID (Foreign Key)
    /// </summary>
    public string DoctorId { get; set; } = string.Empty;

    /// <summary>
    /// Service name (e.g., "Consultation", "Lab Test", "X-Ray", etc.)
    /// </summary>
    public string ServiceName { get; set; } = string.Empty;

    /// <summary>
    /// Service description (optional, for clarity)
    /// </summary>
    public string? ServiceDescription { get; set; }

    /// <summary>
    /// Rate/Amount charged for this service by this doctor
    /// </summary>
    public decimal Rate { get; set; }

    /// <summary>
    /// Whether this rate is active or archived
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Date from which this rate is effective
    /// </summary>
    public DateTime EffectiveFrom { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Date until which this rate is effective (null if ongoing)
    /// </summary>
    public DateTime? EffectiveTo { get; set; }

    /// <summary>
    /// User who created this rate
    /// </summary>
    public string CreatedBy { get; set; } = string.Empty;

    /// <summary>
    /// User who last updated this rate
    /// </summary>
    public string UpdatedBy { get; set; } = string.Empty;

    // Navigation Properties
    public virtual Doctor? Doctor { get; set; }
}
