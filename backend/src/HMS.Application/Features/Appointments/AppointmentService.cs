using HMS.Application.Repositories;
using HMS.Domain.Entities;

namespace HMS.Application.Features.Appointments;

public class AppointmentService : IAppointmentService
{
    private static readonly HashSet<string> AllowedReminderChannels = new(StringComparer.OrdinalIgnoreCase)
    {
        "email",
        "sms",
        "whatsapp",
    };

    private static readonly HashSet<string> AllowedReminderTimings = new(StringComparer.OrdinalIgnoreCase)
    {
        "15min",
        "30min",
        "1hour",
        "2hours",
        "1day",
        "2days",
    };

    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IBillingRepository _billingRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IDoctorRepository _doctorRepository;
    private readonly IDepartmentRepository _departmentRepository;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IBillingRepository billingRepository,
        IPatientRepository patientRepository,
        IDoctorRepository doctorRepository,
        IDepartmentRepository departmentRepository)
    {
        _appointmentRepository = appointmentRepository;
        _billingRepository = billingRepository;
        _patientRepository = patientRepository;
        _doctorRepository = doctorRepository;
        _departmentRepository = departmentRepository;
    }

    public async Task<List<AppointmentDto>> GetAllAppointmentsAsync(AppointmentListQueryDto query)
    {
        query ??= new AppointmentListQueryDto();

        var appointments = await _appointmentRepository.GetAllAsync(
            query.Search,
            query.Status,
            query.DoctorId,
            query.DepartmentId,
            query.FromDate,
            query.ToDate);

        var paymentStatuses = await _billingRepository.GetPaymentStatusesByAppointmentIdsAsync(
            appointments.Select(appointment => appointment.Id));

        return appointments
            .Select(appointment => MapToDto(
                appointment,
                paymentStatuses.TryGetValue(appointment.Id, out var paymentStatus) ? paymentStatus : "Not Billed"))
            .ToList();
    }

    public async Task<AppointmentDto?> GetAppointmentByIdAsync(string id)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        if (appointment == null)
        {
            return null;
        }

        var paymentStatuses = await _billingRepository.GetPaymentStatusesByAppointmentIdsAsync([appointment.Id]);
        return MapToDto(appointment, paymentStatuses.TryGetValue(appointment.Id, out var paymentStatus) ? paymentStatus : "Not Billed");
    }

    public async Task<AppointmentDto?> GetAppointmentByDisplayIdAsync(int displayId)
    {
        var appointment = await _appointmentRepository.GetByDisplayIdAsync(displayId);
        if (appointment == null)
        {
            return null;
        }

        var paymentStatuses = await _billingRepository.GetPaymentStatusesByAppointmentIdsAsync([appointment.Id]);
        return MapToDto(appointment, paymentStatuses.TryGetValue(appointment.Id, out var paymentStatus) ? paymentStatus : "Not Billed");
    }

    public async Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto request)
    {
        var (patient, doctor, department, appointmentDate, startTime, endTime) = await ValidateRequestAsync(request);

        var tokenNumber = await _appointmentRepository.GetNextTokenNumberAsync(doctor.Id, appointmentDate);

        var appointment = new Appointment
        {
            Id = Guid.NewGuid().ToString(),
            AppointmentNo = Guid.NewGuid().ToString("N"), // temp; replaced by repository using display_id
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            AppointmentDate = appointmentDate,
            StartTime = startTime,
            EndTime = endTime,
            TokenNumber = tokenNumber,
            Status = NormalizeStatus(request.Status),
            VisitType = request.VisitType.Trim(),
            Department = department.Name,
            Priority = NormalizePriority(request.Priority),
            Notes = request.Notes?.Trim() ?? string.Empty,
            Reminders = MapReminderEntities(request.Reminders),
        };

        var createdAppointment = await _appointmentRepository.CreateAsync(appointment);
        return MapToDto(createdAppointment);
    }

    public async Task<AppointmentDto> UpdateAppointmentAsync(string id, UpdateAppointmentDto request)
    {
        var existingAppointment = await _appointmentRepository.GetByIdAsync(id);
        if (existingAppointment == null)
        {
            throw new KeyNotFoundException($"Appointment with ID {id} not found");
        }

        if (existingAppointment.CreatedAt.Date != DateTime.UtcNow.Date)
        {
            throw new InvalidOperationException("Editing is allowed only for records created today");
        }

        var (patient, doctor, department, appointmentDate, startTime, endTime) = await ValidateRequestAsync(request, id);

        // Update scalar properties only
        existingAppointment.PatientId = patient.Id;
        existingAppointment.DoctorId = doctor.Id;
        existingAppointment.AppointmentDate = appointmentDate;
        existingAppointment.StartTime = startTime;
        existingAppointment.EndTime = endTime;
        existingAppointment.Status = NormalizeStatus(request.Status);
        existingAppointment.VisitType = request.VisitType.Trim();
        existingAppointment.Department = department.Name;
        existingAppointment.Priority = NormalizePriority(request.Priority);
        existingAppointment.Notes = request.Notes?.Trim() ?? string.Empty;
        existingAppointment.UpdatedAt = DateTime.UtcNow;

        // Handle reminders: build the new list first
        var newReminders = MapReminderEntities(request.Reminders);
        
        // Clear old reminders and add new ones
        // The cascade delete configuration will handle database cleanup
        existingAppointment.Reminders.Clear();
        foreach (var reminder in newReminders)
        {
            existingAppointment.Reminders.Add(reminder);
        }

        try
        {
            var updatedAppointment = await _appointmentRepository.UpdateAsync(existingAppointment);
            return MapToDto(updatedAppointment);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UpdateAppointmentAsync failed: {ex.GetType().Name}");
            Console.WriteLine($"Message: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner: {ex.InnerException.Message}");
            }
            throw;
        }
    }

    public async Task DeleteAppointmentAsync(string id)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        if (appointment == null)
        {
            throw new KeyNotFoundException($"Appointment with ID {id} not found");
        }

        await _appointmentRepository.DeleteAsync(id);
    }

    private async Task<(Patient Patient, Doctor Doctor, Department Department, DateTime AppointmentDate, TimeSpan StartTime, TimeSpan EndTime)> ValidateRequestAsync(
        CreateAppointmentDto request,
        string? appointmentId = null)
    {
        if (request.PatientId <= 0)
        {
            throw new ArgumentException("Patient selection is required", nameof(request.PatientId));
        }

        if (string.IsNullOrWhiteSpace(request.DepartmentId))
        {
            throw new ArgumentException("Department selection is required", nameof(request.DepartmentId));
        }

        if (string.IsNullOrWhiteSpace(request.DoctorId))
        {
            throw new ArgumentException("Doctor selection is required", nameof(request.DoctorId));
        }

        if (request.AppointmentDate == default)
        {
            throw new ArgumentException("Appointment date is required", nameof(request.AppointmentDate));
        }

        if (string.IsNullOrWhiteSpace(request.VisitType))
        {
            throw new ArgumentException("Visit type is required", nameof(request.VisitType));
        }

        var appointmentDate = request.AppointmentDate.Date;
        if (appointmentDate < DateTime.UtcNow.Date)
        {
            throw new ArgumentException("Appointment date cannot be in the past", nameof(request.AppointmentDate));
        }

        var patient = await _patientRepository.GetByIdAsync(request.PatientId)
            ?? throw new KeyNotFoundException($"Patient with ID {request.PatientId} not found");

        var department = await _departmentRepository.GetByIdAsync(request.DepartmentId)
            ?? throw new KeyNotFoundException($"Department with ID {request.DepartmentId} not found");

        var doctor = await _doctorRepository.GetByIdAsync(request.DoctorId)
            ?? throw new KeyNotFoundException($"Doctor with ID {request.DoctorId} not found");

        if (!string.Equals(doctor.DepartmentId, department.Id, StringComparison.Ordinal))
        {
            throw new ArgumentException("Selected doctor does not belong to the selected department");
        }

        var startTime = ParseTime(request.StartTime, nameof(request.StartTime));
        var endTime = ParseTime(request.EndTime, nameof(request.EndTime));
        if (endTime <= startTime)
        {
            throw new ArgumentException("End time must be later than start time", nameof(request.EndTime));
        }

        ValidateReminders(request.Reminders);

        return (patient, doctor, department, appointmentDate, startTime, endTime);
    }

    private static TimeSpan ParseTime(string value, string parameterName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Time is required", parameterName);
        }

        if (TimeSpan.TryParse(value, out var parsedTime))
        {
            return parsedTime;
        }

        throw new ArgumentException("Invalid time format. Use HH:mm", parameterName);
    }

    private static void ValidateReminders(IEnumerable<CreateAppointmentReminderDto>? reminders)
    {
        if (reminders == null)
        {
            return;
        }

        foreach (var reminder in reminders)
        {
            if (string.IsNullOrWhiteSpace(reminder.Channel) || !AllowedReminderChannels.Contains(reminder.Channel))
            {
                throw new ArgumentException($"Unsupported reminder channel '{reminder.Channel}'");
            }

            if (string.IsNullOrWhiteSpace(reminder.Timing) || !AllowedReminderTimings.Contains(reminder.Timing))
            {
                throw new ArgumentException($"Unsupported reminder timing '{reminder.Timing}'");
            }
        }
    }

    private static List<AppointmentReminder> MapReminderEntities(IEnumerable<CreateAppointmentReminderDto>? reminders)
    {
        if (reminders == null)
        {
            return new List<AppointmentReminder>();
        }

        return reminders.Select(reminder => new AppointmentReminder
        {
            Id = Guid.NewGuid().ToString(),
            Channel = reminder.Channel.Trim().ToLowerInvariant(),
            Timing = reminder.Timing.Trim().ToLowerInvariant(),
        }).ToList();
    }

    private static string NormalizeStatus(string? status)
    {
        return string.IsNullOrWhiteSpace(status) ? "scheduled" : status.Trim().ToLowerInvariant();
    }

    private static string NormalizePriority(string? priority)
    {
        return string.IsNullOrWhiteSpace(priority) ? "normal" : priority.Trim().ToLowerInvariant();
    }

    private static AppointmentDto MapToDto(Appointment appointment, string opdPaymentStatus = "Not Billed")
    {
        return new AppointmentDto
        {
            Id = appointment.Id,
            DisplayId = appointment.DisplayId,
            AppointmentNo = appointment.AppointmentNo,
            PatientId = appointment.PatientId,
            PatientUhid = appointment.Patient?.Uhid ?? string.Empty,
            PatientName = appointment.Patient?.PatientName ?? string.Empty,
            DoctorId = appointment.DoctorId,
            DoctorName = appointment.Doctor?.Name ?? string.Empty,
            DoctorSpecialization = appointment.Doctor?.Specialization ?? string.Empty,
            DepartmentId = appointment.Doctor?.DepartmentId ?? string.Empty,
            DepartmentName = appointment.Department,
            AppointmentDate = appointment.AppointmentDate,
            StartTime = appointment.StartTime.ToString(@"hh\:mm"),
            EndTime = appointment.EndTime.ToString(@"hh\:mm"),
            TokenNumber = appointment.TokenNumber,
            Status = appointment.Status,
            VisitType = appointment.VisitType,
            Priority = appointment.Priority,
            Notes = appointment.Notes,
            OpdPaymentStatus = opdPaymentStatus,
            CreatedAt = appointment.CreatedAt,
            Reminders = appointment.Reminders
                .OrderBy(reminder => reminder.Channel)
                .Select(reminder => new AppointmentReminderDto
                {
                    Id = reminder.Id,
                    Channel = reminder.Channel,
                    Timing = reminder.Timing,
                })
                .ToList(),
        };
    }
}