using Bogus;
using HMS.Domain.Entities;

namespace HMS.IntegrationTests.TestData;

/// <summary>
/// Generates realistic patient test data with unique UHIDs and mobile numbers.
/// </summary>
public class PatientDataGenerator
{
    private static readonly string[] _bloodGroups = new[] { "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-" };
    private static readonly string[] _genders = new[] { "Male", "Female", "Other" };
    private static readonly string[] _idProofTypes = new[] { "Aadhar", "PAN", "Passport", "DL", "VoterId" };

    private static int _uhidCounter = 10001;
    private static readonly object _lockObject = new object();

    private static readonly Faker<Patient> _patientFaker = new Faker<Patient>()
        .StrictMode(false)
        .RuleFor(p => p.Id, f => Guid.NewGuid().GetHashCode())
        .RuleFor(p => p.Uhid, f =>
        {
            lock (_lockObject)
            {
                return $"UH-{_uhidCounter++}";
            }
        })
        .RuleFor(p => p.PatientName, f => f.Person.FullName)
        .RuleFor(p => p.Dob, f => f.Person.DateOfBirth.ToUniversalTime())
        .RuleFor(p => p.Gender, f => f.PickRandom(_genders))
        .RuleFor(p => p.BloodGroup, f => f.PickRandom(_bloodGroups))
        .RuleFor(p => p.Mobile, f => f.Person.Phone.Replace("-", "").Substring(0, 10))
        .RuleFor(p => p.Email, f => f.Person.Email)
        .RuleFor(p => p.Address, f => f.Address.FullAddress())
        .RuleFor(p => p.PostalCode, f => f.Address.ZipCode().Substring(0, 10))
        .RuleFor(p => p.Photo, f => (string?)null)
        .RuleFor(p => p.IdProofType, f => f.PickRandom(_idProofTypes))
        .RuleFor(p => p.IdProofNumber, f => f.Random.AlphaNumeric(12).ToUpper())
        .RuleFor(p => p.Status, f => "ACTIVE")
        .RuleFor(p => p.CreatedAt, f => DateTime.UtcNow.AddDays(f.Random.Int(-60, 0)))
        .RuleFor(p => p.UpdatedAt, f => DateTime.UtcNow);

    public static Patient GeneratePatient() => _patientFaker.Generate();

    public static List<Patient> GeneratePatients(int count = 25) => _patientFaker.Generate(count);

    public static void ResetUhidCounter(int startFrom = 10001)
    {
        lock (_lockObject)
        {
            _uhidCounter = startFrom;
        }
    }
}
