using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IHospitalSettingsRepository
{
    Task<HospitalSettings?> GetAsync();
    Task<HospitalSettings> UpsertAsync(HospitalSettings settings);
}
