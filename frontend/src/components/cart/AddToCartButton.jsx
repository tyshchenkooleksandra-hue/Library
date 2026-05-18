const AddToCartButton = ({
  book,
  onAddToCart
}) => {
  return (
    <button
      className="book-button"
      disabled={!book.isAvailable}
      onClick={() => onAddToCart(book)}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;