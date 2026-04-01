using Xunit;
using HMS.IntegrationTests.TestData;

namespace HMS.IntegrationTests.Fixtures;

/// <summary>
/// Test collection fixture for shared test data and factory.
/// Ensures database is initialized only once per test collection.
/// </summary>
public class IntegrationTestFixture : IAsyncLifetime
{
    private readonly HmsWebApplicationFactory _factory;
    public HttpClient Client { get; private set; } = null!;
    public TestDataGenerator.TestDataSet TestData { get; private set; } = null!;

    public IntegrationTestFixture()
    {
        _factory = new HmsWebApplicationFactory();
    }

    public async Task InitializeAsync()
    {
        Console.WriteLine("🔧 Initializing integration test environment...");

        // Initialize database
        await _factory.InitializeDatabaseAsync();
        Console.WriteLine("   ✓ Database initialized");

        // Create and seed test data
        var generator = new TestDataGenerator(
            doctorCount: 8,
            patientCount: 25,
            appointmentsPerDoctor: 7);

        TestData = generator.GenerateTestDataSetWithPaymentStatuses();
        await _factory.SeedDatabaseAsync(TestData);
        Console.WriteLine("   ✓ Test data seeded");

        // Create HTTP client
        Client = _factory.CreateClient();
        Console.WriteLine("   ✓ HTTP client ready");
        Console.WriteLine();
    }

    public async Task DisposeAsync()
    {
        Console.WriteLine();
        Console.WriteLine("🧹 Cleaning up integration test environment...");
        
        await _factory.CleanupDatabaseAsync();
        Client.Dispose();
        _factory.Dispose();
        
        Console.WriteLine("   ✓ Cleanup completed");
        Console.WriteLine();
    }

    public HmsWebApplicationFactory GetFactory() => _factory;
}

/// <summary>
/// Test collection definition for grouping integration tests with shared fixture.
/// </summary>
[CollectionDefinition("Integration Test Collection")]
public class IntegrationTestCollection : ICollectionFixture<IntegrationTestFixture>
{
}
