using Library.Business.DTOs.Books;
using Library.Business.Interfaces;
using Library.DataAccess.Context;
using Library.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace Library.Business.Services
{
    public class BookService : IBookService
    {
        private readonly ApplicationDbContext _context;

        public BookService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync( int page,int limit)
        {
            return await _context.Books
                    .Include(b => b.Genre)
                    .Include(b => b.BookCopies)

                    .OrderByDescending(
                        b => b.BookCopies.Any(
                            bc => bc.Status == "Available"
                        )
                    )

                    .Skip((page - 1) * limit)
                    .Take(limit)

                    .Select(b => MapToDto(b))
                    .ToListAsync();
        }

        public async Task<BookDto?> GetBookByIdAsync(int id)
        {
            var book = await _context.Books
                .Include(b => b.Genre)
                .Include(b => b.BookCopies)
                .FirstOrDefaultAsync(b => b.Id == id);

            return book != null ? MapToDto(book) : null;
        }

        public async Task CreateBookAsync(CreateBookDto dto)
        {
            var book = new Book
            {
                Title = dto.Title,
                Author = dto.Author,
                GenreId = dto.GenreId,
                Description = dto.Description
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBookAsync(int id, CreateBookDto dto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book != null)
            {
                book.Title = dto.Title;
                book.Author = dto.Author;
                book.GenreId = dto.GenreId;
                book.Description = dto.Description;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteBookAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book != null)
            {
                _context.Books.Remove(book);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<BookDto>> SearchBooksAsync(string? title, string? author, int? genreId)
        {
            var query = _context.Books.Include(b => b.Genre).Include(b => b.BookCopies).AsQueryable();

            if (!string.IsNullOrEmpty(title))
                query = query.Where(b => b.Title.Contains(title));

            if (!string.IsNullOrEmpty(author))
                query = query.Where(b => b.Author.Contains(author));

            if (genreId.HasValue)
                query = query.Where(b => b.GenreId == genreId);

            return await query.Select(b => MapToDto(b)).ToListAsync();
        }

        public async Task<IEnumerable<BookDto>> GetAvailableBooksAsync()
        {
            return await _context.Books
                .Include(b => b.Genre)
                .Include(b => b.BookCopies)
                .Where(b => b.BookCopies.Any(bc => bc.Status == "Available"))
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        private static BookDto MapToDto(Book b) => new BookDto
        {
            Id = b.Id,
            Title = b.Title,
            Author = b.Author,
            Description = b.Description,
            GenreName = b.Genre?.Name ?? "No Genre",
            IsAvailable = b.BookCopies != null && b.BookCopies.Any(bc => bc.Status == "Available")
        };
    }
}