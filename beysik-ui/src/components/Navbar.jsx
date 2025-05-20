import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import '../styles/navbar.css';
import Badge from '@mui/material/Badge';
import hLogo from '../assets/Logo/hLogo.png'; // Import the image
import CartModal from './cartModal.jsx';

function Navbar({ cartItems = [], cartOpen, setCartOpen, onRemoveItem, onCheckout }) {
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          <div className="navbar-actions">
            <IconButton aria-label="search" className="icon-button">
              <SearchIcon />
            </IconButton>
          </div>
         
          <nav className="navbar-links">
            <Link to="/new-arrivals" className="nav-link">New Arrivals</Link>
            <Link to="/basics" className="nav-link">Basics</Link>
          </nav>

           <div className="navbar-brand">
            <Link to="/" className="navbar-logo"><img src={hLogo} alt="Beysik" /></Link> {/* Use the imported image */}
          </div>

          <nav className="navbar-links">
            <Link to="/collections" className="nav-link">Collections</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>
          
          <div className="navbar-actions">
            <IconButton aria-label="account" className="icon-button">
              <AccountCircleOutlinedIcon />
            </IconButton>
            <IconButton aria-label="cart" className="icon-button" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </div>
        </div>
      </header>
      <CartModal 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cartItems} 
        onRemoveItem={onRemoveItem} 
        onCheckout={onCheckout} 
      />
    </>
  );
}

export default Navbar;