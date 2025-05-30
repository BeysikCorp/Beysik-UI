import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';
import '../styles/product-pages.css';

const Collections = () => {
  const [allCollectionProducts, setAllCollectionProducts] = useState([]); // Renamed for clarity
  const [displayedProducts, setDisplayedProducts] = useState([]); // For products to display after filter/sort
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allProductsFromApi = await getAllProducts();

        if (!Array.isArray(allProductsFromApi)) {
          throw new Error("API did not return an array of products.");
        }

        // Client-side filtering for 'collections' tag
        // Assuming product.tags is an array of strings
        const filteredCollectionItems = allProductsFromApi.filter(
          product => product.tags && Array.isArray(product.tags) && product.tags.includes('collections')
        );

        setAllCollectionProducts(filteredCollectionItems); // Set the source list
        setDisplayedProducts(filteredCollectionItems);    // Initially display all fetched collection items
      } catch (err) {
        console.error("Error fetching collection products:", err);
        setError(err.message || "Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle filtering and sorting changes
  useEffect(() => {
    let result = [...allCollectionProducts]; // Start with the source list of all collection products
    
    // Apply secondary category filter
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
    
    setDisplayedProducts(result); // Update the list for display
  }, [filter, sort, allCollectionProducts]); // Dependency on the source list
 
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
 
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  if (isLoading) {
    return <div className="loading-state">Loading collections...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  // Message for no products matching criteria will be handled by checking displayedProducts.length in JSX

  return (
    <div className="product-page">
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">Collections</h2>
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link> &gt; 
            <span className="breadcrumb-current">Collections</span>
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
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))
          ) : (
            <div className="no-products-message">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
