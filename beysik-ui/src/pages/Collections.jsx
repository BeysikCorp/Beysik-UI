import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/product-pages.css';
import allProducts from '../data/products.json';

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    // Filter products tagged as 'collections'
    const collectionItems = allProducts.filter(p => p.tags && p.tags.includes('collections'));
    setProducts(collectionItems);
    setFilteredProducts(collectionItems);
  }, []);

 // Handle filtering and sorting changes
   useEffect(() => {
     let result = [...products];
     
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
     
     setFilteredProducts(result);
   }, [filter, sort, products]);
 
   const handleFilterChange = (e) => {
     setFilter(e.target.value);
   };
 
   const handleSortChange = (e) => {
     setSort(e.target.value);
   };
 
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
           {filteredProducts.length > 0 ? (
             filteredProducts.map((product) => (
               <div className="product-card" key={product.id}>
                 <Link to={`/product/${product.id}`} className="product-link">
                   <div className="product-image-container">
                     <img
                       src={product.listingImage}
                       alt={product.name}
                       className="product-image"
                     />
                   </div>
                   <div className="product-content">
                     <h3 className="product-name">{product.name}</h3>
                     <p className="product-price">${product.price.toFixed(2)}</p>
                   </div>
                 </Link>
               </div>
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
