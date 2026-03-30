using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Application.Repositories;

public class DoctorServiceRateRepository : IDoctorServiceRateRepository
{
    private readonly AppDbContext _context;

    public DoctorServiceRateRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DoctorServiceRate?> GetByIdAsync(string id)
    {
        return await _context.DoctorServiceRates
            .Include(dsr => dsr.Doctor)
            .FirstOrDefaultAsync(dsr => dsr.Id == id && !dsr.IsDeleted);
    }

    public async Task<List<DoctorServiceRate>> GetByDoctorIdAsync(string doctorId)
    {
        return await _context.DoctorServiceRates
            .Where(dsr => dsr.DoctorId == doctorId && !dsr.IsDeleted)
            .OrderBy(dsr => dsr.ServiceName)
            .ToListAsync();
    }

    public async Task<DoctorServiceRate?> GetByDoctorAndServiceAsync(string doctorId, string serviceName)
    {
        return await _context.DoctorServiceRates
            .FirstOrDefaultAsync(dsr => 
                dsr.DoctorId == doctorId && 
                dsr.ServiceName == serviceName && 
                !dsr.IsDeleted);
    }

    public async Task<List<DoctorServiceRate>> GetActiveRatesByDoctorAndDateAsync(string doctorId, DateTime date)
    {
        return await _context.DoctorServiceRates
            .Where(dsr => 
                dsr.DoctorId == doctorId &&
                dsr.IsActive &&
                dsr.EffectiveFrom <= date &&
                (dsr.EffectiveTo == null || dsr.EffectiveTo >= date) &&
                !dsr.IsDeleted)
            .OrderBy(dsr => dsr.ServiceName)
            .ToListAsync();
    }

    public async Task<List<DoctorServiceRate>> GetAllAsync(int page = 1, int pageSize = 10)
    {
        return await _context.DoctorServiceRates
            .Include(dsr => dsr.Doctor)
            .Where(dsr => !dsr.IsDeleted)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .OrderByDescending(dsr => dsr.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<DoctorServiceRate>> GetByServiceNameAsync(string serviceName)
    {
        return await _context.DoctorServiceRates
            .Where(dsr => dsr.ServiceName == serviceName && dsr.IsActive && !dsr.IsDeleted)
            .OrderBy(dsr => dsr.DoctorId)
            .ToListAsync();
    }

    public async Task<DoctorServiceRate> CreateAsync(DoctorServiceRate rate)
    {
        _context.DoctorServiceRates.Add(rate);
        await _context.SaveChangesAsync();
        return rate;
    }

    public async Task UpdateAsync(DoctorServiceRate rate)
    {
        _context.DoctorServiceRates.Update(rate);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(string id)
    {
        var rate = await GetByIdAsync(id);
        if (rate != null)
        {
            rate.IsDeleted = true;
            await UpdateAsync(rate);
        }
    }

    public async Task<bool> ExistsAsync(string doctorId, string serviceName)
    {
        return await _context.DoctorServiceRates
            .AnyAsync(dsr => 
                dsr.DoctorId == doctorId && 
                dsr.ServiceName == serviceName && 
                !dsr.IsDeleted);
    }

    public async Task<int> GetCountByDoctorAsync(string doctorId)
    {
        return await _context.DoctorServiceRates
            .CountAsync(dsr => dsr.DoctorId == doctorId && dsr.IsActive && !dsr.IsDeleted);
    }
}
