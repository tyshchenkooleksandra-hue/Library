using Library.Business.DTOs.Cart;
using Library.Business.DTOs.Common;

namespace Library.Business.Interfaces
{
    public interface ICartService
    {
        Task<ServiceResponse<bool>>
            AddToCartAsync(
                string userId,
                int bookId
            );

        Task<ServiceResponse<IEnumerable<CartItemDto>>>
            GetCartAsync(
                string userId
            );
    }
}

