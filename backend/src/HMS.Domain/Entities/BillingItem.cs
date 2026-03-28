namespace HMS.Domain.Entities;

public class BillingItem : BaseEntity
{
    public string BillingId { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public int Qty { get; set; }
    public decimal Rate { get; set; }
    public decimal Amount { get; set; }

    public Billing? Billing { get; set; }
}
