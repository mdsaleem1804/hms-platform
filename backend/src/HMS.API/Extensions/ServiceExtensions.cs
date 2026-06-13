using HMS.Application.Features.Patients;
using HMS.Application.Features.Appointments;
using HMS.Application.Features.Billing;
using HMS.Application.Features.Dashboard;
using HMS.Application.Features.Departments;
using HMS.Application.Features.Doctors;
using HMS.Application.Repositories;
using HMS.Application.Services;
using HMS.Domain.Interfaces;
using HMS.Infrastructure.Repositories;
using HMS.Infrastructure.UhidGeneration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

namespace HMS.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Authentication Services
        services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IUserRepository, UserRepository>();

        // Patient Services
        services.AddScoped<IPatientService, PatientService>();
        services.AddScoped<IPatientRepository, PatientRepository>();

        // Appointment Services
        services.AddScoped<IAppointmentService, AppointmentService>();
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();

        // Billing Services
        services.AddScoped<IBillingService, BillingService>();
        services.AddScoped<IBillingRepository, BillingRepository>();

        // Dashboard Metrics Services
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IDashboardMetricsRepository, DashboardMetricsRepository>();
        services.AddScoped<IRevenueRateRepository, RevenueRateRepository>();
        services.AddScoped<IHospitalSettingsRepository, HospitalSettingsRepository>();

        // Department Services
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();

        // Doctor Services
        services.AddScoped<IDoctorService, DoctorService>();
        services.AddScoped<IDoctorRepository, DoctorRepository>();

        // Doctor Service Rates Services
        services.AddScoped<IDoctorServiceRateService, DoctorServiceRateService>();
        services.AddScoped<IDoctorServiceRateRepository, DoctorServiceRateRepository>();

        // JWT Configuration
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"];
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];

        if (string.IsNullOrEmpty(secretKey))
            throw new InvalidOperationException("JWT SecretKey is not configured in appsettings.json");

        var key = Encoding.UTF8.GetBytes(secretKey);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = !string.IsNullOrEmpty(issuer),
                ValidIssuer = issuer,
                ValidateAudience = !string.IsNullOrEmpty(audience),
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    if (context.Exception is SecurityTokenExpiredException)
                    {
                        context.Response.Headers.Append("Token-Expired", "true");
                    }
                    return Task.CompletedTask;
                }
            };
        });

        // UHID Generator - Configuration-based selection
        var uhidOptions = new UhidGeneratorOptions();
        configuration.GetSection("UhidGenerator").Bind(uhidOptions);
        
        RegisterUhidGenerator(services, uhidOptions);
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
