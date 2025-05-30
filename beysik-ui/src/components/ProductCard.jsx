
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/product-pages.css';

const ProductCard = ({ product }) => {
  if (!product) {
    return null; // Or some placeholder/error display
  }

  const productId = product._id || product.id; 
  const imageUrl = product.imageUrl || product.listingImage || '/placeholder-image.jpg'; 

  return (
    <div className="product-card">
      <Link to={`/product/${productId}`} className="product-link">
        <div className="product-image-container">
          <img
            src={imageUrl}
            alt={product.name || 'Product image'}
            className="product-image"
            loading="lazy"
          />
        </div>
        <div className="product-content">
          <h3 className="product-name">{product.name || 'Unnamed Product'}</h3>
          {typeof product.price === 'number' && (
            <p className="product-price">${product.price.toFixed(2)}</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
