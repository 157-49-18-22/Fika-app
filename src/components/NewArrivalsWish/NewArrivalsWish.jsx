import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaClock, FaTag, FaGift } from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { getAllProducts } from "../../data/products.js";
import "./NewArrivalsWish.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import LoginPrompt from "../../components/LoginPrompt/LoginPrompt";

const NewArrivalsWish = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 11, minutes: 23, seconds: 45 });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const [categoryProducts, setCategoryProducts] = useState({
    cushions: [],
    bedsets: [],
    doharsAndQuilts: []
  });
  
  const productsRowRef = useRef(null);
  const categoryRowRefs = {
    cushions: useRef(null),
    bedsets: useRef(null),
    doharsAndQuilts: useRef(null)
  };
  
  const autoScrollTimer = useRef(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Get products with isNew flag and categorize products
  useEffect(() => {
    const allProducts = getAllProducts();
    const newProducts = allProducts.filter(product => product.isNew);
    setNewArrivals(newProducts);
    
    // Set a featured product (first item with discount)
    const discountedProduct = newProducts.find(product => product.discount);
    if (discountedProduct) {
      setFeaturedProduct(discountedProduct);
    } else if (newProducts.length > 0) {
      setFeaturedProduct(newProducts[0]);
    }

    // Organize products by categories
    setCategoryProducts({
      cushions: allProducts.filter(p => p.category === "cushions"),
      bedsets: allProducts.filter(p => p.category === "bedsets"),
      doharsAndQuilts: allProducts.filter(p => p.category === "dohars" || p.category === "quilts")
    });
  }, []);

  // Countdown timer for featured product
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        const { days, hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          return { ...prevTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { ...prevTime, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { ...prevTime, hours: hours - 1, minutes: 59, seconds: 59 };
        } else if (days > 0) {
          return { ...prevTime, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        
        // Reset when countdown reaches zero
        return { days: 3, hours: 11, minutes: 23, seconds: 45 };
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, []);

  const categories = ["all", "cushions", "bedsets", "dohars & quilts"];

  const filteredProducts = activeTab === "all" 
    ? newArrivals 
    : newArrivals.filter(product => product.category === activeTab);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    addToCart(product, undefined, 1, navigate);
  };

  const handleAddToWishlist = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id, navigate);
    } else {
      addToWishlist(product, navigate);
    }
  };

  const handleQuickView = (id, e) => {
    if (e) e.stopPropagation();
    navigate(`/product/${id}`);
  };

  const scrollProducts = (direction, ref) => {
    if (ref && ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleAutoScroll = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Auto scroll functionality
  useEffect(() => {
    if (isAutoPlay && productsRowRef.current) {
      autoScrollTimer.current = setInterval(() => {
        const container = productsRowRef.current;
        const isAtEnd = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 10);
        
        if (isAtEnd) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }, 5000);
    }

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [isAutoPlay]);

  // Format price with discount
  const formatPrice = (price, discount) => {
    if (discount) {
      const discountedPrice = price * (1 - discount / 100);
      return discountedPrice.toFixed(2);
    }
    return price.toFixed(2);
  };

  // Calculate original price display
  const getOriginalPrice = (price) => {
    return price.toFixed(2);
  };

  // Newsletter submit handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/newsletter", { email: newsletterEmail })
      .then(() => {
        setNewsletterSuccess(true);
        setNewsletterEmail("");
        setTimeout(() => setNewsletterSuccess(false), 3000);
      })
      .catch(err => {
        alert("Error: " + (err.response?.data?.error || err.message));
      });
  };

  // Render product card - reusable component for all product sections
  const renderProductCard = (product) => {
    return (
      <div 
        key={product.id} 
        className="wish-product-card"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="wish-product-image">
          <img src={product.image} alt={product.name} />
          
          <div className="wish-product-actions">
            <button 
              className="wish-action-btn cart-btn" 
              onClick={(e) => handleAddToCart(product, e)}
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
            <button 
              className={`wish-action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
              onClick={(e) => handleAddToWishlist(product, e)}
              title="Add to Wishlist"
            >
              <FaHeart />
            </button>
            <button 
              className="wish-action-btn quickview-btn"
              onClick={(e) => handleQuickView(product.id, e)}
              title="Quick View"
            >
              <FaEye />
            </button>
          </div>
        </div>
        <div className="wish-product-info">
          <h3>{product.name}</h3>
          <div className="wish-product-price">
            {product.discount ? (
              <>
                <span className="wish-current-price">₹{formatPrice(product.price, product.discount)}</span>
                <span className="wish-original-price">₹{getOriginalPrice(product.price)}</span>
                <span className="wish-discount-badge">-{product.discount}%</span>
              </>
            ) : (
              <span className="wish-current-price">₹{getOriginalPrice(product.price)}</span>
            )}
          </div>
          {product.reviewsCount > 0 && (
            <div className="wish-product-rating">
              <div className="wish-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={`wish-star ${index < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <span className="wish-reviews-count">({product.reviewsCount})</span>
            </div>
          )}
        </div>
        <div className="wish-hover-details">
          <div className="wish-product-details">
            <p className="wish-material">{product.material}</p>
            <div className="wish-available-sizes">
              {product.sizes && product.sizes.map((size, idx) => (
                <span key={idx} className="wish-size-badge">{size}</span>
              ))}
            </div>
            <div className="wish-colors-available">
              {product.colors && product.colors.map((color, idx) => (
                <span 
                  key={idx} 
                  className="wish-color-swatch" 
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                ></span>
              ))}
            </div>
          </div>
          <button className="wish-shop-now-btn" onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}>
            Shop Now
          </button>
        </div>
      </div>
    );
  };

  // Render products container - reusable component for product sections
  const renderProductsContainer = (title, products, refKey) => {
    // If no products, don't render the section
    if (!products || products.length === 0) return null;
    
    return (
      <div className="wish-category-section">
        <div className="wish-category-header">
          <h2 className="wish-category-title">{title}</h2>
          <Link to={`/all-products?category=₹{title.toLowerCase().replace(/\s+/g, '-')}`} className="wish-view-category">
            View All <span className="wish-arrow-circle">&#8599;</span>
          </Link>
        </div>
        
        <div className="wish-products-container">
          <button 
            className="wish-scroll-button left" 
            onClick={() => scrollProducts('left', categoryRowRefs[refKey])}
          >
            <FaChevronLeft />
          </button>
          
          <div className="wish-products-row" ref={categoryRowRefs[refKey]}>
            {products.map(product => renderProductCard(product))}
          </div>
          
          <button 
            className="wish-scroll-button right" 
            onClick={() => scrollProducts('right', categoryRowRefs[refKey])}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="wish-section">
        {/* Introduction Section */}
        <div className="wish-intro">
          <div className="wish-intro-content">
            <h1 className="wish-title">Discover Fresh Styles</h1>
            <p className="wish-description">
              Explore our latest collection of fashion-forward pieces designed to elevate your wardrobe. 
              Every week, we curate new styles that reflect current trends while maintaining timeless appeal.
            </p>
            <div className="wish-features">
              <div className="wish-feature-item">
                <FaTag className="wish-feature-icon" />
                <span>Exclusive Designs</span>
              </div>
              <div className="wish-feature-item">
                <FaGift className="wish-feature-icon" />
                <span>Free Shipping on orders over ₹1499</span>
              </div>
              <div className="wish-feature-item">
                <FaClock className="wish-feature-icon" />
                <span>Limited Time Offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Product Highlight */}
        {featuredProduct && (
          <div className="wish-featured-product">
            <div className="wish-featured-image">
              <img src={featuredProduct.image} alt={featuredProduct.name} />
              {featuredProduct.discount && (
                <div className="wish-featured-discount">
                  <span>{featuredProduct.discount}% OFF</span>
                </div>
              )}
            </div>
            <div className="wish-featured-info">
              <div className="wish-limited-offer">
                <h3>Limited Time Offer</h3>
                <div className="wish-countdown">
                  <div className="wish-time-block">
                    <span className="wish-time-value">{timeLeft.days}</span>
                    <span className="wish-time-label">Days</span>
                  </div>
                  <div className="wish-time-separator">:</div>
                  <div className="wish-time-block">
                    <span className="wish-time-value">{timeLeft.hours}</span>
                    <span className="wish-time-label">Hours</span>
                  </div>
                  <div className="wish-time-separator">:</div>
                  <div className="wish-time-block">
                    <span className="wish-time-value">{timeLeft.minutes}</span>
                    <span className="wish-time-label">Min</span>
                  </div>
                  <div className="wish-time-separator">:</div>
                  <div className="wish-time-block">
                    <span className="wish-time-value">{timeLeft.seconds}</span>
                    <span className="wish-time-label">Sec</span>
                  </div>
                </div>
              </div>
              <h2 className="wish-featured-title">{featuredProduct.name}</h2>
              <p className="wish-featured-description">
                {featuredProduct.description || "Experience premium quality and exceptional design with this must-have piece from our latest collection."}
              </p>
              <div className="wish-featured-pricing">
                {featuredProduct.discount ? (
                  <>
                    <span className="wish-current-price">₹{formatPrice(featuredProduct.price, featuredProduct.discount)}</span>
                    <span className="wish-original-price">₹{getOriginalPrice(featuredProduct.price)}</span>
                  </>
                ) : (
                  <span className="wish-current-price">₹{getOriginalPrice(featuredProduct.price)}</span>
                )}
              </div>
              <div className="wish-featured-actions">
                <button 
                  className="wish-cart-btn"
                  onClick={() => addToCart(featuredProduct)}
                >
                  Add to Cart
                </button>
                <button 
                  className={`wish-wishlist-btn ${isInWishlist(featuredProduct.id) ? 'active' : ''}`}
                  onClick={() => isInWishlist(featuredProduct.id) ? removeFromWishlist(featuredProduct.id) : addToWishlist(featuredProduct)}
                >
                  <FaHeart /> {isInWishlist(featuredProduct.id) ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Arrivals Section Header */}
        <div className="wish-header">
          <h2 className="wish-section-title">NEW ARRIVALS</h2>
          <button className="wish-carousel-control" onClick={toggleAutoScroll}>
            {isAutoPlay ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 9V15M14 9V15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 16.5L16 12L10 7.5V16.5Z" fill="#222"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Category Selection */}
        <div className="wish-category-tabs">
          {categories.map(category => (
            <button 
              key={category} 
              className={`wish-category-tab ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="wish-category-description">
          <p>
            {activeTab === "all" 
              ? "Browse our complete selection of new arrivals, featuring the latest trends and must-have pieces for the season." 
              : activeTab === "cushions" 
              ? "Discover our newest cushions, from elegant designs to casual essentials, all crafted with premium fabrics." 
              : activeTab === "bedsets" 
              ? "Complete your look with our just-arrived bedsets, including covers, sheets, and more." 
              : "Explore our collection of dohars and quilts, perfect for every season and crafted with premium materials for ultimate comfort."}
          </p>
        </div>

        {/* New Arrivals Products Container */}
        <div className="wish-products-container">
          <button className="wish-scroll-button left" onClick={() => scrollProducts('left', productsRowRef)}>
            <FaChevronLeft />
          </button>
          
          <div className="wish-products-row" ref={productsRowRef}>
            {filteredProducts.map(product => renderProductCard(product))}
          </div>
          
          <button className="wish-scroll-button right" onClick={() => scrollProducts('right', productsRowRef)}>
            <FaChevronRight />
          </button>
        </div>

        {/* Category-specific product sections */}
        <div className="wish-sections-container">
          {/* Cushions */}
          {renderProductsContainer("Cushions", categoryProducts.cushions, "cushions")}
          
          {/* Bedsets */}
          {renderProductsContainer("Bedsets", categoryProducts.bedsets, "bedsets")}
          
          {/* Dohars and Quilts */}
          {renderProductsContainer("Dohars & Quilts", categoryProducts.doharsAndQuilts, "doharsAndQuilts")}
        </div>

        {/* Shopping Benefits */}
        <div className="wish-benefits">
          <div className="wish-benefit-item">
            <div className="wish-benefit-icon">🚚</div>
            <div className="wish-benefit-content">
              <h3>Free Shipping</h3>
              <p>On all orders over ₹1499</p>
            </div>
          </div>
          <div className="wish-benefit-item">
            <div className="wish-benefit-icon">⭐</div>
            <div className="wish-benefit-content">
              <h3>Quality Guarantee</h3>
              <p>Crafted with premium materials</p>
            </div>
          </div>
          <div className="wish-benefit-item">
            <div className="wish-benefit-icon">🔄</div>
            <div className="wish-benefit-content">
              <h3>Easy Returns</h3>
              <p>15-day return policy</p>
            </div>
          </div>
          <div className="wish-benefit-item">
            <div className="wish-benefit-icon">💳</div>
            <div className="wish-benefit-content">
              <h3>Secure Payment</h3>
              <p>Multiple payment options</p>
            </div>
          </div>
        </div>

        {/* View All Link */}
        <div className="wish-view-all">
          <Link to="/all-products" className="wish-view-all-btn">
            View All Collections
            <span className="wish-arrow-circle">&#8599;</span>
          </Link>
        </div>

        {/* Newsletter Signup */}
        <div className="wish-newsletter">
          <div className="wish-newsletter-content">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for exclusive offers and early access to new arrivals</p>
            <form className="wish-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
            {newsletterSuccess && <div style={{color: 'green', marginTop: 8}}>Subscribed successfully!</div>}
          </div>
        </div>
      </div>
      
      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginPrompt message="Please login to add items to your cart or wishlist." />
          </div>
        </div>
      )}
    </>
  );
};

export default NewArrivalsWish; 