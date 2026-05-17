const API_URL =
  process.env.REACT_APP_API_URL;

export async function addToCart(
  token,
  bookId
) {

  const response =
    await fetch(
      `${API_URL}/api/cart/add`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          bookId
        })
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ||
      'Failed to add book'
    );
  }

  return data;
}

export async function getCart(
  token
) {

  const response =
    await fetch(
      `${API_URL}/api/cart`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      'Failed to load cart'
    );
  }

  return data.data;
}
