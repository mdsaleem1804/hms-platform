using HMS.Application.Repositories;
using HMS.Application.Features.Dashboard;
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

    public async Task<List<RevenueRate>> GetAllAsync(string? module = null, bool onlyActive = false)
    {
        var query = _context.RevenueRates
            .Where(r => !r.IsDeleted);

        if (!string.IsNullOrWhiteSpace(module))
        {
            var normalizedModule = module.Trim().ToUpperInvariant();
            query = query.Where(r => r.Module == normalizedModule);
        }

        if (onlyActive)
        {
            query = query.Where(r => r.IsActive);
        }

        return await query
            .OrderBy(r => r.VisitType)
            .ToListAsync();
    }

    public async Task<RevenueRate?> GetByIdAsync(string id)
    {
        return await _context.RevenueRates
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);
    }

    public async Task<RevenueRate?> GetByVisitTypeAsync(string visitType)
    {
        var normalized = visitType.Trim().ToLowerInvariant();
        return await _context.RevenueRates
            .FirstOrDefaultAsync(r => r.VisitType == normalized && !r.IsDeleted);
    }

    public async Task<bool> ExistsByModuleAndServiceCodeAsync(string module, string serviceCode, string? excludeId = null)
    {
        var normalizedModule = module.Trim().ToUpperInvariant();
        var normalizedServiceCode = serviceCode.Trim().ToLowerInvariant();

        return await _context.RevenueRates.AnyAsync(r =>
            !r.IsDeleted &&
            r.Module == normalizedModule &&
            r.ServiceCode == normalizedServiceCode &&
            (excludeId == null || r.Id != excludeId));
    }

    public async Task<RevenueRate> CreateAsync(RevenueRate rate)
    {
        _context.RevenueRates.Add(rate);
        await _context.SaveChangesAsync();
        return rate;
    }

    public async Task<RevenueRate> UpdateAsync(RevenueRate rate)
    {
        rate.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return rate;
    }

    public async Task DeleteAsync(string id)
    {
        var existing = await _context.RevenueRates
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        if (existing is null)
        {
            return;
        }

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
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
                incoming.Module = string.IsNullOrWhiteSpace(incoming.Module)
                    ? RevenueRateModules.Opd
                    : incoming.Module.Trim().ToUpperInvariant();
                incoming.ServiceCode = string.IsNullOrWhiteSpace(incoming.ServiceCode)
                    ? normalized
                    : incoming.ServiceCode.Trim().ToLowerInvariant();
                incoming.DisplayName = string.IsNullOrWhiteSpace(incoming.DisplayName)
                    ? incoming.ServiceCode
                    : incoming.DisplayName.Trim();
                incoming.IsActive = true;
                incoming.VisitType = normalized;
                incoming.CreatedAt = DateTime.UtcNow;
                incoming.UpdatedAt = DateTime.UtcNow;
                _context.RevenueRates.Add(incoming);
            }
            else
            {
                existing.Module = string.IsNullOrWhiteSpace(existing.Module)
                    ? RevenueRateModules.Opd
                    : existing.Module.Trim().ToUpperInvariant();
                existing.ServiceCode = string.IsNullOrWhiteSpace(existing.ServiceCode)
                    ? normalized
                    : existing.ServiceCode.Trim().ToLowerInvariant();
                existing.DisplayName = string.IsNullOrWhiteSpace(existing.DisplayName)
                    ? existing.ServiceCode
                    : existing.DisplayName.Trim();
                existing.IsActive = true;
                existing.Rate = incoming.Rate;
                existing.UpdatedAt = DateTime.UtcNow;
                existing.IsDeleted = false;
            }
        }

        await _context.SaveChangesAsync();
    }
}
