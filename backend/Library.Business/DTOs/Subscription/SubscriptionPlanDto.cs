namespace Library.Business.DTOs.Subscription;

public class SubscriptionPlanDto
{
    public int Id { get; set; }

    public string Name { get; set; }
        = string.Empty;

    public decimal Price { get; set; }

    public int MaxBooks { get; set; }

    public int ReturnDays { get; set; }

    public bool PriorityDelivery
    {
        get;
        set;
    }
}
