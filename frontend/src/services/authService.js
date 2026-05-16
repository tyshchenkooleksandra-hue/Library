const API_URL = process.env.REACT_APP_API_URL;

export async function login(email, password) {

  const response = await fetch(
    `${API_URL}/api/Auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function register(form) {

  const response = await fetch(
    `${API_URL}/api/Auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    }
  );

  const data = await response.json();

  if (!response.ok) {

    if (data.errors) {
      const validationMessages = Object.values(data.errors)
        .flat()
        .join(', ');

      throw new Error(validationMessages);
    }

    throw new Error(data.message || 'Registration failed');
  }

  return data;
}
