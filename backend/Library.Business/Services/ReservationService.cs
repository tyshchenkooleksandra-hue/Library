using Library.Business.DTOs.Common;
using Library.Business.DTOs.Reservation;
using Library.Business.Interfaces;
using Library.DataAccess.Context;
using Library.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Library.Business.Services
{
    public class ReservationService
        : IReservationService
    {
        private readonly ApplicationDbContext
            _context;

        public ReservationService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<bool>>
            ConfirmReservationAsync(
                string userId)
        {
            var cartItems =
                await _context.CartItems
                    .Include(c => c.Book)
                    .Where(
                        c => c.UserId == userId
                    )
                    .ToListAsync();

            if (!cartItems.Any())
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message =
                        "Cart is empty"
                };
            }

            foreach (var item in cartItems)
            {
                var copy =
                    await _context.BookCopies
                        .FirstOrDefaultAsync(
                            bc =>
                                bc.BookId ==
                                item.BookId &&
                                bc.Status ==
                                "Available"
                        );

                if (copy == null)
                {
                    continue;
                }

                copy.Status =
                    "Reserved";

                var reservation =
                    new Reservation
                    {
                        UserId = userId,

                        BookId =
                            item.BookId,

                        ReservedAt =
                            DateTime.UtcNow,

                        ExpirationDate =
                            DateTime.UtcNow
                                .AddDays(3),

                        Status =
                            "Active"
                    };

                _context.Reservations
                    .Add(reservation);
            }

            _context.CartItems
                .RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Success = true,
                Data = true,
                Message =
                    "Reservation confirmed"
            };
        }

        public async Task<
            ServiceResponse<
                IEnumerable<ReservationDto>>>
            GetUserReservationsAsync(
                string userId)
        {
            var reservations =
                await _context.Reservations
                    .Include(r => r.Book)
                    .Where(
                        r => r.UserId == userId
                    )
                    .Select(r =>
                        new ReservationDto
                        {
                            Id = r.Id,

                            Title =
                                r.Book.Title,

                            Author =
                                r.Book.Author,

                            ReservedAt =
                                r.ReservedAt,

                            ExpirationDate =
                                r.ExpirationDate,

                            Status =
                                r.Status
                        }
                    )
                    .ToListAsync();

            return new ServiceResponse<
                IEnumerable<ReservationDto>>
            {
                Success = true,
                Data = reservations
            };
        }
    }
}

