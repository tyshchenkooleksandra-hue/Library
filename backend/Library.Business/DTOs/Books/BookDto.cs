namespace Library.Business.DTOs.Books
{
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string GenreName { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}