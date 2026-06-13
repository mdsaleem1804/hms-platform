using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using HMS.Infrastructure.Persistence;
using HMS.IntegrationTests.TestData;
using Serilog;

namespace HMS.IntegrationTests.Fixtures;

/// <summary>
/// Custom WebApplicationFactory for HMS API integration tests.
/// Configures in-memory database and test settings.
/// </summary>
public class HmsWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName;

    public HmsWebApplicationFactory(string? databaseName = null)
    {
        _databaseName = databaseName ?? $"hms_test_{Guid.NewGuid():N}";
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the default DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Add in-memory database for testing
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql($"Host=localhost;Database={_databaseName};Username=postgres;Password=Hana#2017;");
            });

            // Configure Serilog for test output
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File("logs/test-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();
        });

        builder.UseEnvironment("Test");
        builder.ConfigureAppConfiguration((context, config) =>
        {
            // Test configuration if needed
        });
    }

    /// <summary>
    /// Initializes the database and applies migrations.
    /// </summary>
    public async Task InitializeDatabaseAsync()
    {
        using (var scope = Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            
            // Create database and apply migrations
            await dbContext.Database.EnsureDeletedAsync();
            await dbContext.Database.EnsureCreatedAsync();
        }
    }

    /// <summary>
    /// Seeds the database with test data.
    /// </summary>
    public async Task SeedDatabaseAsync(TestDataGenerator.TestDataSet dataSet)
    {
        using (var scope = Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Add all test data
            dbContext.Departments.AddRange(dataSet.Departments);
            dbContext.Doctors.AddRange(dataSet.Doctors);
            dbContext.DoctorServiceRates.AddRange(dataSet.DoctorServiceRates);
            dbContext.Patients.AddRange(dataSet.Patients);
            dbContext.Appointments.AddRange(dataSet.Appointments);
            dbContext.Billings.AddRange(dataSet.Billings);

            await dbContext.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Cleans up the test database.
    /// </summary>
    public async Task CleanupDatabaseAsync()
    {
        using (var scope = Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await dbContext.Database.EnsureDeletedAsync();
        }
    }
}
