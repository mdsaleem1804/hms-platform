using HMS.API.Extensions;
using HMS.Application.Services;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://0.0.0.0:7000");
// Configure services
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "HMS API",
        Version = "v1",
        Description = "Hospital Management System - API Documentation"
    });
});

// DbContext Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

builder.Services.AddApiLogging();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
// CORS Configuration for Frontend Integration
builder.Services.AddCors(options =>
{
    // Update CORS policy to allow specific origins
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://frontend:3000",
            "http://153.75.224.163:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
    
    // Fallback policy for other environments (if needed)
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure middleware - ORDER IS CRITICAL
// Exception handler must be EARLY in the pipeline
app.UseGlobalExceptionHandler();

// Swagger middleware must be registered FIRST before routing
app.UseSwagger(options =>
{
    options.RouteTemplate = "swagger/{documentName}/swagger.json";
});

// Register Swagger UI (works in all environments for development convenience)
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "HMS API V1");
    options.RoutePrefix = "swagger";
    options.DefaultModelsExpandDepth(0);
});

//app.UseHttpsRedirection();
app.UseRouting();

// Authentication & Authorization middleware (must be after routing and before MapControllers)
app.UseAuthentication();
app.UseAuthorization();

// Apply CORS policy (must be after UseRouting and before MapControllers)
app.UseCors("AllowFrontend");

app.MapControllers();
app.MapGet("/", () => Results.Ok(new { message = "HMS API is running" }));

// Database initialization
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        // Apply migrations
        try
        {
            logger.LogInformation("Applying database migrations...");
            dbContext.Database.Migrate();
            logger.LogInformation("Database migrations applied successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error applying database migrations");
        }

        // Seed default users
        try
        {
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
            logger.LogInformation("Seeding default users...");
            await UserSeeder.SeedDefaultUsersAsync(dbContext, passwordHasher);
            logger.LogInformation("Default users seeded successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error seeding default users");
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Error during database initialization: {ex}");
}

try
{
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Application terminated unexpectedly: {ex}");
}
finally
{
    Log.CloseAndFlush();
}
