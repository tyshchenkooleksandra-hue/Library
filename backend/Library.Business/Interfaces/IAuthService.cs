using Microsoft.AspNetCore.Identity;
using Library.Business.DTOs.Auth;

namespace Library.Business.Interfaces
{
    public interface IAuthService
    {
        Task<IdentityResult> RegisterAsync(RegisterRequest model);
        Task<LoginResponse?> LoginAsync(LoginRequest model);
    }
}