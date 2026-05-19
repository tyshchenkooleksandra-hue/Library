import React, {
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  getBooks,
  searchBooks
} from '../../../services/bookService';

import {
  addToCart as addToCartRequest
} from '../../../services/cartService';

import DefaultBookImage
  from '../../../assets/default-book.jpg';

import AddToCartButton
  from '../../../components/cart/AddToCartButton';

import './LibraryPage.css';

const DEBOUNCE_MS = 400;

const LibraryPage = ({
  user,
  cart,
  setCart,
  onLogout,
  onOpenLogin
}) => {

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';

  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  const debounceTimer = useRef(null);

  const [tooltip, setTooltip] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const limit = 6;

  const handleSearchChange = useCallback(e => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);

      if (value.trim()) {
        setSearchParams({ search: value.trim() });
      } else {
        setSearchParams({});
      }
    }, DEBOUNCE_MS);
  }, [setSearchParams]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {

    const loadBooks = async () => {
      try {
        setLoading(true);

        let data;

        if (debouncedSearch.trim()) {
          const all = await searchBooks(debouncedSearch);
          const start = (page - 1) * limit;
          data = all.slice(start, start + limit);
        } else {
          data = await getBooks(page, limit);
        }

        setBooks(data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();

  }, [page, debouncedSearch]);

  const addToCart = async book => {
    try {
      await addToCartRequest(user.token, book.id);

      setCart(prev => [
        ...prev,
        { ...book, cartId: Date.now() }
      ]);

      setTooltip({
        show: true,
        message: `"${book.title}" added to cart`,
        type: 'success'
      });

    } catch (error) {
      setTooltip({
        show: true,
        message: error.message,
        type: 'error'
      });
    }

    setTimeout(() => {
      setTooltip({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  return (

    <div className="admin-page">

      <div className="admin-header">

        <span className="admin-header__logo">
          📖 Library
        </span>

        <div className="admin-header__tabs">

          <button className="admin-tab admin-tab--active">
            📚 Catalog
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="admin-tab"
          >
            🛒 Cart
            {cart.length > 0 && (
              <span className="library-cart-count">
                {cart.length}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/subscription')}
            className="admin-tab"
          >
            ⭐ Subscription Plan
          </button>

        </div>

        <div className="admin-header__right">
          {user ? (
            <>
              <span className="admin-header__email">
                {user.email}
              </span>
              <button onClick={onLogout} className="button-all">
                Logout
              </button>
            </>
          ) : (
            <button onClick={onOpenLogin} className="button-all">
              Login
            </button>
          )}
        </div>

      </div>

      {tooltip.show && (
        <div className={
          tooltip.type === 'success'
            ? 'cart-tooltip success'
            : 'cart-tooltip error'
        }>
          {tooltip.message}
        </div>
      )}

      <div className="admin-body">

        {/* ── Search input ── */}
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search books..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {loading ? (

          <div>Loading...</div>

        ) : (
          <>
            <div className="books-grid">

              {books.length === 0 ? (

                <p className="no-books">
                  No books found{search ? ` for "${search}"` : ''}.
                </p>

              ) : (

                books.map(book => (
                  <div key={book.id} className="subscription-card">

                    <img
                      src={book.imageUrl || DefaultBookImage}
                      alt={book.title}
                      className="book-image"
                    />

                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p>Author: {book.author}</p>
                      <p>Genre: {book.genreName}</p>
                      <p>{book.description}</p>
                      <p>
                        Status:{' '}
                        {book.isAvailable ? 'Available' : 'Unavailable'}
                      </p>
                    </div>

                    <div className="book-actions">
                      <button
                        className="book-button book-button--preview"
                        onClick={() => navigate(`/books/${book.id}`)}
                      >
                        👁 Preview
                      </button>

                      <AddToCartButton
                        book={book}
                        onAddToCart={addToCart}
                      />
                    </div>

                  </div>
                ))
              )}

            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '20px'
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
              >
                Previous
              </button>

              <span>Page {page}</span>

              <button
                disabled={books.length < limit}
                onClick={() => setPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  );
};

export default LibraryPage;