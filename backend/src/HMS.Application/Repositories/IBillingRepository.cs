using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IBillingRepository
{
    Task<List<Billing>> GetAllAsync();
    Task<(List<Billing> Items, int TotalRecords)> GetPagedAsync(
        string? search,
        string? status,
        string? doctorId,
        DateTime? fromDate,
        DateTime? toDate,
        int page,
        int pageSize);
    Task<Billing?> GetByIdAsync(string id);
    Task<Billing?> GetByBillNumberAsync(string billNumber);
    Task<string> GetNextBillNumberAsync();
    Task<Billing> CreateAsync(Billing billing);
    Task<Billing> UpdateAsync(Billing billing);
    Task CancelAsync(string id);
}
