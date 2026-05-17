import React from 'react';

const BookPreviewModal = ({ book, onClose, onAddToCart, isClientMode }) => {
  if (!book) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="preview-modal" onClick={e => e.stopPropagation()}>

        {/* Шапка */}
        <div className="preview-modal__header">
          <div className="preview-modal__cover-wrap">
            <img src={book.image} alt={book.title} className="preview-modal__cover" />
          </div>
          <button className="preview-modal__close" onClick={onClose}>×</button>
        </div>

        {/* Вміст */}
        <div className="preview-modal__body">
          <h2 className="preview-modal__title">{book.title}</h2>
          <p className="preview-modal__author">{book.author}</p>

          <div className="preview-modal__stats">
            <div className="preview-modal__stat preview-modal__stat--green">
              <span className="preview-modal__stat-label">Ціна</span>
              <span className="preview-modal__stat-value preview-modal__stat-value--green">{book.price} ₴</span>
            </div>
            <div className="preview-modal__stat preview-modal__stat--gray">
              <span className="preview-modal__stat-label">На складі</span>
              <span className="preview-modal__stat-value">{book.stock} <small>шт.</small></span>
            </div>
          </div>

          <div className="preview-modal__desc-block">
            <span className="preview-modal__desc-label">Опис</span>
            <p className="preview-modal__desc">{book.description || 'Опис відсутній.'}</p>
          </div>
        </div>

        {/* Кнопки */}
        <div className="preview-modal__footer">
          {isClientMode && (
            <button
              className="btn-primary preview-modal__cart-btn"
              onClick={() => { onAddToCart(book); onClose(); }}
            >
              🛒 Додати в кошик
            </button>
          )}
          <button className="preview-modal__close-btn" onClick={onClose}>
            Закрити
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookPreviewModal;