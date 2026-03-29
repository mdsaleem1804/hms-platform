using HMS.Application.Repositories;
using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Infrastructure.Repositories;

public class BillingRepository : IBillingRepository
{
    private readonly AppDbContext _context;

    public BillingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Billing>> GetAllAsync()
    {
        return await BaseQuery()
            .OrderByDescending(billing => billing.CreatedAt)
            .ToListAsync();
    }

    public async Task<(List<Billing> Items, int TotalRecords)> GetPagedAsync(
        string? search,
        string? status,
        string? doctorId,
        DateTime? fromDate,
        DateTime? toDate,
        int page,
        int pageSize)
    {
        var query = _context.Billings
            .AsNoTracking()
            .Include(billing => billing.Patient)
            .Include(billing => billing.Doctor)
            .Include(billing => billing.Items)
            .Where(billing => !billing.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var terms = search
                .Trim()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(term => $"%{term}%")
                .ToArray();

            foreach (var termPattern in terms)
            {
                query = query.Where(billing =>
                    EF.Functions.ILike(billing.BillNumber, termPattern) ||
                    EF.Functions.ILike(billing.Patient!.PatientName, termPattern) ||
                    EF.Functions.ILike(billing.Patient!.Mobile, termPattern));
            }
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalizedStatus = status.Trim().ToLowerInvariant();
            query = normalizedStatus switch
            {
                "paid" => query.Where(billing => billing.PaidAmount >= billing.NetAmount && billing.NetAmount > 0m),
                "pending" => query.Where(billing => billing.PaidAmount <= 0m),
                "partial" => query.Where(billing => billing.PaidAmount > 0m && billing.PaidAmount < billing.NetAmount),
                _ => query,
            };
        }

        if (!string.IsNullOrWhiteSpace(doctorId))
        {
            var normalizedDoctorId = doctorId.Trim();
            query = query.Where(billing => billing.DoctorId == normalizedDoctorId);
        }

        if (fromDate.HasValue)
        {
            var from = fromDate.Value.Date;
            query = query.Where(billing => billing.Date >= from);
        }

        if (toDate.HasValue)
        {
            var to = toDate.Value.Date;
            query = query.Where(billing => billing.Date <= to);
        }

        var totalRecords = await query.CountAsync();
        var items = await query
            .OrderByDescending(billing => billing.Date)
            .ThenByDescending(billing => billing.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalRecords);
    }

    public async Task<Billing?> GetByIdAsync(string id)
    {
        return await BaseQuery().FirstOrDefaultAsync(billing => billing.Id == id);
    }

    public async Task<Billing?> GetByBillNumberAsync(string billNumber)
    {
        var normalized = billNumber.Trim().ToUpperInvariant();
        return await BaseQuery().FirstOrDefaultAsync(billing => billing.BillNumber == normalized);
    }

    public async Task<string> GetNextBillNumberAsync()
    {
        var numbers = await _context.Billings
            .AsNoTracking()
            .Where(billing => billing.BillNumber.StartsWith("OPD-"))
            .Select(billing => billing.BillNumber)
            .ToListAsync();

        var max = 1000;
        foreach (var billNumber in numbers)
        {
            if (billNumber.Length <= 4)
            {
                continue;
            }

            if (int.TryParse(billNumber[4..], out var parsed) && parsed > max)
            {
                max = parsed;
            }
        }

        return $"OPD-{max + 1}";
    }

    public async Task<Billing> CreateAsync(Billing billing)
    {
        _context.Billings.Add(billing);
        await _context.SaveChangesAsync();
        return await GetByIdAsync(billing.Id) ?? billing;
    }

    public async Task<Billing> UpdateAsync(Billing billing)
    {
        billing.UpdatedAt = DateTime.UtcNow;

        // Billing is loaded as a tracked entity in the same DbContext scope.
        // Calling Update() here forces the full graph to Modified and can turn
        // newly added BillingItems into updates, causing concurrency errors.
        await _context.SaveChangesAsync();
        return await GetByIdAsync(billing.Id) ?? billing;
    }

    public async Task CancelAsync(string id)
    {
        var billing = await _context.Billings.FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted)
            ?? throw new KeyNotFoundException($"Billing with ID {id} not found");

        billing.IsDeleted = true;
        billing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    private IQueryable<Billing> BaseQuery()
    {
        return _context.Billings
            .Include(billing => billing.Patient)
            .Include(billing => billing.Doctor)
            .Include(billing => billing.Appointment)
            .Include(billing => billing.Items)
            .Where(billing => !billing.IsDeleted);
    }
}
