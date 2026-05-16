import React from 'react';
import { useNavigate } from 'react-router-dom';
import BooksPage from '../../components/admin/BooksPage';

const ShopPage = ({ user, cart, setCart, onLogout, onOpenLogin }) => {
  const navigate = useNavigate();

  const addToCart = (book) => {
    setCart(prev => [...prev, { ...book, cartId: Date.now() }]);
    alert(`Книга "${book.title}" додана в кошик!`);
  };

  return (
    <div className="admin-page">

      <div className="admin-header">
        <span className="admin-header__logo">📖 BookStore</span>

        <div className="admin-header__tabs">
          <button className="admin-tab admin-tab--active">
            📚 Каталог
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="admin-tab"
          >
            🛒 Кошик
            {cart.length > 0 && (
              <span className="shop-cart-count">{cart.length}</span>
            )}
          </button>
        </div>

        <div className="admin-header__right">
          {user ? (
            <>
              <span className="admin-header__email">{user.name || user.email}</span>
              <button onClick={onLogout} className="button-all">Вийти</button>
            </>
          ) : (
            <button onClick={onOpenLogin} className="button-all">Увійти</button>
          )}
        </div>
      </div>

      <div className="admin-body">
        <BooksPage
          isClientMode={true}
          onAddToCart={addToCart}
          isLoggedIn={!!user}
          isAdmin={false}
          onOpenLogin={onOpenLogin}
        />
      </div>

    </div>
  );
};

export default ShopPage;