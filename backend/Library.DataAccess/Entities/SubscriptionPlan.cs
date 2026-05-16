using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DataAccess.Entities;

public class SubscriptionPlan
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int MaxBooks { get; set; }

    public int ReturnDays { get; set; }

    public bool PriorityDelivery { get; set; }

    public ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
}

