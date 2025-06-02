import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cartModal.css';
import { useCart } from '../context/CartContext'; // Import useCart

const CartModal = ({
  isOpen,
  onClose,
  onCheckout, // Keep onCheckout as it involves navigation handled by Navbar/parent
}) => {
  const {
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    loading,
    error,
  } = useCart(); // Use cart data and functions from context

  const navigate = useNavigate();

  const handleItemClick = (id) => {
    onClose(); // Close modal before navigating
    navigate(`/product/${id}`);
  };

  // Handle quantity change, ensuring quantity is at least 1
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    } else if (newQuantity === 0) {
      // Optionally, remove item if quantity becomes 0, or just prevent going below 1
      // For this example, let's assume updateQuantity handles 0 as removal or backend does.
      // Or, explicitly call removeFromCart if that's the desired UX.
      removeFromCart(itemId); // If quantity is 0, remove the item
    }
  };

  return (
    <div
      className={`cart-modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <aside
        className={`cart-modal ${isOpen ? 'open' : ''}`}
        onClick={e => e.stopPropagation()}
        aria-modal="true"
        role="dialog"
      >
        <button className="cart-modal-close" onClick={e => {e.stopPropagation(); onClose();}} aria-label="Close Cart">&times;</button>
        <h2>Cart</h2>
        {loading && <p>Loading cart...</p>}
        {error && <p className="cart-modal-error">Error: {error}</p>}
        {!loading && !error && cartItems && cartItems.length > 0 ? (
          <>
            <ul className="cart-modal-items">
              {cartItems.map((item) => ( // item.id should be the unique identifier for the cart item from backend
                <li key={item.id || item.productId} className="cart-modal-item"> {/* Use item.id or item.productId from backend as key */}
                  <div
                    className="cart-modal-item-link"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                    onClick={() => handleItemClick(item.productId || item.id)} // Use productId or id from item for navigation
                  >
                    <img src={item.imageUrl || item.image} alt={item.name} className="cart-modal-item-image" /> {/* Use item.imageUrl or item.image */}
                    <div>
                      <p>{item.name}</p>
                      {/* Color and Size might not be available on all cart items depending on backend DTO */}
                      {item.color && <p>Color: {item.color}</p>}
                      {item.size && <p>Size: {item.size}</p>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          className="cart-modal-qty-btn"
                          onClick={e => {
                            e.stopPropagation();
                            // Pass item.id (or the unique cart item ID from backend) and new quantity
                            handleUpdateQuantity(item.id || item.productId, item.quantity - 1);
                          }}
                          disabled={item.quantity <= 1 && !loading} // Disable if quantity is 1 or less, or if loading
                          aria-label="Decrease quantity"
                        >-</button>
                        <span>Qty: {item.quantity}</span>
                        <button
                          className="cart-modal-qty-btn"
                          onClick={e => {
                            e.stopPropagation();
                            // Pass item.id (or the unique cart item ID from backend) and new quantity
                            handleUpdateQuantity(item.id || item.productId, item.quantity + 1);
                          }}
                          disabled={loading} // Disable if loading
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  {/* Use removeFromCart from context, passing item.id or unique cart item ID */}
                  <button
                    className="cart-modal-remove"
                    onClick={() => removeFromCart(item.id || item.productId)}
                    disabled={loading} // Disable if loading
                    aria-label={`Remove ${item.name}`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-modal-total">
              <strong>Total:</strong> ${cartTotal.toFixed(2)} {/* Use cartTotal from context */}
            </div>
            <button
              className="cart-modal-checkout"
              onClick={onCheckout} // onCheckout is passed from Navbar for navigation
              disabled={cartItems.length === 0 || loading} // Disable if cart is empty or loading
            >
              Go to Checkout
            </button>
          </>
        ) : (
          <p className="cart-modal-empty">Your cart is empty.</p>
        )}
      </aside>
    </div>
  );
};

export default CartModal;