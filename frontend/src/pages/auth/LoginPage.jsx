import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../../services/authService';

function LoginPage({ setUser }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async e => {

    e.preventDefault();

    setError('');
    setSuccess('');

    try {

      const data = await login(email, password);

      localStorage.setItem('token', data.accessToken);

      setUser({
        token: data.accessToken
      });

      setSuccess('Login successful!');

      setTimeout(() => {
        navigate('/shoppage');
      }, 1000);

    } catch (error) {

      console.error(error);

      setError(error.message);
    }
  };

  return (
    <div className="auth-page">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

      </form>

      <p>
        Don't have an account?{' '}
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => navigate('/register')}
        >
          Register
        </span>
      </p>

    </div>
  );
}

export default LoginPage;
