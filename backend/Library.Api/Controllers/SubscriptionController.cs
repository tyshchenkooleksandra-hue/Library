using Library.Business.DTOs.Subscription;
using Library.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.Security.Claims;

namespace Library.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [Authorize]
    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession(
        [FromBody] SubscribeDto model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var response = await _subscriptionService
            .CreateCheckoutSessionAsync(userId!, model.PlanId);

        if (!response.Success)
        {
            return BadRequest(new
            {
                message = response.Message
            });
        }

        return Ok(new
        {
            checkoutUrl = response.Data
        });
    }

    [Authorize]
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentSubscription()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var response = await _subscriptionService
            .GetCurrentSubscriptionAsync(userId!);

        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpGet("plans")]
    public async Task<IActionResult> GetSubscriptionPlans()
    {
        var response = await _subscriptionService
            .GetSubscriptionPlansAsync();

        return Ok(response);
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body)
            .ReadToEndAsync();

        var stripeSignature = Request.Headers["Stripe-Signature"];

        var webhookSecret = HttpContext.RequestServices
            .GetRequiredService<IConfiguration>()
            ["Stripe:WebhookSecret"];

        var stripeEvent = EventUtility.ConstructEvent(
            json,
            stripeSignature,
            webhookSecret
        );

        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Session;

            var userId = session!.Metadata["userId"];

            var planId = int.Parse(session.Metadata["planId"]);

            await _subscriptionService
                .ActivateSubscriptionAsync(userId, planId);
        }

        return Ok();
    }
}
