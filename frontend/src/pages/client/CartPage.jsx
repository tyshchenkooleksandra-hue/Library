import React, { useState } from 'react';

const CartPage = ({ cart, setCart, onBack, user }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    cart.forEach(item => { init[item.cartId] = 1; });
    return init;
  });

  const PROMO_CODES = { 'BOOKS10': 10, 'SALE20': 20, 'FIRST15': 15 };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    setQuantities(prev => { const n = { ...prev }; delete n[cartId]; return n; });
  };

  const changeQty = (cartId, delta) => {
    setQuantities(prev => {
      const next = (prev[cartId] || 1) + delta;
      if (next < 1) return prev;
      return { ...prev, [cartId]: next };
    });
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoError('');
    } else {
      setPromoError('Невірний промокод');
      setDiscount(0);
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = quantities[item.cartId] || 1;
    return sum + price * qty;
  }, 0);

  const discountAmount = (subtotal * discount) / 100;
  const delivery = subtotal > 500 ? 0 : 59;
  const total = subtotal - discountAmount + delivery;

  const handleOrder = () => {
    if (!user) { alert('Будь ласка, увійдіть щоб оформити замовлення'); return; }
    setOrderPlaced(true);
    setCart([]);
  };

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <div className="cart-success-box">
          <div className="cart-success-icon">🎉</div>
          <h2 className="cart-success-title">Замовлення оформлено!</h2>
          <p className="cart-success-text">
            Дякуємо, <strong>{user?.name || user?.email}</strong>! Ваші книги вже в дорозі 📦
          </p>
          <button onClick={onBack} className="cart-back-btn">
            ← Повернутись до магазину
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button onClick={onBack} className="cart-back-link">← Магазин</button>
        <h1 className="cart-title">🛒 Кошик</h1>
        <span className="cart-item-count">{cart.length} книг</span>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty-box">
          <div className="cart-empty-icon">📭</div>
          <h3 className="cart-empty-title">Кошик порожній</h3>
          <p className="cart-empty-text">Додайте книги, які вас зацікавили</p>
          <button onClick={onBack} className="cart-back-btn">Перейти до магазину</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-col">
            {cart.map(item => (
              <div key={item.cartId} className="cart-card">
                <div className="cart-cover-wrap">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="cart-cover" />
                  ) : (
                    <div className="cart-cover-placeholder">📖</div>
                  )}
                </div>

                <div className="cart-info">
                  <h3 className="cart-book-title">{item.title}</h3>
                  <p className="cart-author">{item.author}</p>
                  {item.genre && <span className="cart-genre">{item.genre}</span>}
                  <div className="cart-price-row">
                    <span className="cart-price">
                      {parseFloat(item.price) ? `${item.price} ₴` : 'Ціна не вказана'}
                    </span>
                    {discount > 0 && parseFloat(item.price) && (
                      <span className="cart-saved-badge">-{discount}%</span>
                    )}
                  </div>
                </div>

                <div className="cart-controls">
                  <div className="cart-qty-row">
                    <button onClick={() => changeQty(item.cartId, -1)} className="cart-qty-btn">−</button>
                    <span className="cart-qty-num">{quantities[item.cartId] || 1}</span>
                    <button onClick={() => changeQty(item.cartId, +1)} className="cart-qty-btn">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.cartId)} className="cart-remove-btn">
                    🗑 Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-col">
            <div className="cart-summary-box">
              <h2 className="cart-summary-title">Підсумок</h2>

              <div className="cart-summary-row">
                <span>Товари ({cart.length})</span>
                <span>{subtotal.toFixed(2)} ₴</span>
              </div>

              {discount > 0 && (
                <div className="cart-summary-row cart-summary-row--discount">
                  <span>Знижка ({discount}%)</span>
                  <span>−{discountAmount.toFixed(2)} ₴</span>
                </div>
              )}

              <div className="cart-summary-row">
                <span>Доставка</span>
                <span>
                  {delivery === 0
                    ? <span className="cart-free-delivery">Безкоштовно</span>
                    : `${delivery} ₴`}
                </span>
              </div>

              <div className="cart-divider" />

              <div className="cart-total-row">
                <span>Разом</span>
                <span className="cart-total-price">{total.toFixed(2)} ₴</span>
              </div>

              <div className="cart-promo-row">
                <input
                  className="cart-promo-input"
                  placeholder="Промокод"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyPromo()}
                />
                <button onClick={applyPromo} className="cart-promo-btn">OK</button>
              </div>
              {promoError && <p className="cart-promo-error">{promoError}</p>}
              {discount > 0 && <p className="cart-promo-success">✅ Знижку {discount}% застосовано!</p>}

              <button onClick={handleOrder} className="cart-order-btn">
                Оформити замовлення
              </button>

              {!user && (
                <p className="cart-login-hint">⚠️ Увійдіть, щоб оформити замовлення</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;