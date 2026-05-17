const API_URL =
  process.env.REACT_APP_API_URL;

export async function getBooks(
  page = 1,
  limit = 6
) {

  const response =
    await fetch(
      `${API_URL}/api/books?page=${page}&limit=${limit}`
    );

  if (!response.ok) {

    throw new Error(
      'Failed to load books'
    );
  }

  return await response.json();
}
