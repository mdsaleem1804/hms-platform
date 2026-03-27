using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IRevenueRateRepository
{
    Task<List<RevenueRate>> GetAllAsync();
    Task<RevenueRate?> GetByVisitTypeAsync(string visitType);
    Task UpsertManyAsync(IEnumerable<RevenueRate> rates);
}
