using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

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
            
            // Not found exceptions → 404 Not Found
            KeyNotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            
            // Generic exception → 500 Internal Server Error
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred. Please try again later.")
        };
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
