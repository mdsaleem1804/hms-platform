using HMS.Application.Features.Patients;
using HMS.Application.Repositories;
using HMS.Domain.Entities;
using HMS.Domain.Interfaces;

namespace HMS.Application.Features.Patients;

/// <summary>
/// Service layer for patient operations
/// Throws meaningful exceptions that are handled by GlobalExceptionMiddleware
/// </summary>
public class PatientService : IPatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUhidGenerator _uhidGenerator;

    public PatientService(IPatientRepository patientRepository, IUhidGenerator uhidGenerator)
    {
        _patientRepository = patientRepository;
        _uhidGenerator = uhidGenerator;
    }

    public async Task<PatientDto> CreatePatientAsync(CreatePatientDto request)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(request.PatientName))
        {
            throw new ArgumentException("Patient name is required", nameof(request.PatientName));
        }

        if (string.IsNullOrWhiteSpace(request.Mobile))
        {
            throw new ArgumentException("Mobile number is required", nameof(request.Mobile));
        }

        if (request.Dob == default)
        {
            throw new ArgumentException("Date of birth is required", nameof(request.Dob));
        }

        // Check for duplicate mobile
        var existingPatient = await _patientRepository.GetByMobileAsync(request.Mobile);
        if (existingPatient != null)
        {
            throw new InvalidOperationException($"A patient with mobile number {request.Mobile} already exists");
        }

        // Handle UHID: Generate if not provided, validate if provided
        var uhid = request.Uhid?.Trim();
        if (string.IsNullOrWhiteSpace(uhid))
        {
            // Auto-generate UHID
            uhid = _uhidGenerator.Generate();
        }
        else
        {
            // Validate UHID uniqueness if provided
            var existingUhid = await _patientRepository.GetByUhidAsync(uhid);
            if (existingUhid != null)
            {
                throw new InvalidOperationException($"A patient with UHID '{uhid}' already exists");
            }
        }

        // Create new patient entity
        var patient = new Patient
        {
            Uhid = uhid,
            PatientName = request.PatientName,
            Dob = request.Dob,
            Gender = request.Gender,
            BloodGroup = request.BloodGroup,
            Mobile = request.Mobile,
            Email = request.Email,
            Address = request.Address,
            PostalCode = request.PostalCode,
            Photo = request.Photo,
            IdProofType = request.IdProofType,
            IdProofNumber = request.IdProofNumber,
            Status = request.Status ?? "ACTIVE"
        };

        // Save to database
        var createdPatient = await _patientRepository.CreateAsync(patient);

        // Map to DTO and return
        return MapToDto(createdPatient);
    }

    public async Task<PatientDto?> GetPatientByIdAsync(long id)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        return patient == null ? null : MapToDto(patient);
    }

    public async Task<List<PatientDto>> GetAllPatientsAsync()
    {
        var patients = await _patientRepository.GetAllAsync();
        return patients.Select(MapToDto).ToList();
    }

    public async Task<List<PatientSummaryDto>> SearchPatientsAsync(string query, int limit)
    {
        if (string.IsNullOrWhiteSpace(query))
            return [];

        limit = Math.Clamp(limit, 1, 50);
        var patients = await _patientRepository.SearchAsync(query, limit);
        return patients.Select(MapToSummaryDto).ToList();
    }

    public async Task<PatientDto> UpdatePatientAsync(long id, UpdatePatientDto request)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(request.PatientName))
        {
            throw new ArgumentException("Patient name is required", nameof(request.PatientName));
        }

        if (string.IsNullOrWhiteSpace(request.Mobile))
        {
            throw new ArgumentException("Mobile number is required", nameof(request.Mobile));
        }

        if (request.Dob == default)
        {
            throw new ArgumentException("Date of birth is required", nameof(request.Dob));
        }

        // Get existing patient
        var existingPatient = await _patientRepository.GetByIdAsync(id);
        if (existingPatient == null)
        {
            throw new KeyNotFoundException($"Patient with ID {id} not found");
        }

        // Check for duplicate mobile if mobile is different
        if (existingPatient.Mobile != request.Mobile)
        {
            var patientWithMobile = await _patientRepository.GetByMobileAsync(request.Mobile);
            if (patientWithMobile != null)
            {
                throw new InvalidOperationException($"A patient with mobile number {request.Mobile} already exists");
            }
        }

        // Update patient entity (Do NOT update UHID)
        existingPatient.PatientName = request.PatientName;
        existingPatient.Dob = request.Dob;
        existingPatient.Gender = request.Gender;
        existingPatient.BloodGroup = request.BloodGroup;
        existingPatient.Mobile = request.Mobile;
        existingPatient.Email = request.Email;
        existingPatient.Address = request.Address;
        existingPatient.PostalCode = request.PostalCode;
        existingPatient.Photo = request.Photo;
        existingPatient.IdProofType = request.IdProofType;
        existingPatient.IdProofNumber = request.IdProofNumber;
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            existingPatient.Status = request.Status;
        }

        var updatedPatient = await _patientRepository.UpdateAsync(existingPatient);
        return MapToDto(updatedPatient);
    }

    public async Task<bool> DeletePatientAsync(long id)
    {
        var patient = await _patientRepository.GetByIdAsync(id);
        if (patient == null)
        {
            throw new KeyNotFoundException($"Patient with ID {id} not found");
        }

        return await _patientRepository.DeleteAsync(id);
    }

    private PatientDto MapToDto(Patient patient)
    {
        return new PatientDto
        {
            Id = patient.Id,
            Uhid = patient.Uhid,
            PatientName = patient.PatientName,
            Dob = patient.Dob,
            Age = CalculateAge(patient.Dob),
            Gender = patient.Gender,
            BloodGroup = patient.BloodGroup,
            Mobile = patient.Mobile,
            Email = patient.Email,
            Address = patient.Address,
            PostalCode = patient.PostalCode,
            Photo = patient.Photo,
            IdProofType = patient.IdProofType,
            IdProofNumber = patient.IdProofNumber,
            Status = patient.Status,
            EmergencyContact = new EmergencyContactDto(),
            Attender = new AttenderDto(),
            Referral = new ReferralDto()
        };
    }

    private PatientSummaryDto MapToSummaryDto(Patient patient) => new()
    {
        Id = patient.Id,
        Uhid = patient.Uhid,
        PatientName = patient.PatientName,
        Dob = patient.Dob,
        Age = CalculateAge(patient.Dob),
        Gender = patient.Gender,
        BloodGroup = patient.BloodGroup,
        Mobile = patient.Mobile
    };

    private int CalculateAge(DateTime dob)
    {
        var today = DateTime.Today;
        var age = today.Year - dob.Year;
        if (dob.Date > today.AddYears(-age))
            age--;
        return age;
    }
}
