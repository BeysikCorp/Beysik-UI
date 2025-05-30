import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import '../styles/navbar.css';
import hLogo from '../assets/Logo/hLogo.png';
import CartModal from './cartModal.jsx';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { 
    cartItems, 
    itemCount, 
  } = useCart();

  const navigate = useNavigate();
  
  // For account menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // State for CartModal visibility
  
  const handleOpenCartModal = () => {
    setIsCartModalOpen(true);
  };
  
  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };
  
  const handleCheckout = () => {
    handleCloseCartModal();
    navigate('/checkout'); // Navigate to checkout page
  };

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
            <Link to="/" className="navbar-logo"><img src={hLogo} alt="Beysik" /></Link>
          </div>

          <nav className="navbar-links">
            <Link to="/collections" className="nav-link">Collections</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>
          
          <div className="navbar-actions">
            <IconButton 
              aria-label="account"
              className="icon-button"
              onClick={handleAccountClick}
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'account-button',
              }}
            >
              {user ? (
                <>
                  <MenuItem onClick={handleClose}>
                    <Link to="/profile" className="menu-link">Profile</Link>
                  </MenuItem>
                  {isAdmin && isAdmin() && (
                    <MenuItem onClick={handleClose}>
                      <Link to="/admin" className="menu-link">Admin Dashboard</Link>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleClose}>
                    <Link to="/login" className="menu-link">Login</Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link to="/signup" className="menu-link">Sign Up</Link>
                  </MenuItem>
                </>
              )}
            </Menu>
            <IconButton aria-label="cart" className="icon-button" onClick={handleOpenCartModal}>
              <Badge badgeContent={itemCount} color="primary"> {/* Use itemCount from CartContext */}
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </div>
        </div>
      </header>
      {/* CartModal now manages its data via CartContext */}
      <CartModal 
        isOpen={isCartModalOpen} 
        onClose={handleCloseCartModal} 
        onCheckout={handleCheckout} // Pass checkout handler
        // cartItems, onRemoveItem, onUpdateQuantity are no longer passed as props
        // They will be accessed from CartContext within CartModal itself
      />
    </>
  );
}

export default Navbar;