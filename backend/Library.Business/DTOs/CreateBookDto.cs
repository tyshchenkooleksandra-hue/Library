using System.ComponentModel.DataAnnotations;

namespace Library.Business.DTOs.Books
{
    public class CreateBookDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Author { get; set; } = string.Empty;
        [Required]
        public int GenreId { get; set; }
        public string? Description { get; set; }
    }
}