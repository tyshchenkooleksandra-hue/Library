
import React, { useState } from 'react';
import BookForm from './BookForm';
import { initialBooks } from '../../data/mockData';

const BooksPage = ({ 
  isClientMode = false, 
  onAddToCart, 
  isLoggedIn = false, 
  isAdmin = false,
  onOpenLogin 
}) => {
  
  const [books, setBooks] = useState(initialBooks);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase().trim();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      (book.description && book.description.toLowerCase().includes(term)) ||
      book.price.toString().includes(term)
    );
  });

  const addBook = (newBookData, file, processedImage) => {
    const bookWithId = {
      id: Date.now(),
      title: newBookData.title,
      author: newBookData.author,
      price: newBookData.price,
      stock: newBookData.stock,
      description: newBookData.description,
      image: processedImage || (file ? URL.createObjectURL(file) : 'https://picsum.photos/id/1005/300/400')
    };

    setBooks(prev => [...prev, bookWithId]);
    setShowForm(false);
    setEditingBook(null);
    alert(" Книга успішно додана!");
  };

  const updateBook = (updatedBookData, file, processedImage) => {
    setBooks(prev => prev.map(book =>
      book.id === editingBook?.id
        ? {
            ...book,
            title: updatedBookData.title,
            author: updatedBookData.author,
            price: updatedBookData.price,
            stock: updatedBookData.stock,
            description: updatedBookData.description,
            image: processedImage || (file ? URL.createObjectURL(file) : book.image)
          }
        : book
    ));
    setShowForm(false);
    setEditingBook(null);
    alert(" Зміни збережено!");
  };

  const deleteBook = (id) => {
    if (window.confirm('Ви дійсно хочете видалити цю книгу?')) {
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleAddToCart = (book) => {
    if (onAddToCart) {
      onAddToCart(book);
    } else {
      alert("🛒 Книга додана в кошик (тестовий режим)");
    }
  };

  const handleAddBookClick = () => {
    if (isClientMode) return;

    if (!isLoggedIn || !isAdmin) {
      alert(" Для додавання та редагування книг потрібно увійти як адміністратор!");
      onOpenLogin?.();
      return;
    }

    setEditingBook(null);
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          
          <p className="text-gray-500 mt-1">
            {isClientMode 
              ? `${filteredBooks.length} книг у каталозі` 
              : "Керуйте асортиментом вашої книгарні"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Пошук по назві, автору або ціні..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-3.5 pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
            />
          </div>

          {!isClientMode && (
            <button
              onClick={handleAddBookClick}
              className="btn-primary flex items-center gap-3 px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 whitespace-nowrap"
            >
              <span className="text-2xl leading-none">+</span>
              Додати книгу
            </button>
          )}
        </div>
      </div>

      <div className="table-container overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr>
              <th className="w-24">Обкладинка</th>
              <th>Назва</th>
              <th>Автор</th>
              <th className="w-28">Ціна</th>
              <th className="w-32">На складі</th>
              <th>Опис</th>
              <th className="w-40 text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id} className="group hover:bg-gray-50 transition-colors">
                <td className="px-6 py-6">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="book-cover w-20 h-28 object-cover rounded-xl shadow-sm" 
                  />
                </td>
                <td className="px-6 py-6 font-semibold text-gray-900">{book.title}</td>
                <td className="px-6 py-6 text-gray-700">{book.author}</td>
                <td className="px-6 py-6 font-semibold text-emerald-600">
                  {book.price} ₴
                </td>
                <td className="px-6 py-6 text-gray-700 font-medium">
                  {book.stock} шт.
                </td>
                <td className="px-6 py-6 text-sm text-gray-600 max-w-md leading-relaxed line-clamp-2">
                  {book.description}
                </td>
                <td className="px-6 py-6 text-right">
                  {isClientMode ? (
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="btn-primary px-7 py-3 text-sm font-medium hover:scale-105 transition-transform"
                    >
                      + В кошик
                    </button>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => handleEdit(book)}
                        className="button-all"
                      >
                        Редагувати
                      </button>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="delete-button"
                      >
                        Видалити
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">
            {searchTerm 
              ? `Книг за запитом "${searchTerm}" не знайдено.` 
              : 'Список книг порожній.'}
          </p>
        </div>
      )}

      {showForm && (
        <BookForm
          book={editingBook}
          onSave={editingBook ? updateBook : addBook}
          onClose={() => {
            setShowForm(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
};

export default BooksPage;