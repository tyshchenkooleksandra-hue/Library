
import React, { useState } from 'react';
import BooksPage from '../../components/admin/BooksPage';
import OrdersPage from '../../components/admin/OrdersPage';


const AdminDashboard = ({ onLogout, email }) => {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-headline">
                Панель адміністратора
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            <span className="text-gray-600 font-medium hidden sm:block">
              {email}
            </span>

            <button 
              onClick={onLogout}
              className="button-all"
            >
              <span>Вийти</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('books')}
              className={`pb-5 pt-4 text-lg font-semibold transition-all relative flex items-center gap-3
                ${activeTab === 'books' 
                  ? 'text-emerald-600 border-b-4 border-emerald-600' 
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
               Книги
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-5 pt-4 text-lg font-semibold transition-all relative flex items-center gap-3
                ${activeTab === 'orders' 
                  ? 'text-emerald-600 border-b-4 border-emerald-600' 
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
               Замовлення
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-6">
        {activeTab === 'books' ? (
          <BooksPage 
            isClientMode={false}
            isLoggedIn={true}
            isAdmin={true}
            onOpenLogin={() => alert("Ви вже увійшли як адміністратор!")} 
          />
        ) : (
          <OrdersPage />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;