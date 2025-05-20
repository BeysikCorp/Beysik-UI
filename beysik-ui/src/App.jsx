import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NewArrivals from './pages/NewArrivals';
import Basics from './pages/Basics';
import Collections from './pages/Collections';
import About from './pages/About'; 
import Navbar from './components/Navbar';
import './styles/global.css';
import ProductDetailsPage from './pages/ProductDetails';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart handler
  const addToCart = (item) => {
    setCartItems(prev => {
      // Check if item (same id, size, color) already exists
      const idx = prev.findIndex(
        i => i.id === item.id && i.size === item.size && i.color === item.color
      );
      if (idx > -1) {
        // Update quantity
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    setCartOpen(true); // Open cart modal
  };

  // Remove item handler
  const removeFromCart = (idx) => {
    setCartItems(prev => prev.filter((_, i) => i !== idx));
  };

  // Update quantity handler
  const handleUpdateQuantity = (idx, newQty) => {
    setCartItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, quantity: Math.max(1, newQty) } : item
      )
    );
  };

  // Checkout handler (implement as needed)
  const handleCheckout = () => {
    alert('Proceeding to checkout!');
    setCartOpen(false);
  };

  return (
    <Router>
      <Navbar
        cartItems={cartItems}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/basics" element={<Basics />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/product/:productId"
          element={<ProductDetailsPage addToCart={addToCart} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
