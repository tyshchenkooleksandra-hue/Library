import { useState } from 'react';

import { useNavigate }
  from 'react-router-dom';

import {
  register
} from '../../services/authService';

function RegisterPage() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });

  const [errors, setErrors] =
    useState({});

  const [success, setSuccess] =
    useState('');

  const [isSubmitting,
    setIsSubmitting] =
      useState(false);

  const handleChange = e => {

    const { name, value } =
      e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {

      setErrors(prev => {

        const next = {
          ...prev
        };

        delete next[name];

        return next;
      });
    }
  };

  const parseBackendErrors =
    responseData => {

      const result = {};

      if (!responseData) {
        return result;
      }

      if (Array.isArray(responseData)) {

        responseData.forEach(error => {

          if (
            error.description
          ) {

            if (
              !result._general
            ) {

              result._general = [];
            }

            result._general.push(
              error.description
            );
          }
        });

        return result;
      }

      if (
        responseData.errors &&
        typeof responseData.errors
          === 'object'
      ) {

        Object.entries(
          responseData.errors
        ).forEach(
          ([field, messages]) => {

            result[field] =
              Array.isArray(messages)
                ? messages
                : [String(messages)];
          }
        );

        return result;
      }

      const generalMsg =
        responseData.message ||
        responseData.detail ||
        null;

      if (generalMsg) {

        result._general = [
          generalMsg
        ];
      }

      return result;
    };


  const handleSubmit =
    async e => {

      e.preventDefault();

      setErrors({});
      setSuccess('');

      setIsSubmitting(true);

      try {

        await register(form);

        setSuccess(
          'Registration successful! Please confirm your email.'
        );

        setTimeout(() => {

          navigate(
            '/check-email'
          );

        }, 1500);

      } catch (err) {

        console.error(err);

        const responseData =
          err?.data ??
          err?.response?.data ??
          null;

        const parsed =
          parseBackendErrors(
            responseData
          );

        if (
          Object.keys(parsed)
            .length > 0
        ) {

          setErrors(parsed);

        } else {

          setErrors({
            _general: [
              'Registration failed. Please try again.'
            ]
          });
        }

      } finally {

        setIsSubmitting(false);
      }
    };

  const FieldErrors =
    ({ field }) => {

      const messages =
        errors[field];

      if (
        !messages ||
        messages.length === 0
      ) {
        return null;
      }

      return (
        <ul
          className="field-errors"
        >
          {messages.map(
            (msg, i) => (
              <li key={i}>
                {msg}
              </li>
            )
          )}
        </ul>
      );
    };

  const hasFieldError =
    field =>
      Boolean(
        errors[field] &&
        errors[field].length > 0
      );

  return (

    <div className="auth-page">

      <h2>
        Register
      </h2>

      {errors._general &&
        errors._general.length > 0 && (

        <div className="auth-error">

          {errors._general.map(
            (msg, i) => (
              <p key={i}>
                {msg}
              </p>
            )
          )}

        </div>
      )}

      {success && (

        <div className="auth-success">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
      >

        <div
          className={
            hasFieldError(
              'firstName'
            )
              ? 'form-group form-group--error'
              : 'form-group'
          }
        >

          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            disabled={
              isSubmitting
            }
          />

          <FieldErrors
            field="firstName"
          />

        </div>

        <div
          className={
            hasFieldError(
              'lastName'
            )
              ? 'form-group form-group--error'
              : 'form-group'
          }
        >

          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            disabled={
              isSubmitting
            }
          />

          <FieldErrors
            field="lastName"
          />

        </div>

        <div
          className={
            hasFieldError(
              'email'
            )
              ? 'form-group form-group--error'
              : 'form-group'
          }
        >

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={
              isSubmitting
            }
          />

          <FieldErrors
            field="email"
          />

        </div>

        <div
          className={
            hasFieldError(
              'password'
            )
              ? 'form-group form-group--error'
              : 'form-group'
          }
        >

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={
              isSubmitting
            }
          />

          <FieldErrors
            field="password"
          />

        </div>

        <button
          type="submit"
          disabled={
            isSubmitting
          }
        >
          {
            isSubmitting
              ? 'Registering...'
              : 'Register'
          }
        </button>

      </form>

      <small>

        Password must contain
        at least 6 characters,
        one uppercase letter,
        one lowercase letter
        and one special symbol.

      </small>

      <p>

        Already have an account?
        {' '}

        <span
          style={{
            cursor: 'pointer',
            color: 'blue'
          }}
          onClick={() =>
            navigate('/login')
          }
        >
          Login
        </span>

      </p>

    </div>
  );
}

export default RegisterPage;

