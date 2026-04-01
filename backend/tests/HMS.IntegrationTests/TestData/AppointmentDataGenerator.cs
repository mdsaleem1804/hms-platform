using Bogus;
using HMS.Domain.Entities;

namespace HMS.IntegrationTests.TestData;

/// <summary>
/// Generates realistic appointment test data with varied dates, times, types and statuses.
/// </summary>
public class AppointmentDataGenerator
{
    private static readonly string[] _appointmentTypes = new[] { "OPD", "Emergency", "Follow-up", "Teleconsultation" };
    private static readonly string[] _statuses = new[] { "Scheduled", "Completed", "Cancelled", "No-Show" };
    private static readonly string[] _priorities = new[] { "Normal", "High", "Urgent" };

    private static int _appointmentIdCounter = 1001;
    private static int _tokenCounter = 1;
    private static readonly object _lockObject = new object();

    /// <summary>
    /// Generates a single appointment with randomized time slots and status.
    /// </summary>
    public static Appointment GenerateAppointment(long patientId, string doctorId, DateTime? appointmentDate = null)
    {
        var faker = new Faker();
        var date = appointmentDate ?? GenerateRandomAppointmentDate(faker);
        var startHour = faker.Random.Int(8, 17);
        var startMinute = faker.Random.Int(0, 59);

        var appointment = new Appointment
        {
            Id = Guid.NewGuid().ToString(),
            DisplayId = GetNextDisplayId(),
            AppointmentNo = $"APT-{DateTime.UtcNow:yyyyMMdd}-{GetNextDisplayId()}",
            PatientId = patientId,
            DoctorId = doctorId,
            AppointmentDate = date,
            StartTime = new TimeSpan(startHour, startMinute, 0),
            EndTime = new TimeSpan(startHour + 1, startMinute, 0),
            TokenNumber = GetNextToken(),
            Status = faker.PickRandom(_statuses),
            VisitType = faker.PickRandom(_appointmentTypes),
            Department = faker.Commerce.Department(3),
            Priority = faker.PickRandom(_priorities),
            Notes = faker.Lorem.Sentence(5),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        return appointment;
    }

    /// <summary>
    /// Generates multiple appointments for given patients and doctors.
    /// </summary>
    public static List<Appointment> GenerateAppointments(
        List<long> patientIds,
        List<string> doctorIds,
        int appointmentsPerDoctor = 7)
    {
        var appointments = new List<Appointment>();
        var faker = new Faker();

        foreach (var doctorId in doctorIds)
        {
            for (int i = 0; i < appointmentsPerDoctor; i++)
            {
                var patientId = faker.PickRandom(patientIds);
                var appointment = GenerateAppointment(patientId, doctorId);
                appointments.Add(appointment);
            }
        }

        return appointments;
    }

    /// <summary>
    /// Generates appointment with specific date and status for testing.
    /// </summary>
    public static Appointment GenerateAppointmentWithDateAndStatus(
        long patientId,
        string doctorId,
        DateTime date,
        string status,
        string visitType)
    {
        var faker = new Faker();
        var startHour = faker.Random.Int(8, 17);

        return new Appointment
        {
            Id = Guid.NewGuid().ToString(),
            DisplayId = GetNextDisplayId(),
            AppointmentNo = $"APT-{date:yyyyMMdd}-{GetNextDisplayId()}",
            PatientId = patientId,
            DoctorId = doctorId,
            AppointmentDate = date,
            StartTime = new TimeSpan(startHour, 0, 0),
            EndTime = new TimeSpan(startHour + 1, 0, 0),
            TokenNumber = GetNextToken(),
            Status = status,
            VisitType = visitType,
            Department = faker.Commerce.Department(3),
            Priority = faker.PickRandom(_priorities),
            Notes = faker.Lorem.Sentence(5),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDeleted = false
        };
    }

    /// <summary>
    /// Generates a random appointment date (past, current, or future).
    /// </summary>
    private static DateTime GenerateRandomAppointmentDate(Faker faker)
    {
        var range = faker.Random.Int(0, 3);
        return range switch
        {
            0 => DateTime.UtcNow.AddDays(faker.Random.Int(-90, -1)),  // Past
            1 => DateTime.UtcNow.AddDays(faker.Random.Int(-5, 5)),    // Current
            _ => DateTime.UtcNow.AddDays(faker.Random.Int(1, 90))     // Future
        };
    }

    private static int GetNextDisplayId()
    {
        lock (_lockObject)
        {
            return _appointmentIdCounter++;
        }
    }

    private static int GetNextToken()
    {
        lock (_lockObject)
        {
            return _tokenCounter++;
        }
    }

    public static void ResetCounters()
    {
        lock (_lockObject)
        {
            _appointmentIdCounter = 1001;
            _tokenCounter = 1;
        }
    }
}
