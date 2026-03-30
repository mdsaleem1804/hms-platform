namespace HMS.Application.Features.DoctorServiceRates;

/// <summary>
/// DTO for creating/updating a doctor service rate
/// </summary>
public class CreateDoctorServiceRateDto
{
    public string DoctorId { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string? ServiceDescription { get; set; }
    public decimal Rate { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
}

/// <summary>
/// DTO for displaying doctor service rate details
/// </summary>
public class DoctorServiceRateDto
{
    public string Id { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string? ServiceDescription { get; set; }
    public decimal Rate { get; set; }
    public bool IsActive { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Lightweight DTO for displaying doctor service rates in lists
/// </summary>
public class DoctorServiceRateSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public decimal Rate { get; set; }
    public bool IsActive { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
}

/// <summary>
/// DTO for bulk operations on doctor service rates
/// </summary>
public class BulkDoctorServiceRateDto
{
    public string DoctorId { get; set; } = string.Empty;
    public List<CreateDoctorServiceRateDto> Rates { get; set; } = new();
}
