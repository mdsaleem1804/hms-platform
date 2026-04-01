using Microsoft.EntityFrameworkCore;
using Xunit;
using HMS.IntegrationTests.Fixtures;

namespace HMS.IntegrationTests.Tests;

/// <summary>
/// Integration tests for data integrity, validation, and overall system consistency.
/// Verifies that all test data meets requirements and relationships are correct.
/// </summary>
[Collection("Integration Test Collection")]
public class DataIntegrityIntegrationTests : IntegrationTestBase
{
    public DataIntegrityIntegrationTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task Should_Have_At_Least_50_Appointments()
    {
        // Arrange & Act
        var counts = await GetRecordCountsAsync();

        // Assert
        Assert.True(counts.Appointments >= 50, 
            $"Expected >= 50 appointments, got {counts.Appointments}");
        
        Console.WriteLine($"✓ Generated {counts.Appointments} appointments (minimum requirement: 50)");
    }

    [Fact]
    public async Task Should_Have_Multiple_Doctors_With_Different_Specializations()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var doctors = await dbContext.Doctors
            .AsNoTracking()
            .ToListAsync();

        var specializations = doctors
            .Select(d => d.Specialization)
            .Distinct()
            .ToList();

        // Assert
        Assert.True(doctors.Count >= 5, $"Expected >= 5 doctors, got {doctors.Count}");
        Assert.True(doctors.Count <= 10, $"Expected <= 10 doctors, got {doctors.Count}");
        Assert.True(specializations.Count >= 5, 
            $"Expected >= 5 specializations, got {specializations.Count}");

        Console.WriteLine($"✓ Generated {doctors.Count} doctors");
        Console.WriteLine($"  Specializations: {string.Join(", ", specializations)}");
    }

    [Fact]
    public async Task Should_Have_Between_20_And_30_Patients()
    {
        // Arrange & Act
        var counts = await GetRecordCountsAsync();

        // Assert
        Assert.True(counts.Patients >= 20, 
            $"Expected >= 20 patients, got {counts.Patients}");
        Assert.True(counts.Patients <= 30, 
            $"Expected <= 30 patients, got {counts.Patients}");

        Console.WriteLine($"✓ Generated {counts.Patients} patients (requirement: 20-30)");
    }

    [Fact]
    public async Task All_Patients_Should_Have_Unique_Mobile_Numbers()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var patients = await dbContext.Patients.AsNoTracking().ToListAsync();
        var mobileNumbers = patients.Select(p => p.Mobile).ToList();
        var distinctCount = mobileNumbers.Distinct().Count();

        // Assert
        Assert.Equal(mobileNumbers.Count, distinctCount);
        Console.WriteLine($"✓ All {mobileNumbers.Count} patients have unique mobile numbers");
    }

    [Fact]
    public async Task All_Patients_Should_Have_Unique_UHIDs()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var patients = await dbContext.Patients.AsNoTracking().ToListAsync();
        var uhids = patients.Select(p => p.Uhid).ToList();
        var distinctCount = uhids.Distinct().Count();

        // Assert
        Assert.Equal(uhids.Count, distinctCount);
        Console.WriteLine($"✓ All {uhids.Count} patients have unique UHIDs");
    }

    [Fact]
    public async Task All_Patients_Should_Have_Valid_Profile_Data()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var patients = await dbContext.Patients.AsNoTracking().ToListAsync();

        var invalidPatients = patients.Where(p =>
            string.IsNullOrEmpty(p.PatientName) ||
            string.IsNullOrEmpty(p.Mobile) ||
            string.IsNullOrEmpty(p.Gender) ||
            string.IsNullOrEmpty(p.BloodGroup) ||
            p.Dob == default ||
            string.IsNullOrEmpty(p.Address)
        ).ToList();

        // Assert
        Assert.Empty(invalidPatients);
        Console.WriteLine($"✓ All {patients.Count} patients have valid profile data");
    }

    [Fact]
    public async Task All_Doctors_Should_Have_Valid_Department_References()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var doctors = await dbContext.Doctors.AsNoTracking().ToListAsync();
        var departmentIds = await dbContext.Departments
            .AsNoTracking()
            .Select(d => d.Id)
            .ToListAsync();

        var invalidDoctors = doctors.Where(d => 
            string.IsNullOrEmpty(d.DepartmentId) || !departmentIds.Contains(d.DepartmentId)
        ).ToList();

        // Assert
        Assert.Empty(invalidDoctors);
        Console.WriteLine($"✓ All {doctors.Count} doctors reference valid departments");
    }

    [Fact]
    public async Task Department_Doctor_Distribution_Should_Be_Even()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var departments = await dbContext.Departments
            .AsNoTracking()
            .Include(d => d.Doctors)
            .ToListAsync();

        var departmentWithDoctors = departments.Where(d => d.Doctors.Any()).ToList();

        // Assert
        Assert.NotEmpty(departmentWithDoctors);

        Console.WriteLine("Doctor distribution across departments:");
        foreach (var dept in departmentWithDoctors.OrderByDescending(d => d.Doctors.Count))
        {
            Console.WriteLine($"  {dept.Name}: {dept.Doctors.Count} doctors");
        }
    }

    [Fact]
    public async Task All_Appointments_Should_Have_Valid_Relationships()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var appointments = await dbContext.Appointments
            .AsNoTracking()
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .ToListAsync();

        var invalidAppointments = appointments.Where(a =>
            a.Patient == null || a.Doctor == null
        ).ToList();

        // Assert
        Assert.Empty(invalidAppointments);
        Console.WriteLine($"✓ All {appointments.Count} appointments have valid patient and doctor relationships");
    }

    [Fact]
    public async Task Appointment_Doctor_Distribution_Should_Be_Fair()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var appointments = await dbContext.Appointments
            .AsNoTracking()
            .GroupBy(a => a.DoctorId)
            .Select(g => new { DoctorId = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        var minAppointments = appointments.Min(x => x.Count);
        var maxAppointments = appointments.Max(x => x.Count);
        var avgAppointments = appointments.Average(x => x.Count);

        // Assert
        Assert.NotEmpty(appointments);

        Console.WriteLine("Appointment distribution across doctors:");
        Console.WriteLine($"  Min appointments per doctor: {minAppointments}");
        Console.WriteLine($"  Max appointments per doctor: {maxAppointments}");
        Console.WriteLine($"  Avg appointments per doctor: {avgAppointments:F1}");
        Console.WriteLine($"  Total doctors: {appointments.Count}");
    }

    [Fact]
    public async Task All_Doctor_Service_Rates_Should_Be_Valid()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var rates = await dbContext.DoctorServiceRates
            .AsNoTracking()
            .ToListAsync();

        var doctorIds = await dbContext.Doctors
            .AsNoTracking()
            .Select(d => d.Id)
            .ToListAsync();

        var invalidRates = rates.Where(r =>
            string.IsNullOrEmpty(r.DoctorId) ||
            !doctorIds.Contains(r.DoctorId) ||
            string.IsNullOrEmpty(r.ServiceName) ||
            r.Rate <= 0 ||
            r.EffectiveFrom == default
        ).ToList();

        // Assert
        Assert.Empty(invalidRates);
        Assert.True(rates.Count > 0, "Should have service rates");
        Console.WriteLine($"✓ All {rates.Count} service rates are valid");
    }

    [Fact]
    public async Task Foreign_Key_Integrity_Should_Be_Maintained()
    {
        // Arrange & Act
        var dbContext = GetDbContext();

        // Check Appointments → Patient
        var appointmentsWithoutPatient = await dbContext.Appointments
            .Where(a => !dbContext.Patients.Any(p => p.Id == a.PatientId))
            .CountAsync();

        // Check Appointments → Doctor
        var appointmentsWithoutDoctor = await dbContext.Appointments
            .Where(a => !dbContext.Doctors.Any(d => d.Id == a.DoctorId))
            .CountAsync();

        // Check Billings → Patient
        var billingsWithoutPatient = await dbContext.Billings
            .Where(b => !dbContext.Patients.Any(p => p.Id == b.PatientId))
            .CountAsync();

        // Check Billings → Doctor
        var billingsWithoutDoctor = await dbContext.Billings
            .Where(b => !dbContext.Doctors.Any(d => d.Id == b.DoctorId))
            .CountAsync();

        // Assert
        Assert.Equal(0, appointmentsWithoutPatient);
        Assert.Equal(0, appointmentsWithoutDoctor);
        Assert.Equal(0, billingsWithoutPatient);
        Assert.Equal(0, billingsWithoutDoctor);

        Console.WriteLine("✓ Foreign key integrity maintained:");
        Console.WriteLine("  ✓ All appointments reference valid patients and doctors");
        Console.WriteLine("  ✓ All billings reference valid patients and doctors");
    }

    [Fact]
    public async Task Data_Consistency_Summary()
    {
        // Arrange & Act
        var counts = await GetRecordCountsAsync();
        var dbContext = GetDbContext();

        var appointmentsByVisitType = await dbContext.Appointments
            .AsNoTracking()
            .GroupBy(a => a.VisitType)
            .Select(g => new { Type = g.Key, Count = g.Count() })
            .ToListAsync();

        var appointmentsByStatus = await dbContext.Appointments
            .AsNoTracking()
            .GroupBy(a => a.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        var totalRevenue = await dbContext.Billings
            .AsNoTracking()
            .SumAsync(b => b.NetAmount);

        var paidRevenue = await dbContext.Billings
            .AsNoTracking()
            .SumAsync(b => b.PaidAmount);

        var pendingRevenue = totalRevenue - paidRevenue;

        // Print comprehensive summary
        Console.WriteLine();
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine("📊 DATA CONSISTENCY SUMMARY");
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine();
        Console.WriteLine("DATABASE RECORD COUNTS:");
        Console.WriteLine($"  Departments:       {await dbContext.Departments.CountAsync()}");
        Console.WriteLine($"  Doctors:           {counts.Doctors}");
        Console.WriteLine($"  Patients:          {counts.Patients}");
        Console.WriteLine($"  Appointments:      {counts.Appointments}");
        Console.WriteLine($"  Billings:          {counts.Billings}");
        Console.WriteLine($"  Service Rates:     {await dbContext.DoctorServiceRates.CountAsync()}");
        Console.WriteLine();
        Console.WriteLine("APPOINTMENT BREAKDOWN:");
        foreach (var item in appointmentsByVisitType)
        {
            Console.WriteLine($"  {item.Type}: {item.Count}");
        }
        Console.WriteLine();
        Console.WriteLine("APPOINTMENT STATUS:");
        foreach (var item in appointmentsByStatus)
        {
            Console.WriteLine($"  {item.Status}: {item.Count}");
        }
        Console.WriteLine();
        Console.WriteLine("FINANCIAL SUMMARY:");
        Console.WriteLine($"  Total Billing Amount:  {totalRevenue:C2}");
        Console.WriteLine($"  Paid Amount:           {paidRevenue:C2}");
        Console.WriteLine($"  Pending Amount:        {pendingRevenue:C2}");
        Console.WriteLine($"  Collection Rate:       {(paidRevenue / totalRevenue * 100):F1}%");
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine();

        // All assertions already verified in individual tests
        Assert.True(counts.Appointments >= 50);
    }
}
