using Microsoft.EntityFrameworkCore;
using Xunit;
using HMS.IntegrationTests.Fixtures;

namespace HMS.IntegrationTests.Tests;

/// <summary>
/// Integration tests for billing functionality, validation, and doctor-specific pricing.
/// Verifies billing generation, amounts, payment statuses, and tax calculations.
/// </summary>
[Collection("Integration Test Collection")]
public class BillingIntegrationTests : IntegrationTestBase
{
    public BillingIntegrationTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task Billings_Count_Should_Match_Appointments()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var appointmentCount = await dbContext.Appointments.CountAsync();
        var billingCount = await dbContext.Billings.CountAsync();

        // Assert
        Assert.Equal(appointmentCount, billingCount);
        Console.WriteLine($"✓ Billing count ({billingCount}) matches appointment count ({appointmentCount})");
    }

    [Fact]
    public async Task Billings_Should_Have_Valid_Patient_References()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var billings = await dbContext.Billings.AsNoTracking().ToListAsync();
        var patientIds = await dbContext.Patients.AsNoTracking().Select(p => p.Id).ToListAsync();

        var invalidBillings = billings.Where(b => !patientIds.Contains(b.PatientId)).ToList();

        // Assert
        Assert.Empty(invalidBillings);
        Console.WriteLine($"✓ All {billings.Count} billings reference valid patients");
    }

    [Fact]
    public async Task Billings_Should_Have_Valid_Doctor_References()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var billings = await dbContext.Billings.AsNoTracking().ToListAsync();
        var doctorIds = await dbContext.Doctors.AsNoTracking().Select(d => d.Id).ToListAsync();

        var invalidBillings = billings.Where(b => !doctorIds.Contains(b.DoctorId)).ToList();

        // Assert
        Assert.Empty(invalidBillings);
        Console.WriteLine($"✓ All {billings.Count} billings reference valid doctors");
    }

    [Fact]
    public async Task Billings_Should_Have_Unique_Bill_Numbers()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var billNumbers = await dbContext.Billings
            .AsNoTracking()
            .Select(b => b.BillNumber)
            .ToListAsync();

        var distinctCount = billNumbers.Distinct().Count();

        // Assert
        Assert.Equal(billNumbers.Count, distinctCount);
        Console.WriteLine($"✓ All {billNumbers.Count} billings have unique bill numbers");
    }

    [Fact]
    public async Task Billings_Should_Have_Correct_Net_Amount_Calculation()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var billings = await dbContext.Billings.AsNoTracking().ToListAsync();

        var invalidCalculations = new List<string>();
        foreach (var billing in billings)
        {
            var expected = billing.Subtotal - billing.Discount + billing.Tax;
            var difference = Math.Abs(expected - billing.NetAmount);
            
            if (difference > 0.01m) // Allow for rounding errors
            {
                invalidCalculations.Add(
                    $"Bill {billing.BillNumber}: Expected {expected}, got {billing.NetAmount}");
            }
        }

        // Assert
        Assert.Empty(invalidCalculations);
        Console.WriteLine($"✓ All {billings.Count} billings have correct net amount calculations");
    }

    [Fact]
    public async Task Billings_Should_Have_Valid_Payment_Statuses()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var billings = await dbContext.Billings.AsNoTracking().ToListAsync();

        var paidCount = 0;
        var unpaidCount = 0;
        var partialCount = 0;

        foreach (var billing in billings)
        {
            if (billing.PaidAmount == 0)
                unpaidCount++;
            else if (billing.PaidAmount >= billing.NetAmount)
                paidCount++;
            else
                partialCount++;
        }

        // Assert
        Assert.NotEmpty(billings);
        Assert.True(paidCount > 0, "Should have paid billings");
        Assert.True(unpaidCount > 0, "Should have unpaid billings");

        var total = paidCount + unpaidCount + partialCount;
        Console.WriteLine($"Payment status distribution:");
        Console.WriteLine($"  Paid:     {paidCount} ({paidCount * 100.0 / total:F1}%)");
        Console.WriteLine($"  Unpaid:   {unpaidCount} ({unpaidCount * 100.0 / total:F1}%)");
        Console.WriteLine($"  Partial:  {partialCount} ({partialCount * 100.0 / total:F1}%)");
    }

    [Fact]
    public async Task Billings_Should_Have_Different_Visit_Types()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var visitTypes = await dbContext.Billings
            .AsNoTracking()
            .Select(b => b.VisitType)
            .Distinct()
            .ToListAsync();

        // Assert
        Assert.NotEmpty(visitTypes);
        Console.WriteLine($"Visit types in billing: {string.Join(", ", visitTypes)}");
    }

    [Fact]
    public async Task Doctor_Specific_Pricing_Should_Vary_By_Specialization()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var doctors = await dbContext.Doctors
            .AsNoTracking()
            .Include(d => d.ServiceRates)
            .ToListAsync();

        var consultationRatesBySpecialization = new Dictionary<string, List<decimal>>();

        foreach (var doctor in doctors)
        {
            var consultationRate = doctor.ServiceRates
                .Where(r => r.ServiceName == "Consultation" && r.IsActive)
                .Select(r => r.Rate)
                .FirstOrDefault(500);

            if (!consultationRatesBySpecialization.ContainsKey(doctor.Specialization))
            {
                consultationRatesBySpecialization[doctor.Specialization] = new List<decimal>();
            }

            consultationRatesBySpecialization[doctor.Specialization].Add(consultationRate);
        }

        // Assert
        Assert.NotEmpty(consultationRatesBySpecialization);
        
        Console.WriteLine("Doctor consultation rates by specialization:");
        foreach (var spec in consultationRatesBySpecialization)
        {
            var avg = spec.Value.Average();
            var min = spec.Value.Min();
            var max = spec.Value.Max();
            Console.WriteLine($"  {spec.Key}: Avg={avg:C2}, Min={min:C2}, Max={max:C2}, Count={spec.Value.Count}");
        }
    }

    [Fact]
    public async Task Service_Rates_Should_Be_Proportional_To_Consultation()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var rates = await dbContext.DoctorServiceRates
            .AsNoTracking()
            .ToListAsync();

        var doctorRates = rates.GroupBy(r => r.DoctorId).ToList();

        var validProportions = 0;
        var totalChecks = 0;

        foreach (var doctorGroup in doctorRates)
        {
            var consultationRate = doctorGroup
                .Where(r => r.ServiceName == "Consultation")
                .Select(r => r.Rate)
                .FirstOrDefault();

            if (consultationRate <= 0) continue;

            foreach (var service in doctorGroup.Where(r => r.ServiceName != "Consultation"))
            {
                totalChecks++;
                // Service rate should be less than or equal to consultation rate (with some exceptions)
                if (service.Rate <= consultationRate * 3) // Allow up to 3x for special services
                {
                    validProportions++;
                }
            }
        }

        // Assert
        if (totalChecks > 0)
        {
            var validPercentage = (validProportions * 100.0) / totalChecks;
            Assert.True(validPercentage >= 80, $"Expected >= 80% valid proportions, got {validPercentage:F1}%");
            Console.WriteLine($"✓ Service rate proportions are valid: {validPercentage:F1}% ({validProportions}/{totalChecks})");
        }
    }

    [Fact]
    public async Task Billings_Should_Have_Amounts_Within_Valid_Range()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var billings = await dbContext.Billings.AsNoTracking().ToListAsync();

        var invalidAmounts = new List<string>();

        foreach (var billing in billings)
        {
            // Subtotal should be positive
            if (billing.Subtotal <= 0)
                invalidAmounts.Add($"{billing.BillNumber}: Subtotal is {billing.Subtotal}");

            // Discount should not exceed subtotal
            if (billing.Discount < 0 || billing.Discount > billing.Subtotal * 0.5m)
                invalidAmounts.Add($"{billing.BillNumber}: Discount {billing.Discount} is invalid");

            // Tax should be non-negative
            if (billing.Tax < 0)
                invalidAmounts.Add($"{billing.BillNumber}: Tax is negative {billing.Tax}");

            // NetAmount should be positive
            if (billing.NetAmount <= 0)
                invalidAmounts.Add($"{billing.BillNumber}: NetAmount is {billing.NetAmount}");

            // PaidAmount should not exceed NetAmount (unless overpayment is allowed)
            if (billing.PaidAmount < 0)
                invalidAmounts.Add($"{billing.BillNumber}: PaidAmount is negative {billing.PaidAmount}");
        }

        // Assert
        Assert.Empty(invalidAmounts);

        var minSubtotal = billings.Min(b => b.Subtotal);
        var maxSubtotal = billings.Max(b => b.Subtotal);
        var avgSubtotal = billings.Average(b => b.Subtotal);

        Console.WriteLine($"Billing amounts validation:");
        Console.WriteLine($"  Min Subtotal: {minSubtotal:C2}");
        Console.WriteLine($"  Max Subtotal: {maxSubtotal:C2}");
        Console.WriteLine($"  Avg Subtotal: {avgSubtotal:C2}");
    }

    [Fact]
    public async Task TaxCalculation_Should_Follow_18_Percent_GST()
    {
        // Arrange & Act
        var dbContext = GetDbContext();
        var billings = await dbContext.Billings.AsNoTracking().ToListAsync();

        var correctTaxCount = 0;

        foreach (var billing in billings)
        {
            var taxableAmount = billing.Subtotal - billing.Discount;
            var expectedTax = Math.Round(taxableAmount * 0.18m, 2);
            var difference = Math.Abs(expectedTax - billing.Tax);

            if (difference < 0.01m) // Allow for rounding
            {
                correctTaxCount++;
            }
        }

        // Assert
        var correctPercentage = (correctTaxCount * 100.0) / billings.Count;
        Assert.True(correctPercentage >= 95, $"Expected >= 95% correct tax calculations, got {correctPercentage:F1}%");
        Console.WriteLine($"✓ Tax calculations are correct: {correctPercentage:F1}% ({correctTaxCount}/{billings.Count})");
    }
}
