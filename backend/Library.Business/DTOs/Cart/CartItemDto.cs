using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Business.DTOs.Cart
{
    public class CartItemDto
    {
        public int Id { get; set; }

        public int BookId { get; set; }

        public string Title { get; set; } =
            string.Empty;

        public string Author { get; set; } = string.Empty;
    }
}
