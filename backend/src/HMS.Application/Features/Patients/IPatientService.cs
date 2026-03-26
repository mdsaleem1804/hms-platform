using HMS.Application.Features.Patients;

namespace HMS.Application.Features.Patients;

public interface IPatientService
{
    Task<PatientDto> CreatePatientAsync(CreatePatientDto request);
    Task<PatientDto?> GetPatientByIdAsync(long id);
    Task<List<PatientDto>> GetAllPatientsAsync();
    Task<PatientDto> UpdatePatientAsync(long id, UpdatePatientDto request);
    Task<bool> DeletePatientAsync(long id);
}
