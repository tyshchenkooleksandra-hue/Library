import React, { useState, useEffect } from 'react';
import './App.css';

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import AdminDashboard from './pages/admin/AdminDashboard';
import ShopPage from './pages/client/ShopPage';
import CartPage from './pages/client/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState([]);   

  const navigate = useNavigate();

  useEffect(() => {
    const savedUsers = localStorage.getItem('bookstore_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      import('./data/mockData').then(({ users: mockUsers }) => {
        setUsers(mockUsers);
        localStorage.setItem('bookstore_users', JSON.stringify(mockUsers));
      });
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('bookstore_users', JSON.stringify(users));
    }
  }, [users]);

  const handleLogin = (email, password) => {
    const foundUser = users.find(
      u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (foundUser) {
      setUser({
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name || foundUser.email.split('@')[0],
        role: foundUser.role,
      });

      alert(`Вітаємо, ${foundUser.name || foundUser.email}!`);

      if (foundUser.role === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/shoppage');
      }
    } else {
      alert('Неправильний email або пароль!');
    }
  };

  const handleRegister = newUserData => {
    const existingUser = users.find(
      u => u.email.toLowerCase() === newUserData.email.toLowerCase()
    );

    if (existingUser) {
      alert('Користувач з таким email вже існує!');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: newUserData.name,
      email: newUserData.email,
      password: newUserData.password,
      role: 'client',
    };

    setUsers(prev => [...prev, newUser]);
    alert('Реєстрація успішна! Тепер увійдіть у акаунт.');
    navigate('/login');
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shoppage" replace />} />

      <Route
        path="/admindashboard"
        element={
          user?.role === 'admin'
            ? <AdminDashboard email={user?.email} onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/shoppage"
        element={
          <ShopPage
            user={user}
            cart={cart}
            setCart={setCart}
            onLogout={handleLogout}
            onOpenLogin={() => navigate('/login')}
          />
        }
      />

      <Route
        path="/cart"
        element={
          <CartPage
            cart={cart}
            setCart={setCart}
            user={user}
            onBack={() => navigate('/shoppage')}
          />
        }
      />

      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
    </Routes>
  );
}

export default App;