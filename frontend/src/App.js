import { useState, useEffect }
  from 'react';

import BookPreviewPage
  from './pages/client/BookPreviewPage/BookPreviewPage';

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

  const navigate =
    useNavigate();

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

    localStorage.removeItem('token');

    setUser(null);

    navigate('/login');
  };

  if (loading) {
    return null;
  }

  const isAdmin =
    user?.role === "Admin";

  const userEmail =
    user?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    ];

  return (

    <Routes>

      <Route
        path="/"
        element={
          user
            ? (
              isAdmin
                ? (
                  <Navigate
                    to="/admindashboard"
                    replace
                  />
                )
                : (
                  <Navigate
                    to="/librarypage"
                    replace
                  />
                )
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
              isAdmin
                ? (
                  <Navigate
                    to="/admindashboard"
                    replace
                  />
                )
                : (
                  <Navigate
                    to="/librarypage"
                    replace
                  />
                )
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
              isAdmin
                ? (
                  <Navigate
                    to="/admindashboard"
                    replace
                  />
                )
                : (
                  <Navigate
                    to="/librarypage"
                    replace
                  />
                )
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
          <SubscriptionPage
            user={user}
          />
        }
      />

      <Route
        path="/subscription-success"
        element={
          <SubscriptionSuccessPage />
        }
      />

      <Route
        path="/librarypage"
        element={
          <LibraryPage
            user={user}
            cart={cart}
            setCart={setCart}
            onLogout={handleLogout}
            onOpenLogin={() =>
              navigate('/login')
            }
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
            onBack={() =>
              navigate('/librarypage')
            }
          />
        }
      />

      <Route
        path="/books/:id"
        element={
          <BookPreviewPage
            user={user}
            cart={cart}
            setCart={setCart}
          />
        }
      />

      <Route
        path="/admindashboard"
        element={
          isAdmin
            ? (
              <AdminDashboard
                email={userEmail}
                onLogout={handleLogout}
              />
            )
            : (
              <Navigate
                to="/librarypage"
                replace
              />
            )
        }
      />

    </Routes>
  );
}

export default App;