const API_URL = process.env.REACT_APP_API_URL;

export async function getBooks(page = 1, limit = 6) {
  const response = await fetch(
    `${API_URL}/api/books?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to load books');
  }

  return await response.json();
}

export async function searchBooks(search = '') {
  const term = search.trim();

  if (!term) return [];

  const [byTitle, byAuthor] = await Promise.all([
    fetch(`${API_URL}/api/books/search?title=${encodeURIComponent(term)}`).then(r => r.json()),
    fetch(`${API_URL}/api/books/search?author=${encodeURIComponent(term)}`).then(r => r.json()),
  ]);

  const merged = [...byTitle];

  for (const book of byAuthor) {
    if (!merged.some(b => b.id === book.id)) {
      merged.push(book);
    }
  }

  return merged;
}