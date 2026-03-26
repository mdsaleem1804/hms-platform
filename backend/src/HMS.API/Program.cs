using HMS.API.Extensions;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddApplicationServices();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure middleware - ORDER IS CRITICAL
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

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");

app.MapControllers();
app.MapGet("/", () => Results.Ok(new { message = "HMS API is running" }));

// Global exception handling - AFTER endpoint mapping
app.UseGlobalExceptionHandler();

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
