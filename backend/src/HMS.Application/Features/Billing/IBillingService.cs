namespace HMS.Application.Features.Billing;

public interface IBillingService
{
    Task<BillingPagedResultDto> GetPagedAsync(BillingListQueryDto query);
    Task<BillingDto?> GetByIdAsync(string id);
    Task<BillingDto?> GetByBillNumberAsync(string billNumber);
    Task<BillingDto> CreateAsync(CreateBillingDto request);
    Task CancelAsync(string id);
}
