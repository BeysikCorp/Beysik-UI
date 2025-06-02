import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCart as apiGetCart, 
  addItemToCart as apiAddItemToCart, 
  updateCartItem as apiUpdateCartItemQuantity, 
  removeCartItem as apiRemoveItemFromCart,
  clearCart as apiClearCart
} from '../services/cartService';
import { useAuth } from './AuthContext'; // To get user token

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, getAccessToken } = useAuth(); // Assuming user object has an ID

  // Fetch cart from backend when user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        setError(null);
        try {
          const token = await getAccessToken();
          const cart = await apiGetCart(token);
          setCartItems(cart.items || []); // Assuming cart has an 'items' array
        } catch (err) {
          console.error("Failed to load cart:", err);
          setError(err.message || "Failed to load cart.");
          // Don't clear local cart on load failure, user might have added items as guest
        } finally {
          setLoading(false);
        }
      } else {
        // Handle guest cart - load from localStorage or initialize empty
        const localCart = localStorage.getItem('guestCart');
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }
    };
    loadCart();
  }, [isAuthenticated, user, getAccessToken]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated && user) {
        const token = await getAccessToken();
        // Ensure product has id, price. Backend might need productId, quantity.
        // The cartService.addItemToCart expects (itemId, quantity, token)
        // We need to adapt 'product' to 'itemId'
        const cartItem = { productId: product.id, name: product.name, price: product.price, quantity, imageUrl: product.image };
        const updatedCart = await apiAddItemToCart(product.id, quantity, token);
        setCartItems(updatedCart.items || []);
      } else {
        // Guest cart:
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id && item.size === product.size); // Assuming product has id and size for uniqueness
          if (existingItem) {
            return prevItems.map(item =>
              item.id === product.id && item.size === product.size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prevItems, { ...product, quantity }]; // product should contain all necessary details (id, name, price, image, size, etc.)
        });
      }
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      setError(err.message || "Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated && user) {
        const token = await getAccessToken();
        const updatedCart = await apiUpdateCartItemQuantity(itemId, quantity, token);
        setCartItems(updatedCart.items || []);
      } else {
        // Guest cart:
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item // Assuming itemId is product.id for guest cart
          ).filter(item => item.quantity > 0) // Remove if quantity is 0
        );
      }
    } catch (err) {
      console.error("Failed to update item quantity:", err);
      setError(err.message || "Failed to update quantity.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated && user) {
        const token = await getAccessToken();
        const updatedCart = await apiRemoveItemFromCart(itemId, token);
        setCartItems(updatedCart.items || []);
      } else {
        // Guest cart:
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId)); // Assuming itemId is product.id
      }
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      setError(err.message || "Failed to remove item.");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated && user) {
        const token = await getAccessToken();
        await apiClearCart(token); // Assuming this returns the cleared (empty) cart or success
        setCartItems([]);
      } else {
        // Guest cart:
        setCartItems([]);
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError(err.message || "Failed to clear cart.");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to merge guest cart to backend cart on login
  const mergeGuestCartOnLogin = async () => {
    const localCart = localStorage.getItem('guestCart');
    if (localCart) {
      const guestItems = JSON.parse(localCart);
      if (guestItems.length > 0 && isAuthenticated && user) {
        setLoading(true);
        try {
          const token = await getAccessToken();
          // A more sophisticated merge would be to call addItemToCart for each guest item.
          // For simplicity, this example might just try to add them one by one.
          // Or, your backend might have a "merge" endpoint.
          // For now, let's assume we iterate and add.
          let currentCartItems = [...cartItems]; // Items already fetched from backend
          for (const guestItem of guestItems) {
            // Check if item already exists in backend cart (simple check by id and size)
            const existingBackendItem = currentCartItems.find(ci => ci.productId === guestItem.id && ci.size === guestItem.size);
            if (existingBackendItem) {
              // If exists, maybe update quantity (this logic can get complex)
              // For now, let's assume backend handles duplicates or we prioritize backend state
            } else {
              // If not exists, add it
              const updatedCart = await apiAddItemToCart(guestItem.id, guestItem.quantity, token);
              currentCartItems = updatedCart.items || []; // update currentCartItems with the response
            }
          }
          setCartItems(currentCartItems); // Set the final merged cart
          localStorage.removeItem('guestCart'); // Clear guest cart after successful merge
        } catch (err) {
          console.error("Failed to merge guest cart:", err);
          // Decide on error handling: keep guest cart? notify user?
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // Call mergeGuestCartOnLogin when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      mergeGuestCartOnLogin();
    }
  }, [isAuthenticated, user]);


  const cartContextValue = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
    error,
    itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
