import React, {
  useState
} from "react";

import {
  addToCart as addToCartRequest
} from "../../services/cartService";

const AddToCartButton = ({
  book
}) => {

  const [loading, setLoading] =
    useState(false);

  const [tooltip, setTooltip] =
    useState({
      show: false,
      message: "",
      type: "success"
    });

  const addToCart =
    async () => {

      try {

        setLoading(true);

        await addToCartRequest(
          book.id
        );

        setTooltip({
          show: true,
          message:
            `"${book.title}" added to cart`,
          type: "success"
        });

      } catch (error) {

        setTooltip({
          show: true,
          message:
            error.message,
          type: "error"
        });

      } finally {

        setLoading(false);
      }

      setTimeout(() => {

        setTooltip({
          show: false,
          message: "",
          type: "success"
        });

      }, 3000);
    };

  return (
    <>
      {tooltip.show && (

        <div
          className={
            tooltip.type === "success"
              ? "cart-tooltip success"
              : "cart-tooltip error"
          }
        >
          {tooltip.message}
        </div>
      )}

      <button
        className="book-button"
        disabled={
          !book.isAvailable ||
          loading
        }
        onClick={addToCart}
      >
        {
          loading
            ? "Adding..."
            : "Add to Cart"
        }
      </button>
    </>
  );
};

export default AddToCartButton;