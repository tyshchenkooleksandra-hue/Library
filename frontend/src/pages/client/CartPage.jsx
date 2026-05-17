import {
  useEffect,
  useState
} from 'react';

import {
  getCart
} from '../../services/cartService';

import {
  confirmReservation
} from '../../services/reservationService';

import DefaultBookImage
  from '../../assets/default-book.jpg';

const CartPage = ({
  user,
  onBack
}) => {

  const [cart, setCart] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [borrowSuccess,
    setBorrowSuccess] =
      useState(false);

  const [tooltip, setTooltip] =
    useState({
      show: false,
      message: '',
      type: 'success'
    });

  const [deliveryAddress,
    setDeliveryAddress] =
      useState('');

  const [phoneNumber,
    setPhoneNumber] =
      useState('');

  useEffect(() => {

    const loadCart =
      async () => {

        try {

          const data =
            await getCart(
              user.token
            );

          setCart(data);

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    loadCart();

  }, [user]);

  const removeFromCart =
    cartId => {

      setCart(prev =>
        prev.filter(
          item =>
            item.id !== cartId
        )
      );

      setTooltip({
        show: true,
        message:
          'Book removed from reservation list',
        type: 'success'
      });

      setTimeout(() => {

        setTooltip({
          show: false,
          message: '',
          type: 'success'
        });

      }, 3000);
    };

  const handleBorrow =
    async () => {

if (
  !deliveryAddress.trim()
) {

  setTooltip({
    show: true,
    message:
      'Delivery address is required',
    type: 'error'
  });

  setTimeout(() => {

    setTooltip({
      show: false,
      message: '',
      type: 'success'
    });

  }, 3000);

  return;
}

  if (
    !phoneNumber.trim()
  ) {

    setTooltip({
      show: true,
      message:
        'Phone number is required',
      type: 'error'
    });

    setTimeout(() => {

      setTooltip({
        show: false,
        message: '',
        type: 'success'
      });

    }, 3000);

    return;
  }

      try {

        await confirmReservation(
          user.token
        );

        setBorrowSuccess(true);

        setCart([]);

      } catch (error) {

        console.error(error);

        setTooltip({
          show: true,
          message:
            error.message,
          type: 'error'
        });

        setTimeout(() => {

          setTooltip({
            show: false,
            message: '',
            type: 'success'
          });

        }, 3000);
      }
    };

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    );
  }

  if (borrowSuccess) {

    return (

      <div className="cart-page">

        <div className="cart-success-box">

          <div className="cart-success-icon">
            📚
          </div>

          <h2 className="cart-success-title">
            Reservation Confirmed
          </h2>

          <p className="cart-success-text">

            Thank you,
            {' '}

            <strong>
              {user?.email}
            </strong>

            ! Your books were
            successfully reserved.

          </p>

          <p className="cart-success-text">

            Delivery address:
            {' '}

            <strong>
              {deliveryAddress}
            </strong>

          </p>

          <p className="cart-success-text">

            Phone number:
            {' '}

            <strong>
              {phoneNumber}
            </strong>

          </p>

          <button
            onClick={onBack}
            className="cart-back-btn"
          >
            ← Return to Library
          </button>

        </div>

      </div>
    );
  }

  return (

    <div className="cart-page">

      {tooltip.show && (

        <div
          className={
            tooltip.type === 'success'
              ? 'cart-tooltip success'
              : 'cart-tooltip error'
          }
        >
          {tooltip.message}
        </div>
      )}

      <div className="cart-header">

        <button
          onClick={onBack}
          className="cart-back-link"
        >
          ← Library
        </button>

        <h1 className="cart-title">
          📚 Reserved Books
        </h1>

        <span className="cart-item-count">
          {cart.length}
          {' '}
          books
        </span>

      </div>

      {cart.length === 0 ? (

        <div className="cart-empty-box">

          <div className="cart-empty-icon">
            📭
          </div>

          <h3 className="cart-empty-title">
            No Reserved Books
          </h3>

          <p className="cart-empty-text">
            Add books from catalog
            to reserve them
          </p>

          <button
            onClick={onBack}
            className="cart-back-btn"
          >
            Browse Catalog
          </button>

        </div>

      ) : (

        <div className="cart-layout">

          <div className="cart-items-col">

            {cart.map(item => (

              <div
                key={item.id}
                className="cart-card"
              >

                <div className="cart-cover-wrap">

                  <img
                    src={
                      item.imageUrl ||
                      DefaultBookImage
                    }
                    alt={item.title}
                    className="cart-cover"
                  />

                </div>

                <div className="cart-info">

                  <h3 className="cart-book-title">
                    {item.title}
                  </h3>

                  <p className="cart-author">
                    {item.author}
                  </p>

                </div>

                <div className="cart-controls">

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                    className="cart-remove-btn"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          <div className="cart-summary-col">

            <div className="cart-summary-box">

              <h2 className="cart-summary-title">
                Reservation Summary
              </h2>

              <div className="cart-summary-row">

                <span>
                  Reserved books
                </span>

                <span>
                  {cart.length}
                </span>

              </div>

              <div className="cart-divider" />

              <div className="cart-summary-row">

                <span>
                  Subscription status
                </span>

                <span>
                  Active
                </span>

              </div>

              <div className="cart-delivery-form">

                <input
                  type="text"
                  required
                  placeholder="Delivery Address"
                  value={deliveryAddress}
                  onChange={e =>
                    setDeliveryAddress(
                      e.target.value
                    )
                  }
                  className="cart-input"
                />

                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={e =>
                    setPhoneNumber(
                      e.target.value
                    )
                  }
                  className="cart-input"
                />

              </div>

              <button
                onClick={handleBorrow}
                className="cart-order-btn"
              >
                Confirm Reservation
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default CartPage;
