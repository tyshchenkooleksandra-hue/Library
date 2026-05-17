const API_URL =
  process.env.REACT_APP_API_URL;

export async function register(data) {

  const response =
    await fetch(
      `${API_URL}/api/auth/register`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify(data)
      }
    );

  if (!response.ok) {

    let errorData = null;

    try {

      errorData =
        await response.json();

    } catch {

      errorData = null;
    }

    const error =
      new Error(
        'Registration failed'
      );

    error.data =
      errorData;

    throw error;
  }

  return await response.json();
}

export async function login(data) {

  const response =
    await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify(data)
      }
    );

  const result =
    await response.json();

  if (!response.ok) {

    throw new Error(
      result.message ||
      'Login failed'
    );
  }

  return result;
}
