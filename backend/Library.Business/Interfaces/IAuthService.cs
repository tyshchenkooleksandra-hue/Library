using Microsoft.AspNetCore.Identity;
using Library.Business.DTOs.Auth;
using System;
using Library.Business.DTOs.Common;

namespace Library.Business.Interfaces;

public interface IAuthService
{
    Task<IdentityResult> RegisterAsync(RegisterRequest model);

    Task<ServiceResponse<LoginResponse>>LoginAsync(LoginRequest model);

    Task<IdentityResult> ConfirmEmailAsync(string email,string token);
}