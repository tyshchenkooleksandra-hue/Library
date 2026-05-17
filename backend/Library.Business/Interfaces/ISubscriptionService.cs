using Library.Business.DTOs.Common;
using Library.Business.DTOs.Subscription;
using System;

namespace Library.Business.Interfaces;

public interface ISubscriptionService
{
    Task<ServiceResponse<string>>CreateCheckoutSessionAsync(string userId,int planId);

    Task<ServiceResponse<string>>ActivateSubscriptionAsync(string userId,int planId);

    Task<ServiceResponse<CurrentSubscriptionDto>> GetCurrentSubscriptionAsync(string userId);

    Task<ServiceResponse<List<SubscriptionPlanDto>>>GetSubscriptionPlansAsync();
}
