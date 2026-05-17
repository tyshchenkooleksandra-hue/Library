namespace Library.DataAccess.Entities;

public class UserSubscription
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    public int SubscriptionPlanId { get; set; }

    public SubscriptionPlan SubscriptionPlan { get; set; } = null!;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; }
}
