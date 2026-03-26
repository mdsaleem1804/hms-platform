using HMS.Application.Features.Patients;
using HMS.Application.Repositories;
using HMS.Infrastructure.Repositories;
using Serilog;

namespace HMS.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Patient Services
        services.AddScoped<IPatientService, PatientService>();
        services.AddScoped<IPatientRepository, PatientRepository>();

        // Future: Appointment Services
        // services.AddScoped<IAppointmentService, AppointmentService>();

        return services;
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
