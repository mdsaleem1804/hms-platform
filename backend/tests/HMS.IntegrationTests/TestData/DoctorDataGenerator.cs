using Bogus;
using HMS.Domain.Entities;

namespace HMS.IntegrationTests.TestData;

/// <summary>
/// Generates realistic doctor test data with different specializations and consultation fees.
/// </summary>
public class DoctorDataGenerator
{
    private static readonly string[] _specializations = new[]
    {
        "Cardiology", "Orthopedics", "Neurology", "Pediatrics", "Gynecology",
        "General Surgery", "ENT", "Dermatology", "Psychiatry", "Oncology"
    };

    private static readonly Faker<Doctor> _doctorFaker = new Faker<Doctor>()
        .StrictMode(false)
        .RuleFor(d => d.Id, f => Guid.NewGuid().ToString())
        .RuleFor(d => d.Name, f => f.Person.FullName)
        .RuleFor(d => d.Specialization, f => f.PickRandom(_specializations))
        .RuleFor(d => d.Mobile, f => f.Person.Phone.Replace("-", "").Substring(0, 10))
        .RuleFor(d => d.DepartmentId, f => Guid.NewGuid().ToString())
        .RuleFor(d => d.CreatedBy, f => "system")
        .RuleFor(d => d.UpdatedBy, f => "system")
        .RuleFor(d => d.CreatedAt, f => DateTime.UtcNow.AddDays(f.Random.Int(-60, 0)))
        .RuleFor(d => d.UpdatedAt, f => DateTime.UtcNow)
        .RuleFor(d => d.IsDeleted, f => false);

    public static Doctor GenerateDoctor(string? departmentId = null, string? specialization = null)
    {
        var doctor = _doctorFaker.Generate();
        if (!string.IsNullOrEmpty(departmentId))
            doctor.DepartmentId = departmentId;
        if (!string.IsNullOrEmpty(specialization))
            doctor.Specialization = specialization;
        return doctor;
    }

    public static List<Doctor> GenerateDoctors(int count = 8, string? departmentId = null)
    {
        var doctors = new List<Doctor>();
        for (int i = 0; i < count; i++)
        {
            var doctor = GenerateDoctor(departmentId);
            doctors.Add(doctor);
        }
        return doctors;
    }

    public static List<Doctor> GenerateDoctorsWithSpecializations(Dictionary<string, int> specializationCounts)
    {
        var doctors = new List<Doctor>();
        foreach (var spec in specializationCounts)
        {
            for (int i = 0; i < spec.Value; i++)
            {
                doctors.Add(GenerateDoctor(specialization: spec.Key));
            }
        }
        return doctors;
    }
}
