import React, {
  useEffect,
  useState
} from 'react';

import { useNavigate }
  from 'react-router-dom';

import {
  getBooks
} from '../../../services/bookService';

import DefaultBookImage
  from '../../../assets/default-book.jpg';

import './LibraryPage.css';

const ShopPage = ({
  user,
  cart,
  setCart,
  onLogout,
  onOpenLogin
}) => {

  const navigate =
    useNavigate();

  const [books, setBooks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(1);

  const limit = 6;

  useEffect(() => {

    const loadBooks =
      async () => {

        try {

          setLoading(true);

          const data =
            await getBooks(
              page,
              limit
            );

          setBooks(data);

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    loadBooks();

  }, [page]);

  const addToCart = book => {

    setCart(prev => [
      ...prev,
      {
        ...book,
        cartId: Date.now()
      }
    ]);

    alert(
      `Book "${book.title}" added to cart!`
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
          onClick={() =>
            navigate('/cart')
          }
          className="admin-tab"
        >
          🛒 Cart

          {cart.length > 0 && (
            <span className="shop-cart-count">
              {cart.length}
            </span>
          )}

        </button>

        <button
          onClick={() =>
            navigate('/subscription')
          }
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

              <button
                onClick={onLogout}
                className="button-all"
              >
                Logout
              </button>

            </>
          ) : (

            <button
              onClick={onOpenLogin}
              className="button-all"
            >
              Login
            </button>

          )}

        </div>

      </div>

      <div className="admin-body">

        <div className="books-grid">

          {books.map(book => (

            <div
              key={book.id}
              className="subscription-card"
            >

              <img
                src={
                  book.imageUrl ||
                  DefaultBookImage
                }
                alt={book.title}
                className="book-image"
              />

              <div className="book-info">

                <h3>
                  {book.title}
                </h3>

                <p>
                  Author:
                  {' '}
                  {book.author}
                </p>

                <p>
                  Genre:
                  {' '}
                  {book.genreName}
                </p>

                <p>
                  {book.description}
                </p>

                <p>
                  Status:
                  {' '}
                  {
                    book.isAvailable
                      ? 'Available'
                      : 'Unavailable'
                  }
                </p>

              </div>

              <div className="book-actions">

                <button
                  className="book-button"
                  disabled={
                    !book.isAvailable
                  }
                  onClick={() =>
                    addToCart(book)
                  }
                >
                  Add to Cart
                </button>

              </div>

            </div>
          ))}

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
            onClick={() =>
              setPage(prev => prev - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {page}
          </span>

          <button
            disabled={
              books.length < limit
            }
            onClick={() =>
              setPage(prev => prev + 1)
            }
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default ShopPage;

