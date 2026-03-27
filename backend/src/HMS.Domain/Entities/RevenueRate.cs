namespace HMS.Domain.Entities;

public class RevenueRate : BaseEntity
{
    public string VisitType { get; set; } = string.Empty;
    public decimal Rate { get; set; }
}
