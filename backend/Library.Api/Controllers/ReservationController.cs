using Library.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Library.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReservationController
        : ControllerBase
    {
        private readonly IReservationService
            _reservationService;

        public ReservationController(
            IReservationService
                reservationService)
        {
            _reservationService =
                reservationService;
        }

        [HttpPost("confirm")]
        public async Task<IActionResult>
            ConfirmReservation()
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            var response =
                await _reservationService
                    .ConfirmReservationAsync(
                        userId!
                    );

            if (!response.Success)
            {
                return BadRequest(
                    new
                    {
                        message =
                            response.Message
                    }
                );
            }

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult>
            GetReservations()
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            var response =
                await _reservationService
                    .GetUserReservationsAsync(
                        userId!
                    );

            return Ok(response);
        }
    }
}

