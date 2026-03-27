using HMS.Application.Repositories;
using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Infrastructure.Repositories;

public class RevenueRateRepository : IRevenueRateRepository
{
    private readonly AppDbContext _context;

    public RevenueRateRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RevenueRate>> GetAllAsync()
    {
        return await _context.RevenueRates
            .Where(r => !r.IsDeleted)
            .ToListAsync();
    }

    public async Task<RevenueRate?> GetByVisitTypeAsync(string visitType)
    {
        var normalized = visitType.Trim().ToLowerInvariant();
        return await _context.RevenueRates
            .FirstOrDefaultAsync(r => r.VisitType == normalized && !r.IsDeleted);
    }

    public async Task UpsertManyAsync(IEnumerable<RevenueRate> rates)
    {
        foreach (var incoming in rates)
        {
            var normalized = incoming.VisitType.Trim().ToLowerInvariant();
            var existing = await _context.RevenueRates
                .FirstOrDefaultAsync(r => r.VisitType == normalized);

            if (existing is null)
            {
                incoming.VisitType = normalized;
                incoming.CreatedAt = DateTime.UtcNow;
                incoming.UpdatedAt = DateTime.UtcNow;
                _context.RevenueRates.Add(incoming);
            }
            else
            {
                existing.Rate = incoming.Rate;
                existing.UpdatedAt = DateTime.UtcNow;
                existing.IsDeleted = false;
            }
        }

        await _context.SaveChangesAsync();
    }
}
