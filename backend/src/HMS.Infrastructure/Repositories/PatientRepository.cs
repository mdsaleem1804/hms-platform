using HMS.Application.Repositories;
using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Infrastructure.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _dbContext;

    public PatientRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Patient?> GetByMobileAsync(string mobile)
    {
        return await _dbContext.Patients
            .FirstOrDefaultAsync(p => p.Mobile == mobile);
    }

    public async Task<Patient?> GetByUhidAsync(string uhid)
    {
        return await _dbContext.Patients
            .FirstOrDefaultAsync(p => p.Uhid == uhid);
    }

    public async Task<Patient?> GetByIdAsync(long id)
    {
        return await _dbContext.Patients
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Patient>> GetAllAsync()
    {
        return await _dbContext.Patients
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<(List<Patient> Items, int TotalRecords)> GetPagedAsync(
        string? search,
        string? gender,
        string? status,
        int page,
        int pageSize)
    {
        var query = _dbContext.Patients.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var terms = search
                .Trim()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(term => $"%{term}%")
                .ToArray();

            // Every term must match at least one searchable field.
            foreach (var termPattern in terms)
            {
                query = query.Where(patient =>
                    EF.Functions.ILike(patient.PatientName, termPattern) ||
                    EF.Functions.ILike(patient.Uhid, termPattern) ||
                    EF.Functions.ILike(patient.Mobile, termPattern));
            }
        }

        if (!string.IsNullOrWhiteSpace(gender))
        {
            var genderPattern = gender.Trim();
            query = query.Where(patient => EF.Functions.ILike(patient.Gender, genderPattern));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var statusPattern = status.Trim();
            query = query.Where(patient => EF.Functions.ILike(patient.Status, statusPattern));
        }

        var totalRecords = await query.CountAsync();

        var items = await query
            .OrderByDescending(patient => patient.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalRecords);
    }

    public async Task<List<Patient>> SearchAsync(string query, int limit)
    {
        var terms = query
            .Trim()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(term => $"%{term}%")
            .ToArray();

        var searchable = _dbContext.Patients.AsNoTracking().AsQueryable();

        foreach (var termPattern in terms)
        {
            searchable = searchable.Where(p =>
                EF.Functions.ILike(p.PatientName, termPattern) ||
                EF.Functions.ILike(p.Uhid, termPattern) ||
                EF.Functions.ILike(p.Mobile, termPattern));
        }

        return await searchable
            .OrderBy(p => p.PatientName)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Patient> CreateAsync(Patient patient)
    {
        _dbContext.Patients.Add(patient);
        await _dbContext.SaveChangesAsync();
        return patient;
    }

    public async Task<Patient> UpdateAsync(Patient patient)
    {
        patient.UpdatedAt = DateTime.UtcNow;
        _dbContext.Patients.Update(patient);
        await _dbContext.SaveChangesAsync();
        return patient;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var patient = await GetByIdAsync(id);
        if (patient == null)
            return false;

        _dbContext.Patients.Remove(patient);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}
