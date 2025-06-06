import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/product-pages.css';
// import allProducts from '../data/products.json'; // Remove mock data import
import { getAllProducts } from '../services/productService'; // Import the service
import { CircularProgress, Box, Typography } from '@mui/material'; // For loading/error states
import ProductCard from '../components/ProductCard'; // Import ProductCard

const NewArrivals = () => {
  const [allFetchedProducts, setAllFetchedProducts] = useState([]); // Store all products fetched for this page type
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState('All'); // Corresponds to category
  const [sort, setSort] = useState('Newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all products. The backend might or might not filter by tag.
        // We will ensure client-side filtering for 'new-arrival'.
        const allProductsFromApi = await getAllProducts(); // Removed { tag: 'new-arrival' } to rely on client filtering or if backend doesn't support it well.
                                                          // If backend DOES support it, passing the tag is still fine and can optimize.
                                                          // For now, let's assume client must filter.

        if (!Array.isArray(allProductsFromApi)) {
          throw new Error("API did not return an array of products.");
        }

        // Client-side filtering for 'new-arrival' tag
        // Assuming product.tags is an array of strings
        const newArrivalItems = allProductsFromApi.filter(
          product => product.tags && Array.isArray(product.tags) && product.tags.includes('new-arrival')
        );

        setAllFetchedProducts(newArrivalItems);
        setFilteredProducts(newArrivalItems); // Initially, all fetched new arrivals are shown
      } catch (err) {
        console.error("Failed to fetch or filter new arrivals:", err);
        setError(err.message || "Could not load new arrivals.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Handle filtering and sorting changes
  useEffect(() => {
    let result = [...allFetchedProducts];
    
    if (filter !== 'All') {
      result = result.filter(p => p.category === filter); // Ensure your product objects have a 'category' field
    }
    
    switch (sort) {
      case 'PriceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'PriceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Newest':
      default:
        // Assuming products from API are already sorted by newest or have a date field
        // If products have a 'createdAt' or similar date field:
        // result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    
    setFilteredProducts(result);
  }, [filter, sort, allFetchedProducts]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <Typography color="error" variant="h6">Failed to load products.</Typography>
        <Typography color="error">Details: {error}</Typography>
      </Box>
    );
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

        <div className="product-grid" role="region" aria-label="Product gallery">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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

export default NewArrivals;