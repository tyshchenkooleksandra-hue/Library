using Library.Business.DTOs.Common;
using Library.Business.DTOs.Subscription;
using Library.Business.Interfaces;
using Library.DataAccess.Context;
using Library.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace Library.Business.Services;
public class SubscriptionService
: ISubscriptionService
{
    private readonly ApplicationDbContext
    _context;
    private readonly IConfiguration
    _configuration;
    public SubscriptionService(
    ApplicationDbContext context,
        IConfiguration configuration)
    {
        _context = context;

        _configuration = configuration;

        StripeConfiguration.ApiKey =
            _configuration["Stripe:SecretKey"];
    }

    public async Task<
        ServiceResponse<string>>
        CreateCheckoutSessionAsync(
            string userId,
            int planId)
    {
        var plan =
            await _context.SubscriptionPlans
                .FirstOrDefaultAsync(
                    x => x.Id == planId
                );

        if (plan == null)
        {
            return new ServiceResponse<string>
            {
                Success = false,

                Message =
                    "Subscription plan not found."
            };
        }

        var domain =
            _configuration["Frontend:BaseUrl"];

        var options =
            new SessionCreateOptions
            {
                PaymentMethodTypes =
                    new List<string>
                    {
                        "card"
                    },

                Mode = "payment",

                BillingAddressCollection =
                    "auto",

                SuccessUrl =
                    $"{domain}/subscription-success" +
                    $"?session_id={{CHECKOUT_SESSION_ID}}",

                CancelUrl =
                    $"{domain}/subscription",

                LineItems =
                    new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            Quantity = 1,

                            PriceData =
                                new SessionLineItemPriceDataOptions
                                {
                                    Currency = "usd",

                                    UnitAmount =
                                        (long)(plan.Price * 100),

                                    ProductData =
                                        new SessionLineItemPriceDataProductDataOptions
                                        {
                                            Name =
                                                $"{plan.Name} Subscription"
                                        }
                                }
                        }
                    },

                Metadata =
                    new Dictionary<string, string>
                    {
                        {
                            "userId",
                            userId
                        },

                        {
                            "planId",
                            plan.Id.ToString()
                        }
                    }
            };

        var service =
            new SessionService();

        var session =
            await service.CreateAsync(options);

        return new ServiceResponse<string>
        {
            Success = true,

            Data = session.Url,

            Message =
                "Checkout session created successfully."
        };
    }

    public async Task<
        ServiceResponse<string>>
        ActivateSubscriptionAsync(
            string userId,
            int planId)
    {
        var existingSubscription =
            await _context.UserSubscriptions
                .FirstOrDefaultAsync(
                    x =>
                        x.UserId == userId &&
                        x.EndDate > DateTime.UtcNow
                );

        if (existingSubscription != null)
        {
            existingSubscription.EndDate =
                existingSubscription.EndDate
                    .AddDays(30);

            await _context.SaveChangesAsync();

            return new ServiceResponse<string>
            {
                Success = true,

                Message =
                    "Subscription extended successfully."
            };
        }

        var subscription =
            new UserSubscription
            {
                UserId = userId,

                SubscriptionPlanId = planId,

                StartDate = DateTime.UtcNow,

                EndDate =
                    DateTime.UtcNow.AddDays(30),

                IsActive = true
            };

        _context.UserSubscriptions
            .Add(subscription);

        await _context.SaveChangesAsync();

        return new ServiceResponse<string>
        {
            Success = true,

            Message =
                "Subscription activated successfully."
        };
    }

    public async Task<
        ServiceResponse<
            CurrentSubscriptionResponse>>
        GetCurrentSubscriptionAsync(
            string userId)
    {
        var subscription =
            await _context.UserSubscriptions
                .Include(x => x.SubscriptionPlan)
                .FirstOrDefaultAsync(
                    x =>
                        x.UserId == userId &&
                        x.IsActive &&
                        x.EndDate > DateTime.UtcNow
                );

        if (subscription == null)
        {
            return new ServiceResponse<
                CurrentSubscriptionResponse>
            {
                Success = false,

                Message =
                    "No active subscription found."
            };
        }

        return new ServiceResponse<
            CurrentSubscriptionResponse>
        {
            Success = true,

            Message =
                "Current subscription retrieved successfully.",

            Data =
                new CurrentSubscriptionResponse
                {
                    Id =
                        subscription.Id,

                    PlanName =
                        subscription
                            .SubscriptionPlan
                            .Name,

                    StartDate =
                        subscription.StartDate,

                    EndDate =
                        subscription.EndDate,

                    IsActive =
                        subscription.IsActive,

                    MaxBooks =
                        subscription
                            .SubscriptionPlan
                            .MaxBooks,

                    ReturnDays =
                        subscription
                            .SubscriptionPlan
                            .ReturnDays,

                    PriorityDelivery =
                        subscription
                            .SubscriptionPlan
                            .PriorityDelivery
                }
        };
    }

    public async Task<
        ServiceResponse<
            List<SubscriptionPlanResponse>>>
        GetSubscriptionPlansAsync()
    {
        var plans =
            await _context.SubscriptionPlans
                .Select(x =>
                    new SubscriptionPlanResponse
                    {
                        Id = x.Id,

                        Name = x.Name,

                        Price = x.Price,

                        MaxBooks =
                            x.MaxBooks,

                        ReturnDays =
                            x.ReturnDays,

                        PriorityDelivery =
                            x.PriorityDelivery
                    }
                )
                .ToListAsync();

        return new ServiceResponse<
            List<SubscriptionPlanResponse>>
        {
            Success = true,

            Message =
                "Subscription plans retrieved successfully.",

            Data = plans
        };
    }
}

