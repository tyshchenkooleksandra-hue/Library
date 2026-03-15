import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
console.log(process.env.REACT_APP_API_URL);
    fetch(`${API_URL}/api/books`)
      .then(async res => {
        const text = await res.text();
        console.log(text); 
        return JSON.parse(text);
      })
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Books</h1>

      {books.map(book => (
        <div key={book.id}>
          {book.title}
        </div>
      ))}
    </div>
  );
}

export default App;