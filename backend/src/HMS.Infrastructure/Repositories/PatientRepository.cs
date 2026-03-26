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
