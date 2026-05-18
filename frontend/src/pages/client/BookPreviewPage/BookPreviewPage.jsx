import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultBookImage from "../../../assets/default-book.jpg";
import "./BookPreviewPage.css";

const BookPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/Books/${id}`
        );
        if (!response.ok) throw new Error("Book not found");
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="preview-loading-wrapper">
        <div className="preview-spinner" />
        <p className="preview-loading-text">Loading book...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="preview-loading-wrapper">
        <p className="preview-loading-text">Book not found</p>
        <button
          className="preview-back-btn"
          onClick={() => navigate("/librarypage")}
        >
          ← Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="preview-page">
      <div className="preview-header">
        <button
          className="preview-back-btn"
          onClick={() => navigate("/librarypage")}
        >
          ← Back to Library
        </button>
      </div>

      <div className="preview-card">
        <div className="preview-image-col">
          <img
            src={book.imageUrl || DefaultBookImage}
            alt={book.title}
            className="preview-cover-img"
          />
          <div
            className={
              book.isAvailable
                ? "preview-badge preview-badge--available"
                : "preview-badge preview-badge--unavailable"
            }
          >
            {book.isAvailable ? "✓ Available" : "✗ Unavailable"}
          </div>
        </div>

        <div className="preview-info-col">
          <h1 className="preview-title">{book.title}</h1>

          <div className="preview-meta-row">
            <span className="preview-meta-label">Author</span>
            <span className="preview-meta-value">{book.author}</span>
          </div>

          <div className="preview-divider" />

          <div className="preview-meta-row">
            <span className="preview-meta-label">Genre</span>
            <span className="preview-meta-value">{book.genreName}</span>
          </div>

          <div className="preview-divider" />

          {book.year && (
            <>
              <div className="preview-meta-row">
                <span className="preview-meta-label">Year</span>
                <span className="preview-meta-value">{book.year}</span>
              </div>
              <div className="preview-divider" />
            </>
          )}

          <div className="preview-desc-section">
            <span className="preview-meta-label">Description</span>
            <p className="preview-description">{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPreviewPage;