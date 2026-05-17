using Library.Business.DTOs.Cart;
using Library.Business.DTOs.Common;
using Library.Business.Interfaces;
using Library.DataAccess.Context;
using Library.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace Library.Business.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext
            _context;

        public CartService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<bool>>
            AddToCartAsync(
                string userId,
                int bookId)
        {
            var subscription =
                await _context.UserSubscriptions
                    .Include(s => s.SubscriptionPlan)
                    .FirstOrDefaultAsync(
                        s =>
                            s.UserId == userId &&
                            s.EndDate >
                            DateTime.UtcNow
                    );

            if (subscription == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message =
                        "Subscription required"
                };
            }

           var cartItemsCount =
            await _context.CartItems
                .CountAsync(
                    c => c.UserId == userId
                );

                    var reservedBooksCount =
                        await _context.Reservations
                            .CountAsync(
                                r =>
                                    r.UserId == userId &&
                                    r.Status == "Active"
                            );

            var totalBooksCount =
                cartItemsCount +
                reservedBooksCount;

            if (
                totalBooksCount >=
                subscription
                    .SubscriptionPlan
                    .MaxBooks
            )
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message =
                        "Subscription limit exceeded"
                };
            }

            var availableCopy =
                await _context.BookCopies
                    .AnyAsync(
                        bc =>
                            bc.BookId == bookId &&
                            bc.Status ==
                            "Available"
                    );

            if (!availableCopy)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message =
                        "Book unavailable"
                };
            }

            var alreadyInCart =
                await _context.CartItems
                    .AnyAsync(
                        c =>
                            c.UserId == userId &&
                            c.BookId == bookId
                    );

            if (alreadyInCart)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message =
                        "Book already added"
                };
            }

            var item = new CartItem
            {
                UserId = userId,
                BookId = bookId
            };

            _context.CartItems.Add(item);

            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Success = true,
                Data = true,
                Message =
                    "Book added to cart"
            };
        }

        public async Task<
            ServiceResponse<
                IEnumerable<CartItemDto>>>
            GetCartAsync(
                string userId)
        {
            var items =
                await _context.CartItems
                    .Include(c => c.Book)
                    .Where(
                        c => c.UserId == userId
                    )
                    .Select(c =>
                        new CartItemDto
                        {
                            Id = c.Id,

                            BookId =
                                c.BookId,

                            Title =
                                c.Book.Title,

                            Author =
                                c.Book.Author
                        }
                    )
                    .ToListAsync();

            return new ServiceResponse<
                IEnumerable<CartItemDto>>
            {
                Success = true,
                Data = items
            };
        }
    }
}
