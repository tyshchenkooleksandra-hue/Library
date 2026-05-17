import React, { useState } from 'react';
import BooksPage from '../../components/admin/BooksPage';
import OrdersPage from '../../components/admin/OrdersPage';

const AdminDashboard = ({ onLogout, email }) => {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <div className="admin-page">

      <div className="admin-header">
        <span className="admin-header__logo">📖 BookStore</span>

        <div className="admin-header__tabs">
          <button
            onClick={() => setActiveTab('books')}
            className={`admin-tab ${activeTab === 'books' ? 'admin-tab--active' : ''}`}
          >
            📚 Книги
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`admin-tab ${activeTab === 'orders' ? 'admin-tab--active' : ''}`}
          >
            📦 Замовлення
          </button>
        </div>

        <div className="admin-header__right">
          <span className="admin-header__email">{email}</span>
          <button onClick={onLogout} className="button-all">Вийти</button>
        </div>
      </div>

      <div className="admin-body">
        {activeTab === 'books' ? (
          <BooksPage
            isClientMode={false}
            isLoggedIn={true}
            isAdmin={true}
            onOpenLogin={() => {}}
          />
        ) : (
          <OrdersPage />
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;