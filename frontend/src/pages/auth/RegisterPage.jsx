import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { register } from '../../services/authService';

function RegisterPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {

    e.preventDefault();

    setError('');
    setSuccess('');

    try {

      await register(form);

      setSuccess(
        'Registration successful! Please confirm your email.'
      );

      setTimeout(() => {

        navigate('/check-email');

      }, 1500);

    } catch (error) {

      console.error(error);

      setError(error.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Реєстрація</h2>

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Register
        </button>

      </form>

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

      <p>
        Already have an account?{' '}

        <span
          style={{
            cursor: 'pointer',
            color: 'blue'
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </span>
      </p>

    </div>
  );
}

export default RegisterPage;
