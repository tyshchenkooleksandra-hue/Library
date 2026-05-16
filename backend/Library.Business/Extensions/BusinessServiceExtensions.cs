using Library.Business.Interfaces;
using Library.Business.Options;
using Library.Business.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Library.Business.Extensions;

public static class BusinessServiceExtensions
{
    public static IServiceCollection AddBusinessServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAuthService, AuthService>();

        services.AddScoped<IUrlHelperService, UrlHelperService>();
        services.AddScoped<IEmailService, EmailService>();

        services.Configure<EmailConfirmationSettings>(configuration.GetSection("EmailConfirmationSettings"));

        services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));
        return services;
    }
}
