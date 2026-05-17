using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DataAccess.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int GenreId { get; set; }
        public Genre Genre { get; set; } = null!;
        public ICollection<BookCopy> BookCopies { get; set; } = new List<BookCopy>();
    }
}
