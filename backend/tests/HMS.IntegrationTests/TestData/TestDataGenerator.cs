using HMS.Domain.Entities;

namespace HMS.IntegrationTests.TestData;

/// <summary>
/// Orchestrates test data generation for comprehensive end-to-end testing.
/// Generates 50+ realistic records covering:
/// - 5-10 doctors with different specializations
/// - 20-30 patients
/// - 50+ appointments with varied types, dates, and statuses
/// - Corresponding billing entries
/// </summary>
public class TestDataGenerator
{
    public class TestDataSet
    {
        public List<Department> Departments { get; set; } = new();
        public List<Doctor> Doctors { get; set; } = new();
        public List<DoctorServiceRate> DoctorServiceRates { get; set; } = new();
        public List<Patient> Patients { get; set; } = new();
        public List<Appointment> Appointments { get; set; } = new();
        public List<Billing> Billings { get; set; } = new();

        public int TotalRecords => 
            Departments.Count + Doctors.Count + Patients.Count + Appointments.Count + Billings.Count;
    }

    private readonly int _doctorCount;
    private readonly int _patientCount;
    private readonly int _appointmentsPerDoctor;

    public TestDataGenerator(int doctorCount = 8, int patientCount = 25, int appointmentsPerDoctor = 7)
    {
        _doctorCount = doctorCount;
        _patientCount = patientCount;
        _appointmentsPerDoctor = appointmentsPerDoctor;
    }

    /// <summary>
    /// Generates complete test dataset with all required entities.
    /// Ensures all relationships are properly established.
    /// </summary>
    public TestDataSet GenerateCompleteTestDataSet()
    {
        var dataset = new TestDataSet();

        Console.WriteLine("🔄 Starting test data generation...");
        Console.WriteLine($"Parameters: Doctors={_doctorCount}, Patients={_patientCount}, Appointments/Doctor={_appointmentsPerDoctor}");
        Console.WriteLine();

        // 1. Generate Departments
        Console.WriteLine("📌 Generating departments...");
        dataset.Departments = DepartmentDataGenerator.GenerateDepartments(10);
        Console.WriteLine($"   ✓ Generated {dataset.Departments.Count} departments");

        // 2. Generate Doctors with specialty distribution
        Console.WriteLine("👨‍⚕️ Generating doctors...");
        var specializationCounts = new Dictionary<string, int>
        {
            { "Cardiology", 1 },
            { "Orthopedics", 1 },
            { "Neurology", 1 },
            { "Pediatrics", 1 },
            { "Gynecology", 1 },
            { "General Surgery", 1 },
            { "ENT", 1 },
            { "Dermatology", 1 }
        };

        var allDoctors = DoctorDataGenerator.GenerateDoctorsWithSpecializations(specializationCounts);
        // Assign doctors to departments
        for (int i = 0; i < allDoctors.Count && i < dataset.Departments.Count; i++)
        {
            allDoctors[i].DepartmentId = dataset.Departments[i].Id;
        }
        dataset.Doctors = allDoctors;
        Console.WriteLine($"   ✓ Generated {dataset.Doctors.Count} doctors across {specializationCounts.Count} specializations");

        // 3. Generate Doctor Service Rates
        Console.WriteLine("💰 Generating doctor service rates...");
        foreach (var doctor in dataset.Doctors)
        {
            var rates = DoctorServiceRateDataGenerator.GenerateServiceRatesForDoctor(doctor.Id, doctor.Specialization);
            dataset.DoctorServiceRates.AddRange(rates);
        }
        Console.WriteLine($"   ✓ Generated {dataset.DoctorServiceRates.Count} service rates");

        // 4. Generate Patients
        Console.WriteLine("🏥 Generating patients...");
        PatientDataGenerator.ResetUhidCounter();
        dataset.Patients = PatientDataGenerator.GeneratePatients(_patientCount);
        Console.WriteLine($"   ✓ Generated {dataset.Patients.Count} patients with unique UHIDs");

        // 5. Generate Appointments
        Console.WriteLine("📅 Generating appointments...");
        AppointmentDataGenerator.ResetCounters();
        var patientIds = dataset.Patients.Select(p => p.Id).ToList();
        var doctorIds = dataset.Doctors.Select(d => d.Id).ToList();
        dataset.Appointments = AppointmentDataGenerator.GenerateAppointments(
            patientIds, 
            doctorIds, 
            _appointmentsPerDoctor);
        Console.WriteLine($"   ✓ Generated {dataset.Appointments.Count} appointments");

        // 6. Generate Billing Records
        Console.WriteLine("💳 Generating billing records...");
        BillingDataGenerator.ResetBillNumberCounter();
        
        var doctorConsultationRates = new Dictionary<string, decimal>();
        foreach (var doctor in dataset.Doctors)
        {
            var rate = DoctorServiceRateDataGenerator.GenerateServiceRatesForDoctor(doctor.Id, doctor.Specialization)
                .FirstOrDefault(r => r.ServiceName == "Consultation")?.Rate ?? 500;
            doctorConsultationRates[doctor.Id] = rate;
        }

        dataset.Billings = BillingDataGenerator.GenerateBillingsForAppointments(
            dataset.Appointments,
            doctorConsultationRates);
        Console.WriteLine($"   ✓ Generated {dataset.Billings.Count} billing records");

        // Summary
        Console.WriteLine();
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine("📊 TEST DATA GENERATION SUMMARY");
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine($"Total Departments:        {dataset.Departments.Count}");
        Console.WriteLine($"Total Doctors:            {dataset.Doctors.Count}");
        Console.WriteLine($"Total Service Rates:      {dataset.DoctorServiceRates.Count}");
        Console.WriteLine($"Total Patients:           {dataset.Patients.Count}");
        Console.WriteLine($"Total Appointments:       {dataset.Appointments.Count}");
        Console.WriteLine($"Total Billing Records:    {dataset.Billings.Count}");
        Console.WriteLine("─────────────────────────────────────────────────────");
        Console.WriteLine($"TOTAL RECORDS GENERATED:  {dataset.TotalRecords}");
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine();

        return dataset;
    }

    /// <summary>
    /// Generates a dataset with specific payment status distribution for testing.
    /// </summary>
    public TestDataSet GenerateTestDataSetWithPaymentStatuses()
    {
        var dataset = GenerateCompleteTestDataSet();

        Console.WriteLine();
        Console.WriteLine("🔄 Regenerating billing with specific payment statuses...");

        var newBillings = new List<Billing>();
        int paidCount = 0, unpaidCount = 0, partialCount = 0;

        foreach (var billing in dataset.Billings)
        {
            var appointment = dataset.Appointments.FirstOrDefault(a => a.Id == billing.AppointmentId);
            if (appointment == null) continue;

            var doctor = dataset.Doctors.FirstOrDefault(d => d.Id == billing.DoctorId);
            if (doctor == null) continue;

            var status = DeterminePaymentStatus(newBillings.Count, dataset.Billings.Count);

            var updatedBilling = BillingDataGenerator.GenerateBillingWithPaymentStatus(
                billing.PatientId,
                billing.DoctorId,
                billing.AppointmentId ?? "",
                billing.VisitType,
                billing.Subtotal,
                status);

            updatedBilling.BillNumber = billing.BillNumber;
            updatedBilling.Date = billing.Date;

            newBillings.Add(updatedBilling);

            if (status == "Paid") paidCount++;
            else if (status == "Unpaid") unpaidCount++;
            else partialCount++;
        }

        dataset.Billings = newBillings;

        Console.WriteLine($"   ✓ Paid:     {paidCount} ({paidCount * 100.0 / newBillings.Count:F1}%)");
        Console.WriteLine($"   ✓ Unpaid:   {unpaidCount} ({unpaidCount * 100.0 / newBillings.Count:F1}%)");
        Console.WriteLine($"   ✓ Partial:  {partialCount} ({partialCount * 100.0 / newBillings.Count:F1}%)");

        return dataset;
    }

    private static string DeterminePaymentStatus(int index, int total)
    {
        var percentage = (double)index / total * 100;
        return percentage switch
        {
            < 60 => "Paid",
            < 80 => "Unpaid",
            _ => "Partial"
        };
    }
}
