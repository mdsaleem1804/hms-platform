using HMS.Application.Repositories;
using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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
        try
        {
            return await _context.HospitalSettings
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }
        catch (PostgresException ex) when (IsMissingTableError(ex))
        {
            await EnsureHospitalSettingsTableExistsAsync();

            return await _context.HospitalSettings
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }
    }

    public async Task<HospitalSettings> UpsertAsync(HospitalSettings settings)
    {
        HospitalSettings? existing;

        try
        {
            existing = await _context.HospitalSettings.FirstOrDefaultAsync();
        }
        catch (PostgresException ex) when (IsMissingTableError(ex))
        {
            await EnsureHospitalSettingsTableExistsAsync();
            existing = await _context.HospitalSettings.FirstOrDefaultAsync();
        }

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

    private static bool IsMissingTableError(PostgresException ex)
    {
        return ex.SqlState == "42P01";
    }

    private async Task EnsureHospitalSettingsTableExistsAsync()
    {
        const string createTableSql = @"
CREATE TABLE IF NOT EXISTS hospital_settings (
    id character varying(50) NOT NULL,
    hospital_name character varying(200) NOT NULL,
    address_line1 character varying(300) NOT NULL DEFAULT '',
    address_line2 character varying(300) NOT NULL DEFAULT '',
    city character varying(120) NOT NULL DEFAULT '',
    state character varying(120) NOT NULL DEFAULT '',
    postal_code character varying(20) NOT NULL DEFAULT '',
    country character varying(120) NOT NULL DEFAULT '',
    phone_number character varying(30) NOT NULL DEFAULT '',
    alternate_phone_number character varying(30) NOT NULL DEFAULT '',
    email character varying(160) NOT NULL DEFAULT '',
    website character varying(160) NOT NULL DEFAULT '',
    gst_number character varying(60) NOT NULL DEFAULT '',
    registration_number character varying(100) NOT NULL DEFAULT '',
    report_header_tagline character varying(200) NOT NULL DEFAULT '',
    report_footer_note character varying(500) NOT NULL DEFAULT '',
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    is_deleted boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT PK_hospital_settings PRIMARY KEY (id)
);";

        await _context.Database.ExecuteSqlRawAsync(createTableSql);
    }
}
