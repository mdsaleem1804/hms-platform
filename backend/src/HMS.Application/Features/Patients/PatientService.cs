using HMS.Application.Features.Patients;
using HMS.Application.Repositories;
using HMS.Domain.Entities;
using HMS.Domain.Interfaces;
using HMS.Application.Features.Appointments;
using HMS.Application.Features.Billing;

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

    public async Task<PagedResultDto<PatientDto>> GetPatientsAsync(PatientListQueryDto query)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = query.PageSize switch
        {
            <= 10 => 10,
            <= 25 => 25,
            <= 50 => 50,
            <= 100 => 100,
            _ => 100,
        };

        var (items, totalRecords) = await _patientRepository.GetPagedAsync(
            query.Search,
            query.Gender,
            query.Status,
            page,
            pageSize);

        return new PagedResultDto<PatientDto>
        {
            Items = items.Select(MapToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalRecords = totalRecords,
            TotalPages = totalRecords == 0 ? 0 : (int)Math.Ceiling(totalRecords / (double)pageSize),
        };
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
        throw new InvalidOperationException("Patient deletion is not allowed");
    }

    public async Task<PatientDetailsDto?> GetPatientDetailsByIdAsync(long id)
    {
        var patient = await _patientRepository.GetByIdWithDetailsAsync(id);
        if (patient == null)
        {
            return null;
        }

        var billings = patient.Billings.Select(MapBillingToDto).ToList();

        return new PatientDetailsDto
        {
            Id = patient.Id,
            Uhid = patient.Uhid,
            PatientName = patient.PatientName,
            Dob = patient.Dob,
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
            CreatedAt = patient.CreatedAt,
            UpdatedAt = patient.UpdatedAt,
            PreviousAppointments = patient.Appointments.Where(a => a.AppointmentDate < DateTime.UtcNow).Select(MapAppointmentToDto).ToList(),
            CurrentAppointment = patient.Appointments.Where(a => a.AppointmentDate >= DateTime.UtcNow).Select(MapAppointmentToDto).FirstOrDefault(),
            OpdBillings = billings.Where(b => b.VisitType == "OPD").ToList(),
            EcgBillings = billings.Where(b => b.VisitType == "ECG").ToList(),
            XrayBillings = billings.Where(b => b.VisitType == "XRAY").ToList(),
            LabBillings = billings.Where(b => b.VisitType == "LAB").ToList(),
            IpBillings = billings.Where(b => b.VisitType == "IP").ToList()
        };
    }

    public async Task<MedicalHistoryDto?> GetMedicalHistoryAsync(long patientId)
    {
        await EnsurePatientExistsAsync(patientId);
        var history = await _patientRepository.GetMedicalHistoryByPatientIdAsync(patientId);
        return history == null ? null : MapMedicalHistoryToDto(history);
    }

    public async Task<List<VitalSignsDto>> GetVitalSignsAsync(long patientId, int limit = 50)
    {
        await EnsurePatientExistsAsync(patientId);
        var vitals = await _patientRepository.GetVitalSignsByPatientIdAsync(patientId, limit);
        return vitals.Select(MapVitalSignsToDto).ToList();
    }

    public async Task<List<MedicationDto>> GetMedicationsAsync(long patientId, bool? isActive = null)
    {
        await EnsurePatientExistsAsync(patientId);
        var medications = await _patientRepository.GetMedicationsByPatientIdAsync(patientId, isActive);
        return medications.Select(MapMedicationToDto).ToList();
    }

    public async Task<List<LabReportDto>> GetLabReportsAsync(long patientId, string? status = null)
    {
        await EnsurePatientExistsAsync(patientId);
        var reports = await _patientRepository.GetLabReportsByPatientIdAsync(patientId, status);
        return reports.Select(MapLabReportToDto).ToList();
    }

    public async Task<List<ProgressNoteDto>> GetProgressNotesAsync(long patientId, int limit = 100)
    {
        await EnsurePatientExistsAsync(patientId);
        var notes = await _patientRepository.GetProgressNotesByPatientIdAsync(patientId, limit);
        return notes.Select(MapProgressNoteToDto).ToList();
    }

    public async Task<AdmissionDetailsDto?> GetCurrentAdmissionAsync(long patientId)
    {
        await EnsurePatientExistsAsync(patientId);
        var admission = await _patientRepository.GetCurrentAdmissionByPatientIdAsync(patientId);
        return admission == null ? null : MapAdmissionToDto(admission);
    }

    public async Task<List<AdmissionDetailsDto>> GetAdmissionHistoryAsync(long patientId)
    {
        await EnsurePatientExistsAsync(patientId);
        var admissions = await _patientRepository.GetAdmissionHistoryByPatientIdAsync(patientId);
        return admissions.Select(MapAdmissionToDto).ToList();
    }

    private AppointmentDto MapAppointmentToDto(Appointment appointment)
    {
        return new AppointmentDto
        {
            Id = appointment.Id.ToString(),
            DisplayId = appointment.DisplayId,
            AppointmentNo = appointment.AppointmentNo,
            PatientId = appointment.PatientId,
            PatientUhid = appointment.Patient?.Uhid ?? string.Empty,
            PatientName = appointment.Patient?.PatientName ?? string.Empty,
            DoctorId = appointment.DoctorId,
            DoctorName = appointment.Doctor?.Name ?? string.Empty,
            DoctorSpecialization = appointment.Doctor?.Specialization ?? string.Empty,
            DepartmentId = string.Empty,
            DepartmentName = appointment.Department,
            AppointmentDate = appointment.AppointmentDate,
            StartTime = appointment.StartTime.ToString(@"hh\:mm"),
            EndTime = appointment.EndTime.ToString(@"hh\:mm"),
            TokenNumber = appointment.TokenNumber,
            Status = appointment.Status,
            VisitType = appointment.VisitType,
            Priority = appointment.Priority,
            Notes = appointment.Notes,
            CreatedAt = appointment.CreatedAt
        };
    }

    private BillingDto MapBillingToDto(HMS.Domain.Entities.Billing billing)
    {
        return new BillingDto
        {
            Id = billing.Id,
            BillNumber = billing.BillNumber,
            PatientId = billing.PatientId,
            PatientName = billing.Patient?.PatientName ?? string.Empty,
            PatientUhid = billing.Patient?.Uhid ?? string.Empty,
            AppointmentId = billing.AppointmentId,
            VisitType = billing.VisitType,
            DoctorId = billing.DoctorId,
            DoctorName = billing.Doctor?.Name ?? string.Empty,
            Date = billing.Date,
            Subtotal = billing.Subtotal,
            Discount = billing.Discount,
            Tax = billing.Tax,
            NetAmount = billing.NetAmount,
            PaidAmount = billing.PaidAmount,
            BalanceAmount = billing.NetAmount - billing.PaidAmount,
            Status = "Billed",
            PaymentMode = billing.PaymentMode,
            TransactionId = billing.TransactionId,
            CreatedAt = billing.CreatedAt
        };
    }

    private MedicalHistoryDto MapMedicalHistoryToDto(MedicalHistory history)
    {
        return new MedicalHistoryDto
        {
            Id = history.Id,
            PatientId = history.PatientId,
            KnownAllergies = history.KnownAllergies,
            HasDrugAllergy = history.HasDrugAllergy,
            HasFoodAllergy = history.HasFoodAllergy,
            AllergySeverity = history.AllergySeverity,
            ChronicConditions = history.ChronicConditions,
            IsDiabetic = history.IsDiabetic,
            IsHypertensive = history.IsHypertensive,
            HasHeartDisease = history.HasHeartDisease,
            HasAsthma = history.HasAsthma,
            HasKidneyDisease = history.HasKidneyDisease,
            HasThyroidDisease = history.HasThyroidDisease,
            FamilyHistoryOfDiabetes = history.FamilyHistoryOfDiabetes,
            FamilyHistoryOfHeartDisease = history.FamilyHistoryOfHeartDisease,
            FamilyHistoryOfCancer = history.FamilyHistoryOfCancer,
            OtherFamilyHistory = history.OtherFamilyHistory,
            PreviousSurgeries = history.PreviousSurgeries,
            Vaccinations = history.Vaccinations,
            IsSmoker = history.IsSmoker,
            UsesAlcohol = history.UsesAlcohol,
            ExerciseFrequency = history.ExerciseFrequency,
            PastMedications = history.PastMedications,
            CurrentMedications = history.CurrentMedications,
            AdditionalNotes = history.AdditionalNotes,
            CreatedAt = history.CreatedAt,
            UpdatedAt = history.UpdatedAt
        };
    }

    private VitalSignsDto MapVitalSignsToDto(VitalSigns vitalSigns)
    {
        return new VitalSignsDto
        {
            Id = vitalSigns.Id,
            PatientId = vitalSigns.PatientId,
            Temperature = vitalSigns.Temperature,
            SystolicBP = vitalSigns.SystolicBP,
            DiastolicBP = vitalSigns.DiastolicBP,
            PulseRate = vitalSigns.PulseRate,
            RespiratoryRate = vitalSigns.RespiratoryRate,
            OxygenSaturation = vitalSigns.OxygenSaturation,
            Weight = vitalSigns.Weight,
            Height = vitalSigns.Height,
            BMI = vitalSigns.BMI,
            Notes = vitalSigns.Notes,
            RecordedByUserId = vitalSigns.RecordedByUserId,
            RecordedByUserName = string.Empty,
            RecordedAt = vitalSigns.RecordedAt,
            CreatedAt = vitalSigns.CreatedAt,
            UpdatedAt = vitalSigns.UpdatedAt
        };
    }

    private MedicationDto MapMedicationToDto(Medication medication)
    {
        return new MedicationDto
        {
            Id = medication.Id,
            PatientId = medication.PatientId,
            MedicationName = medication.MedicationName,
            Dosage = medication.Dosage,
            Frequency = medication.Frequency,
            Route = medication.Route,
            Reason = medication.Reason,
            StartDate = medication.StartDate,
            EndDate = medication.EndDate,
            IsActive = medication.IsActive,
            PrescribedByDoctorId = medication.PrescribedByDoctorId,
            PrescribedByDoctorName = medication.PrescribedByDoctor?.Name ?? string.Empty,
            PrescriptionDate = medication.CreatedAt,
            SideEffects = medication.SideEffects,
            Contraindications = medication.Contraindications,
            Instructions = medication.Notes,
            IsMandatory = null,
            RefillCount = null,
            RefillsRemaining = null,
            CreatedAt = medication.CreatedAt,
            UpdatedAt = medication.UpdatedAt
        };
    }

    private LabReportDto MapLabReportToDto(LabReport report)
    {
        return new LabReportDto
        {
            Id = report.Id,
            PatientId = report.PatientId,
            ReportNumber = report.ReportNumber,
            TestName = report.TestName,
            TestCategory = report.TestCategory,
            TestDate = report.TestDate,
            ResultDate = report.ResultDate,
            Status = report.Status,
            TestResult = report.TestResult,
            IsAbnormal = report.IsAbnormal,
            AbnormalityReason = report.IsAbnormal ? report.Notes : null,
            NormalRange = report.ReferenceRange,
            ReportFilePath = report.ReportFilePath,
            OrderedByDoctorId = report.OrderedByDoctorId,
            OrderedByDoctorName = report.OrderedByDoctor?.Name ?? string.Empty,
            ReferenceLab = report.LabName,
            Cost = null,
            Notes = report.Notes,
            Recommendations = null,
            IsPatientCritical = false,
            CreatedAt = report.CreatedAt,
            UpdatedAt = report.UpdatedAt
        };
    }

    private ProgressNoteDto MapProgressNoteToDto(ProgressNote note)
    {
        return new ProgressNoteDto
        {
            Id = note.Id,
            PatientId = note.PatientId,
            Title = note.Title,
            NoteType = note.NoteType,
            NoteContent = note.NoteContent,
            Diagnosis = note.Diagnosis,
            TreatmentPlan = note.TreatmentPlan,
            Observations = note.Observations,
            Recommendations = note.Recommendations,
            IsCritical = note.IsCritical,
            EnteredByUserId = note.EnteredByUserId,
            EnteredByUserName = string.Empty,
            EnteredByUserRole = note.EnteredByUserRole,
            NotedAt = note.NotedAt,
            Signature = null,
            AttachedFilePath = null,
            IsConfidential = false,
            AcknowledgedByDoctorId = null,
            AcknowledgedAt = null,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt
        };
    }

    private AdmissionDetailsDto MapAdmissionToDto(AdmissionDetails admission)
    {
        return new AdmissionDetailsDto
        {
            Id = admission.Id,
            PatientId = admission.PatientId,
            AdmissionNumber = admission.AdmissionNumber,
            Department = admission.Department,
            AssignedDoctorId = admission.AssignedDoctorId,
            AssignedDoctorName = admission.AssignedDoctor?.Name ?? string.Empty,
            AdmissionDate = admission.AdmissionDate,
            AdmissionType = admission.AdmissionType,
            ReasonForAdmission = admission.ReasonForAdmission,
            PrimaryDiagnosis = admission.PrimaryDiagnosis,
            SecondaryDiagnosis = admission.SecondaryDiagnosis,
            RoomNumber = admission.RoomNumber,
            BedNumber = admission.BedNumber,
            RoomType = admission.RoomType,
            RoomCharges = admission.RoomCharges,
            DischargeDate = admission.DischargeDate,
            DischargeStatus = admission.DischargeStatus,
            DischargeNotes = admission.DischargeNotes,
            FollowUpInstructions = admission.FollowUpInstructions,
            ReferredFrom = admission.ReferredFrom,
            ReferredTo = admission.ReferredTo,
            SpecialRequirements = admission.SpecialRequirements,
            RequiresICU = admission.RequiresICU,
            IsEmergency = admission.IsEmergency,
            CreatedAt = admission.CreatedAt,
            UpdatedAt = admission.UpdatedAt
        };
    }

    private async Task EnsurePatientExistsAsync(long patientId)
    {
        var patient = await _patientRepository.GetByIdAsync(patientId);
        if (patient == null)
        {
            throw new KeyNotFoundException($"Patient with ID {patientId} not found");
        }
    }

    private PatientDto MapToDto(Patient patient)
    {
        return new PatientDto
        {
            Id = patient.Id,
            CreatedAt = patient.CreatedAt,
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
