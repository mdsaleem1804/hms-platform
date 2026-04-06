using HMS.Application.Features.Patients;

namespace HMS.Application.Features.Patients;

public interface IPatientService
{
    Task<PatientDto> CreatePatientAsync(CreatePatientDto request);
    Task<PatientDto?> GetPatientByIdAsync(long id);
    Task<List<PatientDto>> GetAllPatientsAsync();
    Task<PagedResultDto<PatientDto>> GetPatientsAsync(PatientListQueryDto query);
    Task<List<PatientSummaryDto>> SearchPatientsAsync(string query, int limit);
    Task<PatientDto> UpdatePatientAsync(long id, UpdatePatientDto request);
    Task<bool> DeletePatientAsync(long id);
    Task<PatientDetailsDto?> GetPatientDetailsByIdAsync(long id);
    Task<MedicalHistoryDto?> GetMedicalHistoryAsync(long patientId);
    Task<List<VitalSignsDto>> GetVitalSignsAsync(long patientId, int limit = 50);
    Task<List<MedicationDto>> GetMedicationsAsync(long patientId, bool? isActive = null);
    Task<List<LabReportDto>> GetLabReportsAsync(long patientId, string? status = null);
    Task<List<ProgressNoteDto>> GetProgressNotesAsync(long patientId, int limit = 100);
    Task<AdmissionDetailsDto?> GetCurrentAdmissionAsync(long patientId);
    Task<List<AdmissionDetailsDto>> GetAdmissionHistoryAsync(long patientId);
}
