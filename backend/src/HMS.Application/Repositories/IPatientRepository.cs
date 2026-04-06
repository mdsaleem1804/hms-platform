using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IPatientRepository
{
    Task<Patient?> GetByMobileAsync(string mobile);
    Task<Patient?> GetByIdAsync(long id);
    Task<Patient?> GetByIdWithDetailsAsync(long id);
    Task<Patient?> GetByUhidAsync(string uhid);
    Task<List<Patient>> GetAllAsync();
    Task<(List<Patient> Items, int TotalRecords)> GetPagedAsync(string? search, string? gender, string? status, int page, int pageSize);
    Task<List<Patient>> SearchAsync(string query, int limit);
    Task<Patient> CreateAsync(Patient patient);
    Task<Patient> UpdateAsync(Patient patient);
    Task<bool> DeleteAsync(long id);

    Task<MedicalHistory?> GetMedicalHistoryByPatientIdAsync(long patientId);
    Task<List<VitalSigns>> GetVitalSignsByPatientIdAsync(long patientId, int limit = 50);
    Task<List<Medication>> GetMedicationsByPatientIdAsync(long patientId, bool? isActive = null);
    Task<List<LabReport>> GetLabReportsByPatientIdAsync(long patientId, string? status = null);
    Task<List<ProgressNote>> GetProgressNotesByPatientIdAsync(long patientId, int limit = 100);
    Task<AdmissionDetails?> GetCurrentAdmissionByPatientIdAsync(long patientId);
    Task<List<AdmissionDetails>> GetAdmissionHistoryByPatientIdAsync(long patientId);
}
