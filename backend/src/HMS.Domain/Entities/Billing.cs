namespace HMS.Domain.Entities;

public class Billing : BaseEntity
{
    public string BillNumber { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string? AppointmentId { get; set; }
    public string VisitType { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    public decimal NetAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public string PaymentMode { get; set; } = string.Empty;
    public string? TransactionId { get; set; }

    public Patient? Patient { get; set; }
    public Appointment? Appointment { get; set; }
    public Doctor? Doctor { get; set; }
    public ICollection<BillingItem> Items { get; set; } = new List<BillingItem>();
}
