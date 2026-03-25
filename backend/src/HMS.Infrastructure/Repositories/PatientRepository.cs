using HMS.Domain.Entities;

namespace HMS.Infrastructure.Repositories;

public interface IPatientRepository
{
    Task<List<Patient>> GetAllAsync();
    Task<Patient?> GetByIdAsync(string id);
    Task<Patient> AddAsync(Patient patient);
    Task<Patient> UpdateAsync(Patient patient);
    Task<bool> DeleteAsync(string id);
}

public class PatientRepository : IPatientRepository
{
    public async Task<List<Patient>> GetAllAsync()
    {
        // TODO: Implement using DbContext
        return await Task.FromResult(new List<Patient>());
    }

    public async Task<Patient?> GetByIdAsync(string id)
    {
        // TODO: Implement using DbContext
        return await Task.FromResult<Patient?>(null);
    }

    public async Task<Patient> AddAsync(Patient patient)
    {
        // TODO: Implement using DbContext
        return await Task.FromResult(patient);
    }

    public async Task<Patient> UpdateAsync(Patient patient)
    {
        // TODO: Implement using DbContext
        return await Task.FromResult(patient);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        // TODO: Implement using DbContext
        return await Task.FromResult(false);
    }
}
