using Library.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System;

namespace Library.DataAccess.Context;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Book> Books { get; set; }

    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }

    public DbSet<UserSubscription> UserSubscriptions { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>().HasData(
            new IdentityRole
            {
                Id = "fab4fac1-c546-41de-aebc-a17da9019500",
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Id = "c7b013f0-5201-4317-abd8-c211f91b7330",
                Name = "User",
                NormalizedName = "USER"
            }
        );

        builder.Entity<SubscriptionPlan>().HasData(

            new SubscriptionPlan
            {
                Id = 1,

                Name = "Basic",

                Price = 2.99m,

                MaxBooks = 2,

                ReturnDays = 14,

                PriorityDelivery = false
            },

            new SubscriptionPlan
            {
                Id = 2,

                Name = "Premium",

                Price = 5.99m,

                MaxBooks = 5,

                ReturnDays = 30,

                PriorityDelivery = true
            }
        );
    }
}
