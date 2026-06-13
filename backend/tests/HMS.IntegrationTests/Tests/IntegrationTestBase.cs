using Microsoft.EntityFrameworkCore;
using HMS.Infrastructure.Persistence;
using HMS.IntegrationTests.Fixtures;
using HMS.IntegrationTests.TestData;
using Xunit;

namespace HMS.IntegrationTests.Tests;

/// <summary>
/// Base class for integration tests providing common utilities and database access.
/// </summary>
[Collection("Integration Test Collection")]
public abstract class IntegrationTestBase : IDisposable
{
    protected readonly HttpClient Client;
    protected readonly HmsWebApplicationFactory Factory;
    protected readonly TestDataGenerator.TestDataSet TestData;

    protected IntegrationTestBase(Fixtures.IntegrationTestFixture fixture)
    {
        Client = fixture.Client;
        Factory = fixture.GetFactory();
        TestData = fixture.TestData;
    }

    /// <summary>
    /// Gets the database context for assertions.
    /// </summary>
    protected AppDbContext GetDbContext()
    {
        var scope = Factory.Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<AppDbContext>();
    }

    /// <summary>
    /// Counts records in the database.
    /// </summary>
    protected async Task<(int Patients, int Doctors, int Appointments, int Billings)> GetRecordCountsAsync()
    {
        using (var dbContext = GetDbContext())
        {
            var patients = await dbContext.Patients.CountAsync();
            var doctors = await dbContext.Doctors.CountAsync();
            var appointments = await dbContext.Appointments.CountAsync();
            var billings = await dbContext.Billings.CountAsync();

            return (patients, doctors, appointments, billings);
        }
    }

    public virtual void Dispose()
    {
        GC.SuppressFinalize(this);
    }
}
