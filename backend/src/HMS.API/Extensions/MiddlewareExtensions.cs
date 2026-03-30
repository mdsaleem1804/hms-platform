using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace HMS.API.Extensions;

/// <summary>
/// Global exception middleware for centralized exception handling
/// Maps specific exceptions to appropriate HTTP status codes and consistent JSON responses
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {ExceptionType} - {ExceptionMessage}", ex.GetType().Name, ex.Message);
            await HandleExceptionAsync(context, ex, _environment.IsDevelopment());
        }
    }

    /// <summary>
    /// Handles exceptions by mapping them to appropriate HTTP status codes and error messages
    /// </summary>
    private static Task HandleExceptionAsync(HttpContext context, Exception exception, bool isDevelopment)
    {
        context.Response.ContentType = "application/json";

        // Map exception types to HTTP status codes
        var (statusCode, message) = MapExceptionToResponse(exception);
        context.Response.StatusCode = statusCode;

        var response = new
        {
            success = false,
            data = (object?)null,
            message = message,
            // Only include details in development environment
            details = isDevelopment ? exception.Message : null as string
        };

        var options = new JsonSerializerOptions 
        { 
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull 
        };
        return context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }

    /// <summary>
    /// Maps exception types to HTTP status codes and user-friendly messages
    /// </summary>
    private static (int StatusCode, string Message) MapExceptionToResponse(Exception exception)
    {
        return exception switch
        {
            // Validation exceptions → 400 Bad Request
            ArgumentException or ArgumentNullException => (StatusCodes.Status400BadRequest, exception.Message),
            InvalidOperationException => (StatusCodes.Status400BadRequest, exception.Message),
            
            // Database exceptions → 400 Bad Request with detailed info
            DbUpdateException dbEx => GetDbUpdateExceptionDetails(dbEx),
            
            // Not found exceptions → 404 Not Found
            KeyNotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            
            // Generic exception → 500 Internal Server Error
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred. Please try again later.")
        };
    }

    /// <summary>
    /// Extracts detailed information from DbUpdateException for better error reporting
    /// </summary>
    private static (int StatusCode, string Message) GetDbUpdateExceptionDetails(DbUpdateException dbEx)
    {
        var message = "Database update failed. ";
        
        if (dbEx.InnerException is not null)
        {
            message += dbEx.InnerException.Message;
        }
        else
        {
            message += dbEx.Message;
        }

        // Check for specific constraint violation patterns
        if (message.Contains("UNIQUE constraint failed", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("duplicate key", StringComparison.OrdinalIgnoreCase))
        {
            return (StatusCodes.Status400BadRequest, "A record with these values already exists.");
        }

        if (message.Contains("FOREIGN KEY constraint failed", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("foreign key", StringComparison.OrdinalIgnoreCase))
        {
            return (StatusCodes.Status400BadRequest, "Cannot save record due to related data constraints.");
        }

        if (message.Contains("NOT NULL constraint failed", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("null", StringComparison.OrdinalIgnoreCase))
        {
            return (StatusCodes.Status400BadRequest, "Required field is missing.");
        }

        return (StatusCodes.Status400BadRequest, message);
    }
}

public static class MiddlewareExtensions
{
    /// <summary>
    /// Registers global exception handling middleware
    /// </summary>
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionMiddleware>();
    }
}
