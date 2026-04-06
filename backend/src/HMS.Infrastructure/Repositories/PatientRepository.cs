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

    public async Task<Patient?> GetByIdWithDetailsAsync(long id)
    {
        return await _dbContext.Patients
            .Include(p => p.Appointments)
            .Include(p => p.Billings)
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

    public async Task<MedicalHistory?> GetMedicalHistoryByPatientIdAsync(long patientId)
    {
        return await _dbContext.MedicalHistories
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.PatientId == patientId);
    }

    public async Task<List<VitalSigns>> GetVitalSignsByPatientIdAsync(long patientId, int limit = 50)
    {
        limit = Math.Clamp(limit, 1, 200);

        return await _dbContext.VitalSigns
            .AsNoTracking()
            .Where(v => v.PatientId == patientId)
            .OrderByDescending(v => v.RecordedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<Medication>> GetMedicationsByPatientIdAsync(long patientId, bool? isActive = null)
    {
        var query = _dbContext.Medications
            .AsNoTracking()
            .Include(m => m.PrescribedByDoctor)
            .Where(m => m.PatientId == patientId);

        if (isActive.HasValue)
        {
            query = query.Where(m => m.IsActive == isActive.Value);
        }

        return await query
            .OrderByDescending(m => m.StartDate)
            .ToListAsync();
    }

    public async Task<List<LabReport>> GetLabReportsByPatientIdAsync(long patientId, string? status = null)
    {
        var query = _dbContext.LabReports
            .AsNoTracking()
            .Include(r => r.OrderedByDoctor)
            .Where(r => r.PatientId == patientId);

        if (!string.IsNullOrWhiteSpace(status))
        {
            var statusValue = status.Trim();
            query = query.Where(r => EF.Functions.ILike(r.Status, statusValue));
        }

        return await query
            .OrderByDescending(r => r.TestDate)
            .ToListAsync();
    }

    public async Task<List<ProgressNote>> GetProgressNotesByPatientIdAsync(long patientId, int limit = 100)
    {
        limit = Math.Clamp(limit, 1, 500);

        return await _dbContext.ProgressNotes
            .AsNoTracking()
            .Where(p => p.PatientId == patientId)
            .OrderByDescending(p => p.NotedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<AdmissionDetails?> GetCurrentAdmissionByPatientIdAsync(long patientId)
    {
        return await _dbContext.AdmissionDetails
            .AsNoTracking()
            .Include(a => a.AssignedDoctor)
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.AdmissionDate)
            .FirstOrDefaultAsync(a => a.DischargeDate == null);
    }

    public async Task<List<AdmissionDetails>> GetAdmissionHistoryByPatientIdAsync(long patientId)
    {
        return await _dbContext.AdmissionDetails
            .AsNoTracking()
            .Include(a => a.AssignedDoctor)
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.AdmissionDate)
            .ToListAsync();
    }
}
