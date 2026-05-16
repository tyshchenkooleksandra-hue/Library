using Library.Business.DTOs.Auth;
using Library.Business.DTOs.Common;
using Library.Business.Interfaces;
using Library.DataAccess.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Library.Business.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IUrlHelperService _urlHelperService;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            IEmailService emailService,
            IUrlHelperService urlHelperService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _emailService = emailService;
            _urlHelperService = urlHelperService;
        }

        public async Task<IdentityResult> RegisterAsync(
            RegisterRequest model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user,model.Password);

            if (!result.Succeeded)
            {
                return result;
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var confirmationLink = _urlHelperService.GenerateEmailConfirmationLink(user.Email!,token);

            await _emailService.SendEmailAsync(
                user.Email!,
                "Confirm your email",
                $"Please confirm your account by clicking " +
                $"<a href='{confirmationLink}'>here</a>."
            );

            return result;
        }

        public async Task<ServiceResponse<LoginResponse>>
            LoginAsync(LoginRequest model)
        {
            var user =
                await _userManager.FindByEmailAsync(
                    model.Email
                );

            if (
                user == null ||
                !await _userManager.CheckPasswordAsync(
                    user,
                    model.Password
                )
            )
            {
                return new ServiceResponse<LoginResponse>
                {
                    Success = false,
                    Message = "Invalid email or password."
                };
            }

            if (!user.EmailConfirmed)
            {
                return new ServiceResponse<LoginResponse>
                {
                    Success = false,
                    Message =
                        "Please confirm your email first."
                };
            }

            var userRoles =
                await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id
                ),

                new Claim(
                    ClaimTypes.Email,
                    user.Email!
                ),

                new Claim(
                    JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString()
                )
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(
                    new Claim(
                        ClaimTypes.Role,
                        userRole
                    )
                );
            }

            var jwtKey = _configuration["Jwt:Key"];

            var authSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey!)
                );

            var token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddHours(2),
                claims: authClaims,
                signingCredentials:
                    new SigningCredentials(
                        authSigningKey,
                        SecurityAlgorithms.HmacSha256
                    )
            );

            return new ServiceResponse<LoginResponse>
            {
                Success = true,

                Message = "Login successful.",

                Data = new LoginResponse
                {
                    AccessToken =
                        new JwtSecurityTokenHandler()
                            .WriteToken(token),

                    Expiration = token.ValidTo
                }
            };
        }

        public async Task<IdentityResult>
            ConfirmEmailAsync(
                string email,
                string token)
        {
            var user =
                await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return IdentityResult.Failed(
                    new IdentityError
                    {
                        Description = "User not found."
                    }
                );
            }

            byte[] tokenDecodedBytes =
                WebEncoders.Base64UrlDecode(token);

            var tokenDecoded =
                Encoding.UTF8.GetString(
                    tokenDecodedBytes
                );

            return await _userManager
                .ConfirmEmailAsync(
                    user,
                    tokenDecoded
                );
        }
    }
}