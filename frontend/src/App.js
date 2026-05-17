import { useState, useEffect } from 'react';

import './App.css';

import {
  Routes,
  Route,
  useNavigate,
  Navigate
} from 'react-router-dom';

import AdminDashboard
  from './pages/admin/AdminDashboard';

import LibraryPage
  from './pages/client/LibraryPage/LibraryPage';

import CartPage
  from './pages/client/CartPage';

import LoginPage
  from './pages/auth/LoginPage';

import RegisterPage
  from './pages/auth/RegisterPage';

import CheckEmailPage
  from './pages/auth/CheckEmailPage';

import ConfirmEmailPage
  from './pages/auth/ConfirmEmailPage';

import SubscriptionPage
  from './pages/subscription/SubscriptionPage/SubscriptionPage';

import SubscriptionSuccessPage
  from './pages/subscription/SubscriptionSuccessPage/SubscriptionSuccessPage';

function App() {

  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  const [cart, setCart] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const savedUser =
      localStorage.getItem('user');

    if (savedUser) {

      setUser(
        JSON.parse(savedUser)
      );
    }

    setLoading(false);

  }, []);

  const handleLogout = () => {

    localStorage.removeItem('user');

    setUser(null);

    navigate('/login');
  };

  if (loading) {
    return null;
  }

  return (

    <Routes>

      <Route
        path="/"
        element={
          user
            ? (
              <Navigate
                to="/subscription"
                replace
              />
            )
            : (
              <Navigate
                to="/login"
                replace
              />
            )
        }
      />

      <Route
        path="/login"
        element={
          user
            ? (
              <Navigate
                to="/subscription"
                replace
              />
            )
            : (
              <LoginPage
                setUser={setUser}
              />
            )
        }
      />

      <Route
        path="/register"
        element={
          user
            ? (
              <Navigate
                to="/subscription"
                replace
              />
            )
            : (
              <RegisterPage
                setUser={setUser}
              />
            )
        }
      />

      <Route
        path="/check-email"
        element={
          <CheckEmailPage />
        }
      />

      <Route
        path="/confirmemail"
        element={
          <ConfirmEmailPage
            setUser={setUser}
          />
        }
      />

      <Route
        path="/subscription"
        element={
          user
            ? (
              <SubscriptionPage
                user={user}
              />
            )
            : (
              <Navigate
                to="/login"
                replace
              />
            )
        }
      />

      <Route
        path="/subscription-success"
        element={
          user
            ? (
              <SubscriptionSuccessPage />
            )
            : (
              <Navigate
                to="/login"
                replace
              />
            )
        }
      />

      <Route
        path="/librarypage"
        element={
          user
            ? (
              <LibraryPage
                user={user}
                cart={cart}
                setCart={setCart}
                onLogout={handleLogout}
                onOpenLogin={() =>
                  navigate('/login')
                }
              />
            )
            : (
              <Navigate
                to="/login"
                replace
              />
            )
        }
      />

      <Route
        path="/cart"
        element={
          user
            ? (
              <CartPage
                cart={cart}
                setCart={setCart}
                user={user}
                onBack={() =>
                  navigate('/librarypage')
                }
              />
            )
            : (
              <Navigate
                to="/login"
                replace
              />
            )
        }
      />

      <Route
        path="/admindashboard"
        element={
          user?.role === 'admin'
            ? (
              <AdminDashboard
                email={user?.email}
                onLogout={
                  handleLogout
                }
              />
            )
            : (
              <Navigate
                to="/login"
                replace
              />
            )
        }
      />

    </Routes>
  );
}

export default App;
