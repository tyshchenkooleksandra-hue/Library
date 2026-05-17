using Library.Business.DTOs.Cart;
using Library.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Library.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService
            _cartService;

        public CartController(
            ICartService cartService)
        {
            _cartService =
                cartService;
        }

        [HttpPost("add")]
        public async Task<IActionResult>
            AddToCart(
                [FromBody]
                AddToCartRequest request)
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            var response =
                await _cartService
                    .AddToCartAsync(
                        userId!,
                        request.BookId
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
            GetCart()
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            var response =
                await _cartService
                    .GetCartAsync(
                        userId!
                    );

            return Ok(response);
        }
    }
}
