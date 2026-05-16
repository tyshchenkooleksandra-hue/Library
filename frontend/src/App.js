import { useState, useEffect } from 'react';
import './App.css';

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import AdminDashboard from './pages/admin/AdminDashboard';
import ShopPage from './pages/client/ShopPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {

    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setUser(null);

    navigate('/login');
  };

  return (
    <Routes>

      {/* Default redirect */}

      <Route
        path="/"
        element={
          user
            ? <Navigate to="/shoppage" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* Login */}

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/shoppage" replace />
            : <LoginPage setUser={setUser} />
        }
      />
      ```


      {/* Register */}

      <Route
        path="/register"
        element={
          user
            ? <Navigate to="/shoppage" replace />
            : <RegisterPage />
        }
      />

      {/* Shop Page */}

      <Route
        path="/shoppage"
        element={
          user
            ? (
              <ShopPage
                user={user}
                onLogout={handleLogout}
              />
            )
            : <Navigate to="/login" replace />
        }
      />

      {/* Admin Dashboard */}

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
