import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import '../styles/product-details.css';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext'; // Import useCart

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, loading: cartLoading, error: cartError } = useCart(); // Get addToCart and loading/error states from CartContext
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.imageUrl || ''); 
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

  const handleAddToCart = async () => { // Make async if addToCart is async
    if (!product) return;

    // Construct the item to add. 
    // The product object from getProductById should have: id, name, imageUrl, price, size.
    // CartContext's addToCart expects (product, quantity)
    // product should be an object like: { id, name, image, price, size (if applicable) }
    const itemToAdd = {
      id: product.id,
      name: product.name,
      image: product.imageUrl, // Ensure this matches what ProductCard and CartModal expect
      price: product.price,
      size: product.size, // Include size if it's relevant for the cart item's identity
    };

    try {
      await addToCart(itemToAdd, quantity);
      alert(`${quantity} x ${product.name} (Size: ${product.size || 'N/A'}) added to cart!`);
    } catch (err) {
      alert(`Failed to add item to cart. ${err.message}`);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (isLoading) {
    return (
      <div className="product-page">
        <div className="container">
          <p className="loading-text">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <div className="container">
          <p className="error-text">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="container">
          <p className="error-text">Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">{product.name}</h2>
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link> &gt;
            <Link to={`/${product.category?.toLowerCase().replace(/\s+/g, '-') || 'products'}`} className="breadcrumb-link">
              {product.category || 'Category'}
            </Link> &gt;
            <span className="breadcrumb-current">{product.name}</span>
          </div>
        </div>

        <div className="product-paper">
          <div className="product-grid">
            <div className="product-images">
              <div className="main-image">
                <img src={selectedImage || '/placeholder-image.jpg'} alt={product.name} />
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>

              <div className="price">
                ${product.price ? product.price.toFixed(2) : 'N/A'}
              </div>

              <p className="product-description">{product.description || 'No description available.'}</p>

              {product.size && (
                <div className="size-info">
                  <p className="option-label">Size: {product.size}</p>
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
                  max={product.stock > 0 ? product.stock : 1}
                />
              </div>

              <div className="action-buttons">
                <button 
                  className="add-to-cart-btn" 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || cartLoading} // Disable if cart operation is in progress
                >
                  <AddShoppingCartIcon className="btn-icon" />
                  {product.stock === 0 ? 'Out of Stock' : (cartLoading ? 'Adding...' : 'Add to Cart')}
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

          <div className="product-details">
            <h3 className="section-title">Product Details</h3>
            <p>{product.description || 'Detailed information not available.'}</p>
          </div>

          <div className="divider"></div>

          <div className="reviews-section">
            <h3 className="section-title">Customer Reviews</h3>
            <p>Reviews will be displayed here.</p>
            {cartError && <p className="error-text" style={{color: 'red'}}>Cart Error: {cartError}</p>} {/* Display cart error */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;