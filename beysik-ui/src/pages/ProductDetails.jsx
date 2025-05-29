import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import '../styles/product-details.css';
import { getProductById } from '../services/productService'; // Importing the productService
import { useCart } from '../context/CartContext'; // Assuming you have a CartContext

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart(); // Use the addToCart function from CartContext

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // productId from useParams might be a string, ensure your service handles it or convert to number if needed
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images[0]);
        setSelectedSize(fetchedProduct.availableSizes[0]);
        setSelectedColor(fetchedProduct.availableColors[0].name);
      } catch (err) {
        console.error(`Error fetching product ${productId}:`, err);
        setError(err.message || "Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleThumbnailClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    if (!selectedColor) {
      alert('Please select a color.');
      return;
    }
    // Call the prop function to add to cart
    if (typeof addToCart === 'function') {
      addToCart({
        id: product.id,
        name: product.name,
        image: selectedImage,
        size: selectedSize,
        color: selectedColor,
        quantity,
        price: product.price,
      });
      alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // Add actual wishlist logic here
  };

  if (!product) {
    return (
      <div className="product-page">
        <div className="container">
          <p className="loading-text">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Generate star rating display
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product-page">
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">{product.name}</h2>
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link> &gt;
            <Link to={`/${product.category?.toLowerCase().replace(' ', '-')}`} className="breadcrumb-link">
              {product.category}
            </Link> &gt;
            <span className="breadcrumb-current">{product.name}</span>
          </div>
        </div>

        <div className="product-paper">
          <div className="product-grid">
            {/* Image Gallery */}
            <div className="product-images">
              <div className="main-image">
                <img src={selectedImage} alt={product.name} />
              </div>
              <div className="thumbnails">
                {product.thumbnails.map((thumb, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${product.images[index] === selectedImage ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(product.images[index])}
                  >
                    <img 
                      src={thumb} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info & Actions */}
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="rating-section">
                <div className="rating">
                  {renderRating(product.rating)}
                </div>
                <span className="rating-count">({product.reviewsCount} reviews)</span>
              </div>

              <div className="price">
                ${product.price.toFixed(2)}
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>

              <p className="product-description">{product.description}</p>

              {product.availableColors.length > 0 && (
                <div className="color-selection">
                  <p className="option-label">Color: {selectedColor}</p>
                  <div className="color-options">
                    {product.availableColors.map((color) => (
                      <div
                        key={color.name}
                        className={`color-swatch ${selectedColor === color.name ? 'active' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                      ></div>
                    ))}
                  </div>
                </div>
              )}

              {product.availableSizes.length > 0 && (
                <div className="size-selection">
                  <p className="option-label">Size:</p>
                  <div className="size-select">
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                      {product.availableSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="quantity-selection">
                <p className="option-label">Quantity:</p>
                <input
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock || 10}
                />
              </div>

              <div className="action-buttons">
                <button 
                  className="add-to-cart-btn" 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <AddShoppingCartIcon className="btn-icon" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button className="wishlist-btn" onClick={handleWishlistToggle}>
                  {isWishlisted ? 
                    <FavoriteIcon className="btn-icon filled-heart" /> : 
                    <FavoriteBorderIcon className="btn-icon" />
                  }
                </button>
              </div>

              {product.stock > 0 && product.stock < 10 && (
                <p className="stock-warning">
                  Only {product.stock} left in stock!
                </p>
              )}
            </div>
          </div>

          <div className="divider"></div>

          {/* Product Details Section */}
          <div className="product-details">
            <h3 className="section-title">Product Details</h3>
            <ul className="details-list">
              {product.details.map((detail, index) => (
                <li key={index} className="detail-item">{detail}</li>
              ))}
            </ul>
          </div>

          <div className="divider"></div>

          {/* Reviews Section (Placeholder) */}
          <div className="reviews-section">
            <h3 className="section-title">Customer Reviews</h3>
            <p>Reviews will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;