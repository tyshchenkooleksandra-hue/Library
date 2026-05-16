import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage({ onRegister }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const parseBackendErrors = responseData => {
    const result = {};

    if (!responseData) return result;

  
    if (
      responseData.errors &&
      !Array.isArray(responseData.errors) &&
      typeof responseData.errors === 'object'
    ) {
      Object.entries(responseData.errors).forEach(([field, messages]) => {
        result[field] = Array.isArray(messages) ? messages : [String(messages)];
      });
      return result;
    }
    if (Array.isArray(responseData.errors)) {
      responseData.errors.forEach(({ field, message }) => {
        if (field && message) {
          if (!result[field]) result[field] = [];
          result[field].push(message);
        }
      });
      if (Object.keys(result).length > 0) return result;
    }

    const generalMsg =
      responseData.message || responseData.detail || null;

    if (generalMsg) {
      result._general = [generalMsg];
    }

    return result;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await onRegister(form);
      
    } catch (err) {
      const responseData =
        err?.data ?? err?.response?.data ?? null;

      const parsed = parseBackendErrors(responseData);

      if (Object.keys(parsed).length > 0) {
        setErrors(parsed);
      } else {
        setErrors({ _general: ['Реєстрація не вдалася. Спробуйте ще раз.'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldErrors = ({ field }) => {
    const messages = errors[field];
    if (!messages || messages.length === 0) return null;
    return (
      <ul className="field-errors" aria-live="polite">
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    );
  };

  const hasFieldError = field =>
    Boolean(errors[field] && errors[field].length > 0);

  return (
    <div className="auth-page">
      <h2>Реєстрація</h2>

      {/* General / non-field errors */}
      {errors._general && errors._general.length > 0 && (
        <div className="alert alert--error" role="alert" aria-live="assertive">
          {errors._general.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={`form-group ${hasFieldError('name') ? 'form-group--error' : ''}`}>
          <input
            name="name"
            type="text"
            placeholder="Ім'я"
            value={form.name}
            onChange={handleChange}
            aria-invalid={hasFieldError('name')}
            aria-describedby={hasFieldError('name') ? 'name-errors' : undefined}
            disabled={isSubmitting}
          />
          <div id="name-errors">
            <FieldErrors field="name" />
          </div>
        </div>

        <div className={`form-group ${hasFieldError('email') ? 'form-group--error' : ''}`}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={hasFieldError('email')}
            aria-describedby={hasFieldError('email') ? 'email-errors' : undefined}
            disabled={isSubmitting}
          />
          <div id="email-errors">
            <FieldErrors field="email" />
          </div>
        </div>

        <div className={`form-group ${hasFieldError('password') ? 'form-group--error' : ''}`}>
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            aria-invalid={hasFieldError('password')}
            aria-describedby={hasFieldError('password') ? 'password-errors' : undefined}
            disabled={isSubmitting}
          />
          <div id="password-errors">
            <FieldErrors field="password" />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Реєстрація…' : 'Зареєструватися'}
        </button>
      </form>

      <small > Пароль має містити щонайменше 6 символів, одну велику літеру, одну малу літеру та один спеціальний символ (наприклад @). </small>

      <p>
        Вже є акаунт?{' '}
        <span onClick={() => navigate('/login')}>Увійти</span>
      </p>
    </div>
  );
}

export default RegisterPage;