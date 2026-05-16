using System.ComponentModel.DataAnnotations;

namespace Library.Api.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    private readonly ILogger<
        ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(
        HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            await HandleValidationExceptionAsync(context, ex);
        }
        catch (Exception ex)
        {
            await HandleInternalExceptionAsync(
                context,
                ex
            );
        }
    }

    private async Task HandleValidationExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.StatusCode =
            StatusCodes.Status400BadRequest;

        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(
            new
            {
                message = exception.Message
            }
        );

        _logger.LogWarning(exception, exception.Message);
    }

    private async Task HandleInternalExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(
            new
            {
                message =
                    "Internal server error."
            }
        );

        _logger.LogError(
            exception,
            exception.Message
        );
    }
}
