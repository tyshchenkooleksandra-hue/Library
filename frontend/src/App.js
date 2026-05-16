import { useState, useEffect } from 'react';
import './App.css';

import {
  Routes,
  Route,
  useNavigate,
  Navigate
} from 'react-router-dom';

import AdminDashboard from './pages/admin/AdminDashboard';
import ShopPage from './pages/client/ShopPage';

import LoginPage from './pages/auth/LoginPage';

import RegisterPage from './pages/auth/Register/RegisterPage';

import CheckEmailPage from './pages/auth/CheckEmailPage';

import ConfirmEmailPage from './pages/auth/ConfirmEmailPage';

import SubscriptionPage from './pages/subscription/SubscriptionPage';

function App() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [cart, setCart] = useState([]);

  useEffect(() => {

    const savedUser =
      localStorage.getItem('user');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem('user');

    setUser(null);

    navigate('/login');
  };

  return (

    <Routes>

      <Route
        path="/"
        element={
          user
            ? <Navigate to="/shoppage" replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/shoppage" replace />
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
            ? <Navigate to="/shoppage" replace />
            : (
              <RegisterPage
                setUser={setUser}
              />
            )
        }
      />

      <Route
        path="/check-email"
        element={<CheckEmailPage />}
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
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/shoppage"
        element={
          user
            ? (
              <ShopPage
                user={user}
                cart={cart}
                setCart={setCart}
                onLogout={handleLogout}
                onOpenLogin={() =>
                  navigate('/login')
                }
              />
            )
            : <Navigate to="/login" replace />
        }
      />


      <Route
        path="/admindashboard"
        element={
          user?.role === 'admin'
            ? (
              <AdminDashboard
                email={user?.email}
                onLogout={handleLogout}
              />
            )
            : <Navigate to="/login" replace />
        }
      />

    </Routes>
  );
}

export default App;
