
import React, { useState } from 'react';
import BooksPage from '../../components/admin/BooksPage';

const ShopPage = ({ user, onLogout, onOpenLogin }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart(prev => [...prev, { ...book, cartId: Date.now() }]);
    alert(` Книга "${book.title}" додана в кошик!`);
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-headline">Доставка книг📖</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {user ? (
              <span className="text-gray-600 font-medium">{user.name || user.email}</span>
            ) : (
              <button
                onClick={onOpenLogin}
                className="button-all"
              >
                Увійти
              </button>
            )}

            <button className="button-card ">
               Кошик 
              <span className="bg-white text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {cart.length}
              </span>
            </button>

            {user && (
              <button 
                onClick={onLogout}
                className="button-all"
              >
                Вийти
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-6">
        <BooksPage 
          isClientMode={true} 
          onAddToCart={addToCart}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onOpenLogin={onOpenLogin}
        />
      </div>
    </div>
  );
};

export default ShopPage;