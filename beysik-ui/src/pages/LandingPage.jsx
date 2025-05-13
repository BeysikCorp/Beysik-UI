import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing-page.css';

// Moved categories to a separate constant to improve readability
const CATEGORIES = [
  {
    id: 1,
    name: 'SHIRTS',
    description: 'Airy and lightweight shirts made from GOTS-certified organic cotton.',
    image: 'https://cdn.thewirecutter.com/wp-content/media/2024/09/menswhitetees-2048px-02728.jpg?auto=webp&quality=75&width=1024', 
  },
  {
    id: 2,
    name: 'HOODIES',
    description: 'Cozy and sustainable hoodies made from recycled and organic fabrics.',
    image: 'https://zellbury.com/cdn/shop/files/MBH25001_-_NAVY_1.jpg?v=1731320050',
  },
  {
    id: 3,
    name: 'OUTERWEAR',
    description: 'High quality and easy to style. All jackets are made from 100% recycled polyester or organic cotton.',
    image: 'https://www.luciclothing.com/cdn/shop/products/basickimonojacket_2048x2048.jpg?v=1697793548',
  },
  {
    id: 4,
    name: 'PANTS',
    description: 'Comfortable and durable pants made from eco-friendly fabrics.',
    image: 'https://www.italiancolony.com/cdn/shop/files/0A0A9065.jpg?v=1696587359',
  },
];

function LandingPage() {
  return (
    <div className="main-box">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">Effortless Style</h1>
          <p className="hero-subtitle">Discover curated collections of timeless pieces, designed for modern living.</p>
          <button className="hero-button">Shop New Arrivals</button>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="vision-statement">
        <div className="container vision-content">
          <h2 className="vision-title">Our Vision</h2>
          <p className="vision-text">
            To redefine everyday wear by blending minimalist design with bold individuality—empowering 
            people to feel confident, comfortable, and unapologetically themselves in every thread.
          </p>
          <p className="vision-text">
            Beysik Apparel is built on a dream of creating a brand that focuses on everyday life, on high-quality 
            natural materials, and on the people who make our clothes.
          </p>
          <p className="vision-text">
            We believe that it is possible to make clothes that are infused with positive energy all around.
          </p>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="category-showcase">
        <div className="container category-container">
          <h2 className="section-title">Our Collections</h2>

          <div className="category-grid">
            {CATEGORIES.map((category) => (
              <div key={category.id} className="category-card">
                <div 
                  className="category-image-container" 
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className="category-overlay">
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    <button className="category-button">Shop Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links-container">
            <a href="#" className="footer-link">Customer Care</a>
            <a href="#" className="footer-link">Shipping & Returns</a>
            <a href="#" className="footer-link">FAQ</a>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Stockists</a>
          </div>
          
          <div className="social-icons-container">
            <p className="social-text">Follow Us: [Social Icons Here]</p>
          </div>
          
          <p className="copyright">
            BEYSIK &copy; {new Date().getFullYear()} - Minimalist Fashion
          </p>
          
          <div className="footer-legal">
            <a href="#" className="footer-link-small">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="#" className="footer-link-small">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;