using Bogus;
using HMS.Domain.Entities;

namespace HMS.IntegrationTests.TestData;

/// <summary>
/// Generates realistic test data for departments using Bogus library.
/// </summary>
public class DepartmentDataGenerator
{
    private static readonly Faker<Department> _departmentFaker = new Faker<Department>()
        .StrictMode(false)
        .RuleFor(d => d.Id, f => Guid.NewGuid().ToString())
        .RuleFor(d => d.Name, f => f.PickRandom(GetSpecializations()))
        .RuleFor(d => d.Description, f => f.Commerce.ProductDescription())
        .RuleFor(d => d.CreatedBy, f => "system")
        .RuleFor(d => d.UpdatedBy, f => "system")
        .RuleFor(d => d.CreatedAt, f => DateTime.UtcNow.AddDays(f.Random.Int(-30, 0)))
        .RuleFor(d => d.UpdatedAt, f => DateTime.UtcNow);

    private static List<string> GetSpecializations() => new()
    {
        "Cardiology",
        "Orthopedics",
        "Neurology",
        "Pediatrics",
        "Gynecology",
        "General Surgery",
        "ENT",
        "Dermatology",
        "Psychiatry",
        "Oncology"
    };

    public static Department GenerateDepartment() => _departmentFaker.Generate();

    public static List<Department> GenerateDepartments(int count = 10) => _departmentFaker.Generate(count);
}
