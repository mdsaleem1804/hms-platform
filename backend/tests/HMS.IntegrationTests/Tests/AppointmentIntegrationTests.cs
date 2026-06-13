using Microsoft.EntityFrameworkCore;
using Xunit;
using HMS.IntegrationTests.Fixtures;
using HMS.IntegrationTests.TestData;
using HMS.Domain.Entities;

namespace HMS.IntegrationTests.Tests;

/// <summary>
/// Integration tests for appointment creation, validation, and lifecycle.
/// Tests the full flow: Patient → Doctor → Appointment → Billing
/// </summary>
[Collection("Integration Test Collection")]
public class AppointmentIntegrationTests : IntegrationTestBase
{
    public AppointmentIntegrationTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task CreateAppointment_Should_Successfully_Create_With_Valid_Data()
    {
        // Arrange
        var patient = TestData.Patients.First();
        var doctor = TestData.Doctors.First();

        var appointmentData = new
        {
            patientId = patient.Id,
            doctorId = doctor.Id,
            departmentId = doctor.DepartmentId,
            appointmentDate = DateTime.UtcNow.AddDays(5),
            startTime = "10:00",
            endTime = "11:00",
            visitType = "OPD",
            status = "Scheduled",
            priority = "Normal",
            notes = "Regular checkup"
        };

        // Note: This assumes endpoint exists. Adjust path as needed.
        var content = new StringContent(
            System.Text.Json.JsonSerializer.Serialize(appointmentData),
            System.Text.Encoding.UTF8,
            "application/json");

        // Act
        var response = await Client.PostAsync("/api/appointments", content);

        // Assert
        Assert.True(response.IsSuccessStatusCode, $"Expected successful response, got {response.StatusCode}");
        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task GetAppointments_Should_Return_50_Plus_Records()
    {
        // Act
        var response = await Client.GetAsync("/api/appointments?pageSize=100");

        // Assert
        Assert.True(response.IsSuccessStatusCode);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = System.Text.Json.JsonDocument.Parse(content);
        var root = jsonDoc.RootElement;

        // Check if data exists (adjust path based on actual API response structure)
        Assert.True(root.TryGetProperty("data", out var data), "Response should contain 'data' property");

        // Use GetRecordCountsAsync to verify database state
        var counts = await GetRecordCountsAsync();
        Assert.True(counts.Appointments >= 50, $"Expected >= 50 appointments, got {counts.Appointments}");
    }

    [Fact]
    public async Task Appointments_Should_Have_Varied_Dates()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var appointments = await dbContext.Appointments
            .AsNoTracking()
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();

        // Assert
        Assert.NotEmpty(appointments);

        var now = DateTime.UtcNow;
        var pastAppointments = appointments.Where(a => a.AppointmentDate < now).ToList();
        var currentAppointments = appointments.Where(a => 
            a.AppointmentDate >= now.AddDays(-5) && a.AppointmentDate <= now.AddDays(5)).ToList();
        var futureAppointments = appointments.Where(a => a.AppointmentDate > now).ToList();

        Assert.True(pastAppointments.Any(), "Should have past appointments");
        Assert.True(currentAppointments.Any(), "Should have current appointments");
        Assert.True(futureAppointments.Any(), "Should have future appointments");

        Console.WriteLine($"Appointment date distribution:");
        Console.WriteLine($"  Past:     {pastAppointments.Count}");
        Console.WriteLine($"  Current:  {currentAppointments.Count}");
        Console.WriteLine($"  Future:   {futureAppointments.Count}");
    }

    [Fact]
    public async Task Appointments_Should_Have_Different_Visit_Types()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var visitTypes = await dbContext.Appointments
            .AsNoTracking()
            .Select(a => a.VisitType)
            .Distinct()
            .ToListAsync();

        // Assert
        var expectedTypes = new[] { "OPD", "Emergency", "Follow-up", "Teleconsultation" };
        Assert.NotEmpty(visitTypes);

        foreach (var type in visitTypes)
        {
            Assert.Contains(type, expectedTypes);
        }

        Console.WriteLine($"Appointment visit types found: {string.Join(", ", visitTypes)}");
    }

    [Fact]
    public async Task Appointments_Should_Have_Different_Statuses()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var statuses = await dbContext.Appointments
            .AsNoTracking()
            .Select(a => a.Status)
            .Distinct()
            .ToListAsync();

        // Assert
        Assert.NotEmpty(statuses);
        var expectedStatuses = new[] { "Scheduled", "Completed", "Cancelled", "No-Show" };
        
        foreach (var status in statuses)
        {
            Assert.Contains(status, expectedStatuses);
        }

        var statusCounts = new Dictionary<string, int>();
        foreach (var status in statuses)
        {
            var count = await dbContext.Appointments.CountAsync(a => a.Status == status);
            statusCounts[status] = count;
        }

        Console.WriteLine($"Appointment status distribution:");
        foreach (var kvp in statusCounts.OrderByDescending(x => x.Value))
        {
            Console.WriteLine($"  {kvp.Key}: {kvp.Value}");
        }
    }

    [Fact]
    public async Task Appointments_Should_Have_Valid_Doctor_References()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var appointments = await dbContext.Appointments
            .AsNoTracking()
            .ToListAsync();
        var doctorIds = await dbContext.Doctors
            .AsNoTracking()
            .Select(d => d.Id)
            .ToListAsync();

        // Assert
        Assert.NotEmpty(appointments);
        foreach (var appointment in appointments)
        {
            Assert.Contains(appointment.DoctorId, doctorIds);
        }

        Console.WriteLine($"✓ All {appointments.Count} appointments reference valid doctors");
    }

    [Fact]
    public async Task Appointments_Should_Have_Valid_Patient_References()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var appointments = await dbContext.Appointments
            .AsNoTracking()
            .ToListAsync();
        var patientIds = await dbContext.Patients
            .AsNoTracking()
            .Select(p => p.Id)
            .ToListAsync();

        // Assert
        Assert.NotEmpty(appointments);
        foreach (var appointment in appointments)
        {
            Assert.Contains(appointment.PatientId, patientIds);
        }

        Console.WriteLine($"✓ All {appointments.Count} appointments reference valid patients");
    }

    [Fact]
    public async Task Appointments_Should_Have_Unique_Appointment_Numbers()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var appointmentNumbers = await dbContext.Appointments
            .AsNoTracking()
            .Select(a => a.AppointmentNo)
            .ToListAsync();

        var distinctCount = appointmentNumbers.Distinct().Count();

        // Assert
        Assert.Equal(appointmentNumbers.Count, distinctCount);
        Console.WriteLine($"✓ All {appointmentNumbers.Count} appointments have unique appointment numbers");
    }

    [Fact]
    public async Task Appointments_Should_Have_Valid_Time_Slots()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var appointments = await dbContext.Appointments
            .AsNoTracking()
            .ToListAsync();

        var invalidAppointments = appointments.Where(a => a.EndTime <= a.StartTime).ToList();

        // Assert
        Assert.Empty(invalidAppointments);
        Console.WriteLine($"✓ All {appointments.Count} appointments have valid time slots (EndTime > StartTime)");
    }
}
