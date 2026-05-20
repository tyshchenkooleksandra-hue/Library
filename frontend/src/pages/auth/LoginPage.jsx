import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

import { login }
  from '../../services/authService';

function LoginPage({ setUser }) {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const handleSubmit = async e => {

    e.preventDefault();

    setError('');
    setSuccess('');

    try {

      const data = await login({email,password});

      const decodedToken =
        jwtDecode(data.accessToken);

      const userData = {
        email:
          decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
          ],

        id:
          decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
          ],
       role:
  decodedToken[
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  ],
        token:
          data.accessToken
      };

      localStorage.setItem(
        'token',
        data.accessToken
      );

      localStorage.setItem(
        'user',
        JSON.stringify(userData)
      );

      setUser(userData);



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
          onChange={e =>
            setEmail(
              e.target.value
            )
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e =>
            setPassword(
              e.target.value
            )
          }
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
          style={{
            cursor: 'pointer',
            color: 'blue'
          }}
          onClick={() =>
            navigate('/register')
          }
        >
          Register
        </span>

      </p>

    </div>
  );
}

export default LoginPage;
