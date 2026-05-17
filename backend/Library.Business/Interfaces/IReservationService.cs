using Library.Business.DTOs.Common;
using Library.Business.DTOs.Reservation;

namespace Library.Business.Interfaces
{
    public interface IReservationService
    {
        Task<ServiceResponse<bool>>
            ConfirmReservationAsync(
                string userId
            );

        Task<ServiceResponse<
            IEnumerable<ReservationDto>>>
            GetUserReservationsAsync(
                string userId
            );
    }
}

