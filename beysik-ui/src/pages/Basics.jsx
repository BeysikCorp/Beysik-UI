import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';
import '../styles/product-pages.css';

const Basics = () => {
  const [basicsProducts, setBasicsProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allProducts = await getAllProducts();
        const filteredProducts = allProducts.filter(p => p.category && p.category.toLowerCase() === 'basics');
        setBasicsProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching basics products:", err);
        setError(err.message || "Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle filtering and sorting changes
  useEffect(() => {
    let result = [...basicsProducts];
    
    // Apply category filter
    if (filter !== 'All') {
      result = result.filter(p => p.category === filter);
    }
    
    // Apply sorting
    switch (sort) {
      case 'PriceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'PriceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Newest':
      default:
        // Assuming products are already in "newest first" order from the API
        break;
    }
    
    setBasicsProducts(result);
  }, [filter, sort, basicsProducts]);
 
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
 
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };
 
  if (isLoading) {
    return <div className="loading-state">Loading products...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  if (basicsProducts.length === 0) {
    return <div className="empty-state">No basic products found at the moment.</div>;
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">New Arrivals</h2>
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link> &gt; 
            <span className="breadcrumb-current">New Arrivals</span>
          </div>
        </div>

        <div className="filter-sort-container">
          <div className="filter-container">
            <span className="filter-label">Filter by:</span>
            <select 
              className="filter-select" 
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="sort-container">
            <span className="sort-label">Sort by:</span>
            <select 
              className="sort-select"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="Newest">Newest</option>
              <option value="PriceLow">Price: Low to High</option>
              <option value="PriceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {basicsProducts.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Basics;
