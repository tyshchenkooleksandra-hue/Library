namespace Library.Business.DTOs.Subscription;

public class CurrentSubscriptionResponse
{
    public int Id { get; set; }

    public string PlanName { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; }

    public int MaxBooks { get; set; }

    public int ReturnDays { get; set; }

    public bool PriorityDelivery { get; set; }
}