using Library.Business.DTOs.Books;

namespace Library.Business.Interfaces
{
    public interface IBookService
    {
        Task<IEnumerable<BookDto>> GetAllBooksAsync(int page, int limit);
        Task<BookDto?> GetBookByIdAsync(int id);
        Task CreateBookAsync(CreateBookDto dto);
        Task UpdateBookAsync(int id, CreateBookDto dto);
        Task DeleteBookAsync(int id);
        Task<IEnumerable<BookDto>> SearchBooksAsync(string? title, string? author, int? genreId);
        Task<IEnumerable<BookDto>> GetAvailableBooksAsync();
    }
}