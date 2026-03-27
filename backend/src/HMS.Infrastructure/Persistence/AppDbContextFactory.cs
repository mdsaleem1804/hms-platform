using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace HMS.Infrastructure.Persistence;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        // TODO: Replace with your actual connection string
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=hms_db;Username=postgres;Password=Hana#2017");
        return new AppDbContext(optionsBuilder.Options);
    }
}
