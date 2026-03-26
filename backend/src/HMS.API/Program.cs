using HMS.API.Extensions;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:7000");
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

// CORS Configuration for Frontend Integration
builder.Services.AddCors(options =>
{
    // Policy for frontend development (Next.js on localhost:3000)
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",      // Next.js development
            "http://127.0.0.1:3000",      // Alternative localhost
            "https://localhost:3000"      // HTTPS variant
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();  // Important for cookies/auth headers
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

// Apply CORS policy (must be after UseRouting and before MapControllers)
app.UseCors("AllowFrontend");

app.MapControllers();
app.MapGet("/", () => Results.Ok(new { message = "HMS API is running" }));

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
