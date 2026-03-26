using HMS.Application.Features.Patients;
using HMS.Application.Repositories;
using HMS.Domain.Interfaces;
using HMS.Infrastructure.Repositories;
using HMS.Infrastructure.UhidGeneration;
using Serilog;

namespace HMS.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Patient Services
        services.AddScoped<IPatientService, PatientService>();
        services.AddScoped<IPatientRepository, PatientRepository>();

        // UHID Generator - Configuration-based selection
        var uhidOptions = new UhidGeneratorOptions();
        configuration.GetSection("UhidGenerator").Bind(uhidOptions);
        
        RegisterUhidGenerator(services, uhidOptions);

        // Future: Appointment Services
        // services.AddScoped<IAppointmentService, AppointmentService>();

        return services;
    }

    private static void RegisterUhidGenerator(IServiceCollection services, UhidGeneratorOptions options)
    {
        switch (options.GeneratorType?.ToLower())
        {
            case "sequence":
                services.AddSingleton<IUhidGenerator, SequenceUhidGenerator>();
                break;
            case "timestamp":
            default:
                services.AddSingleton<IUhidGenerator, TimestampUhidGenerator>();
                break;
        }
    }

    public static IServiceCollection AddApiLogging(this IServiceCollection services)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.Console()
            .WriteTo.File("logs/hms-api-.txt", rollingInterval: RollingInterval.Day)
            .CreateLogger();

        services.AddLogging(config =>
        {
            config.ClearProviders();
            config.AddSerilog();
        });

        return services;
    }
}
