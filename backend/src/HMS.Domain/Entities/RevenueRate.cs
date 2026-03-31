namespace HMS.Domain.Entities;

public class RevenueRate : BaseEntity
{
    public string Module { get; set; } = "OPD";
    public string ServiceCode { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string VisitType { get; set; } = string.Empty;
    public decimal Rate { get; set; }
}
