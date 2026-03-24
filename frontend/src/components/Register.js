import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Паролі не співпадають!");
      return;
    }
    console.log("Register:", form);
    alert(`Зареєструвались як: ${form.username}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Реєстрація</h2>

      <input
        name="username"
        placeholder="Username"
        value={form.username}
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
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Повторіть пароль"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <button type="submit">Зареєструватися</button>
    </form>
  );
}

export default Register;