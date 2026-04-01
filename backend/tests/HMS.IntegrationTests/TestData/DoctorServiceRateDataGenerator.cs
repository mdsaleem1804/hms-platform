using Bogus;
using HMS.Domain.Entities;

namespace HMS.IntegrationTests.TestData;

/// <summary>
/// Generates doctor service rates with different prices for different doctors.
/// </summary>
public class DoctorServiceRateDataGenerator
{
    private static readonly string[] _services = new[] 
    { 
        "Consultation", 
        "Lab Test", 
        "X-Ray", 
        "Ultrasound", 
        "ECG",
        "Follow-up Consultation",
        "Procedure",
        "Injection"
    };

    /// <summary>
    /// Generates service rates for a specific doctor.
    /// Consultation rates vary by specialization (senior doctors charge more).
    /// </summary>
    public static List<DoctorServiceRate> GenerateServiceRatesForDoctor(string doctorId, string specialization)
    {
        var faker = new Faker();
        var rates = new List<DoctorServiceRate>();

        // Base consultation rate based on specialization
        var baseConsultationRate = GetConsultationRateBySpecialization(specialization);
        var consultationVariation = faker.Random.Int(-500, 500);

        foreach (var service in _services)
        {
            var rate = new DoctorServiceRate
            {
                Id = Guid.NewGuid().ToString(),
                DoctorId = doctorId,
                ServiceName = service,
                ServiceDescription = $"{service} rate for {specialization} specialist",
                Rate = GetServiceRate(service, baseConsultationRate + consultationVariation),
                IsActive = true,
                EffectiveFrom = DateTime.UtcNow.AddMonths(-3),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            rates.Add(rate);
        }

        return rates;
    }

    /// <summary>
    /// Gets consultation rate based on specialization.
    /// Senior/specialized doctors charge more.
    /// </summary>
    private static decimal GetConsultationRateBySpecialization(string specialization)
    {
        return specialization switch
        {
            "Cardiology" => 800,
            "Orthopedics" => 600,
            "Neurology" => 750,
            "Pediatrics" => 400,
            "Gynecology" => 500,
            "General Surgery" => 700,
            "ENT" => 450,
            "Dermatology" => 500,
            "Psychiatry" => 650,
            "Oncology" => 1000,
            _ => 500
        };
    }

    /// <summary>
    /// Gets relative rate for a service based on consultation rate.
    /// </summary>
    private static decimal GetServiceRate(string service, decimal consultationRate)
    {
        return service switch
        {
            "Consultation" => consultationRate,
            "Lab Test" => consultationRate * 0.5m,
            "X-Ray" => consultationRate * 0.8m,
            "Ultrasound" => consultationRate * 0.9m,
            "ECG" => consultationRate * 0.6m,
            "Follow-up Consultation" => consultationRate * 0.6m,
            "Procedure" => consultationRate * 2.5m,
            "Injection" => consultationRate * 0.3m,
            _ => consultationRate
        };
    }
}
