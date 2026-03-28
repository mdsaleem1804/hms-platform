namespace HMS.Application.Features.Billing;

public class BillingItemDto
{
    public string Id { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public int Qty { get; set; }
    public decimal Rate { get; set; }
    public decimal Amount { get; set; }
}

public class CreateBillingItemDto
{
    public string ServiceName { get; set; } = string.Empty;
    public int Qty { get; set; }
    public decimal Rate { get; set; }
}

public class BillingDto
{
    public string Id { get; set; } = string.Empty;
    public string BillNumber { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientUhid { get; set; } = string.Empty;
    public string? AppointmentId { get; set; }
    public string VisitType { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    public decimal NetAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal BalanceAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMode { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<BillingItemDto> Items { get; set; } = new();
}

public class BillingListQueryDto
{
    public string? Search { get; set; }
    public string? Status { get; set; }
    public string? DoctorId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class BillingPagedResultDto
{
    public List<BillingDto> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalRecords { get; set; }
    public int TotalPages { get; set; }
}

public class CreateBillingDto
{
    public long PatientId { get; set; }
    public string? AppointmentId { get; set; }
    public string VisitType { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public List<CreateBillingItemDto> Items { get; set; } = new();
    public decimal DiscountValue { get; set; }
    public string DiscountType { get; set; } = "amount";
    public decimal Tax { get; set; }
    public decimal PaidAmount { get; set; }
    public string PaymentMode { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
}
