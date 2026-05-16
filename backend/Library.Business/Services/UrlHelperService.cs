using Library.Business.Interfaces;
using Library.Business.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using System.Text;

namespace Library.Business.Services;

public class UrlHelperService : IUrlHelperService
{
    private readonly EmailConfirmationSettings _emailconfirmationSettings;

    public UrlHelperService(IHttpContextAccessor httpContextAccessor,
        IOptions<EmailConfirmationSettings> emailconfirmationSettings)
    {
        _emailconfirmationSettings = emailconfirmationSettings.Value;
    }

    public string GenerateEmailConfirmationLink(string email, string token)
    {
        var uriBuilder = new UriBuilder
        {
            Scheme = _emailconfirmationSettings.Scheme,
            Host = _emailconfirmationSettings.Host,
            Path = _emailconfirmationSettings.Path
        };

        if (_emailconfirmationSettings.Port.HasValue)
        {
            uriBuilder.Port = _emailconfirmationSettings.Port.Value;
        }

        byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);

        string codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

        var query = new QueryBuilder
        {
            { "email", email },
            { "token", codeEncoded }
        };

        uriBuilder.Query = query.ToQueryString().Value;

        return uriBuilder.ToString();
    }
}
