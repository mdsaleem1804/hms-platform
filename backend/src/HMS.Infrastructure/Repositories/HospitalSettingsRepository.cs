using HMS.Application.Repositories;
using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Infrastructure.Repositories;

public class HospitalSettingsRepository : IHospitalSettingsRepository
{
    private readonly AppDbContext _context;

    public HospitalSettingsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<HospitalSettings?> GetAsync()
    {
        return await _context.HospitalSettings
            .AsNoTracking()
            .FirstOrDefaultAsync();
    }

    public async Task<HospitalSettings> UpsertAsync(HospitalSettings settings)
    {
        var existing = await _context.HospitalSettings.FirstOrDefaultAsync();

        if (existing == null)
        {
            settings.Id = string.IsNullOrWhiteSpace(settings.Id) ? Guid.NewGuid().ToString("N") : settings.Id;
            settings.CreatedAt = DateTime.UtcNow;
            settings.UpdatedAt = DateTime.UtcNow;
            settings.IsDeleted = false;
            _context.HospitalSettings.Add(settings);
            await _context.SaveChangesAsync();
            return settings;
        }

        existing.HospitalName = settings.HospitalName;
        existing.AddressLine1 = settings.AddressLine1;
        existing.AddressLine2 = settings.AddressLine2;
        existing.City = settings.City;
        existing.State = settings.State;
        existing.PostalCode = settings.PostalCode;
        existing.Country = settings.Country;
        existing.PhoneNumber = settings.PhoneNumber;
        existing.AlternatePhoneNumber = settings.AlternatePhoneNumber;
        existing.Email = settings.Email;
        existing.Website = settings.Website;
        existing.GstNumber = settings.GstNumber;
        existing.RegistrationNumber = settings.RegistrationNumber;
        existing.ReportHeaderTagline = settings.ReportHeaderTagline;
        existing.ReportFooterNote = settings.ReportFooterNote;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existing;
    }
}
