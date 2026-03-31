using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IRevenueRateRepository
{
    Task<List<RevenueRate>> GetAllAsync();
    Task<RevenueRate?> GetByIdAsync(string id);
    Task<RevenueRate?> GetByVisitTypeAsync(string visitType);
    Task<bool> ExistsByVisitTypeAsync(string visitType, string? excludeId = null);
    Task<RevenueRate> CreateAsync(RevenueRate rate);
    Task<RevenueRate> UpdateAsync(RevenueRate rate);
    Task DeleteAsync(string id);
    Task UpsertManyAsync(IEnumerable<RevenueRate> rates);
}
