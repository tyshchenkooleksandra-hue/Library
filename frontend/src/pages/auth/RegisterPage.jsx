import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage({ onRegister }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onRegister(form);
  };

  return (
    <div className="auth-page">
      <h2>Реєстрація</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Ім'я"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Зареєструватися</button>
      </form>

      <p>
        Вже є акаунт?{' '}
        <span onClick={() => navigate('/login')}>
          Увійти
        </span>
      </p>
    </div>
  );
}

export default RegisterPage;