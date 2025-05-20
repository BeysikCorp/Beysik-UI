import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cartModal.css';

const CartModal = ({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveItem,
  onCheckout,
  onUpdateQuantity, // <-- Add this prop
}) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    onClose();
    navigate(`/product/${id}`);
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
        <button className="cart-modal-close" onClick={onClose} aria-label="Close Cart">&times;</button>
        <h2>Cart</h2>
        {cartItems && cartItems.length > 0 ? (
          <>
            <ul className="cart-modal-items">
              {cartItems.map((item, idx) => (
                <li key={idx} className="cart-modal-item">
                  <div
                    className="cart-modal-item-link"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <img src={item.image} alt={item.name} className="cart-modal-item-image" />
                    <div>
                      <p>{item.name}</p>
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          className="cart-modal-qty-btn"
                          onClick={e => {
                            e.stopPropagation();
                            onUpdateQuantity && onUpdateQuantity(idx, item.quantity - 1);
                          }}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >-</button>
                        <span>Qty: {item.quantity}</span>
                        <button
                          className="cart-modal-qty-btn"
                          onClick={e => {
                            e.stopPropagation();
                            onUpdateQuantity && onUpdateQuantity(idx, item.quantity + 1);
                          }}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  {onRemoveItem && (
                    <button
                      className="cart-modal-remove"
                      onClick={() => onRemoveItem(idx)}
                      aria-label={`Remove ${item.name}`}
                    >
                      &times;
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="cart-modal-total">
              <strong>Total:</strong> ${total.toFixed(2)}
            </div>
            <button
              className="cart-modal-checkout"
              onClick={onCheckout}
              disabled={cartItems.length === 0}
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