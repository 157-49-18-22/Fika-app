import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaClock, FaTag, FaGift } from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { getAllProducts } from "../../data/products.js";
import "./NewArrivalsSection.css";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 11, minutes: 23, seconds: 45 });
  const [categoryProducts, setCategoryProducts] = useState({
    womensJeans: [],
    mensJeans: [],
    womensFootwear: [],
    womensDresses: [],
    accessories: []
  });
  
  const productsRowRef = useRef(null);
  const categoryRowRefs = {
    womensJeans: useRef(null),
    mensJeans: useRef(null),
    womensFootwear: useRef(null),
    womensDresses: useRef(null),
    accessories: useRef(null)
  };
  
  const autoScrollTimer = useRef(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

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
      womensJeans: allProducts.filter(p => p.category === "clothing" && p.name.toLowerCase().includes("jeans") && !p.name.toLowerCase().includes("men")),
      mensJeans: allProducts.filter(p => p.category === "clothing" && p.name.toLowerCase().includes("jeans") && p.name.toLowerCase().includes("men")),
      womensFootwear: allProducts.filter(p => p.category === "footwear" && !p.name.toLowerCase().includes("men")),
      womensDresses: allProducts.filter(p => p.category === "clothing" && p.name.toLowerCase().includes("dress")),
      accessories: allProducts.filter(p => p.category === "accessories")
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

  const categories = ["all", "clothing", "accessories", "footwear"];

  const filteredProducts = activeTab === "all" 
    ? newArrivals 
    : newArrivals.filter(product => product.category === activeTab);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addToCart(product);
  };

  const handleAddToWishlist = (product, e) => {
    if (e) e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (id, e) => {
    if (e) e.stopPropagation();
    navigate(`/product/₹{id}`);
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

  // Render product card - reusable component for all product sections
  const renderProductCard = (product) => {
    return (
      <div 
        key={product.id} 
        className="arrivals-product-card"
        onClick={() => navigate(`/product/₹{product.id}`)}
      >
        <div className="arrivals-product-image">
          <img src={product.image} alt={product.name} />
          {product.discount && (
            <span className="arrivals-discount-badge">-{product.discount}%</span>
          )}
          <div className="arrivals-product-badges">
            {product.isNew && <span className="arrivals-new-badge">New</span>}
            {product.isBestSeller && <span className="arrivals-bestseller-badge">Best Seller</span>}
          </div>
          <div className="arrivals-product-actions">
            <button 
              className="arrivals-action-btn cart-btn" 
              onClick={(e) => handleAddToCart(product, e)}
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
            <button 
              className={`arrivals-action-btn wishlist-btn ₹{isInWishlist(product.id) ? 'active' : ''}`}
              onClick={(e) => handleAddToWishlist(product, e)}
              title="Add to Wishlist"
            >
              <FaHeart />
            </button>
            <button 
              className="arrivals-action-btn quickview-btn"
              onClick={(e) => handleQuickView(product.id, e)}
              title="Quick View"
            >
              <FaEye />
            </button>
          </div>
        </div>
        <div className="arrivals-product-info">
          <h3>{product.name}</h3>
          <div className="arrivals-product-price">
            {product.discount ? (
              <>
                <span className="arrivals-current-price">₹{formatPrice(product.price, product.discount)}</span>
                <span className="arrivals-original-price">₹{getOriginalPrice(product.price)}</span>
              </>
            ) : (
              <span className="arrivals-current-price">₹{getOriginalPrice(product.price)}</span>
            )}
          </div>
          {product.reviewsCount > 0 && (
            <div className="arrivals-product-rating">
              <div className="arrivals-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={`arrivals-star ₹{index < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <span className="arrivals-reviews-count">({product.reviewsCount})</span>
            </div>
          )}
        </div>
        <div className="arrivals-hover-details">
          <div className="arrivals-product-details">
            <p className="arrivals-material">{product.material}</p>
            <div className="arrivals-available-sizes">
              {product.sizes && product.sizes.map((size, idx) => (
                <span key={idx} className="arrivals-size-badge">{size}</span>
              ))}
            </div>
            <div className="arrivals-colors-available">
              {product.colors && product.colors.map((color, idx) => (
                <span 
                  key={idx} 
                  className="arrivals-color-swatch" 
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                ></span>
              ))}
            </div>
          </div>
          <button className="arrivals-shop-now-btn">
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
      <div className="arrivals-category-section">
        <div className="arrivals-category-header">
          <h2 className="arrivals-category-title">{title}</h2>
          <Link to={`/all-products?category=₹{title.toLowerCase().replace(/\s+/g, '-')}`} className="arrivals-view-category">
            View All <span className="arrivals-arrow-circle">&#8599;</span>
          </Link>
        </div>
        
        <div className="arrivals-products-container">
          <button 
            className="arrivals-scroll-button left" 
            onClick={() => scrollProducts('left', categoryRowRefs[refKey])}
          >
            <FaChevronLeft />
          </button>
          
          <div className="arrivals-products-row" ref={categoryRowRefs[refKey]}>
            {products.map(product => renderProductCard(product))}
          </div>
          
          <button 
            className="arrivals-scroll-button right" 
            onClick={() => scrollProducts('right', categoryRowRefs[refKey])}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="arrivals-section">
      {/* Introduction Section */}
      <div className="arrivals-intro">
        <div className="arrivals-intro-content">
          <h1 className="arrivals-title">Discover Fresh Styles</h1>
          <p className="arrivals-description">
            Explore our latest collection of fashion-forward pieces designed to elevate your wardrobe. 
            Every week, we curate new styles that reflect current trends while maintaining timeless appeal.
          </p>
          <div className="arrivals-features">
            <div className="arrivals-feature-item">
              <FaTag className="arrivals-feature-icon" />
              <span>Exclusive Designs</span>
            </div>
            <div className="arrivals-feature-item">
              <FaGift className="arrivals-feature-icon" />
              <span>Free Shipping on orders over ₹100</span>
            </div>
            <div className="arrivals-feature-item">
              <FaClock className="arrivals-feature-icon" />
              <span>Limited Time Offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Product Highlight */}
      {featuredProduct && (
        <div className="arrivals-featured-product">
          <div className="arrivals-featured-image">
            <img src={featuredProduct.image} alt={featuredProduct.name} />
            {featuredProduct.discount && (
              <div className="arrivals-featured-discount">
                <span>{featuredProduct.discount}% OFF</span>
              </div>
            )}
          </div>
          <div className="arrivals-featured-info">
            <div className="arrivals-limited-offer">
              <h3>Limited Time Offer</h3>
              <div className="arrivals-countdown">
                <div className="arrivals-time-block">
                  <span className="arrivals-time-value">{timeLeft.days}</span>
                  <span className="arrivals-time-label">Days</span>
                </div>
                <div className="arrivals-time-separator">:</div>
                <div className="arrivals-time-block">
                  <span className="arrivals-time-value">{timeLeft.hours}</span>
                  <span className="arrivals-time-label">Hours</span>
                </div>
                <div className="arrivals-time-separator">:</div>
                <div className="arrivals-time-block">
                  <span className="arrivals-time-value">{timeLeft.minutes}</span>
                  <span className="arrivals-time-label">Min</span>
                </div>
                <div className="arrivals-time-separator">:</div>
                <div className="arrivals-time-block">
                  <span className="arrivals-time-value">{timeLeft.seconds}</span>
                  <span className="arrivals-time-label">Sec</span>
                </div>
              </div>
            </div>
            <h2 className="arrivals-featured-title">{featuredProduct.name}</h2>
            <p className="arrivals-featured-description">
              {featuredProduct.description || "Experience premium quality and exceptional design with this must-have piece from our latest collection."}
            </p>
            <div className="arrivals-featured-pricing">
              {featuredProduct.discount ? (
                <>
                  <span className="arrivals-current-price">₹{formatPrice(featuredProduct.price, featuredProduct.discount)}</span>
                  <span className="arrivals-original-price">₹{getOriginalPrice(featuredProduct.price)}</span>
                </>
              ) : (
                <span className="arrivals-current-price">₹{getOriginalPrice(featuredProduct.price)}</span>
              )}
            </div>
            <div className="arrivals-featured-actions">
              <button 
                className="arrivals-cart-btn"
                onClick={() => addToCart(featuredProduct)}
              >
                Add to Cart
              </button>
              <button 
                className={`arrivals-wishlist-btn ₹{isInWishlist(featuredProduct.id) ? 'active' : ''}`}
                onClick={() => isInWishlist(featuredProduct.id) ? removeFromWishlist(featuredProduct.id) : addToWishlist(featuredProduct)}
              >
                <FaHeart /> {isInWishlist(featuredProduct.id) ? "Added to Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Arrivals Section Header */}
      <div className="arrivals-header">
        <h2 className="arrivals-section-title">NEW ARRIVALS</h2>
        <button className="arrivals-carousel-control" onClick={toggleAutoScroll}>
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
      <div className="arrivals-category-tabs">
        {categories.map(category => (
          <button 
            key={category} 
            className={`arrivals-category-tab ₹{activeTab === category ? 'active' : ''}`}
            onClick={() => setActiveTab(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Category Description */}
      <div className="arrivals-category-description">
        <p>
          {activeTab === "all" 
            ? "Browse our complete selection of new arrivals, featuring the latest trends and must-have pieces for the season." 
            : activeTab === "clothing" 
            ? "Discover our newest clothing items, from elegant dresses to casual essentials, all crafted with premium fabrics." 
            : activeTab === "accessories" 
            ? "Complete your look with our just-arrived accessories, including bags, jewelry, watches, and more." 
            : "Step into style with our fresh footwear collection, featuring everything from casual comfort to evening elegance."}
        </p>
      </div>

      {/* New Arrivals Products Container */}
      <div className="arrivals-products-container">
        <button className="arrivals-scroll-button left" onClick={() => scrollProducts('left', productsRowRef)}>
          <FaChevronLeft />
        </button>
        
        <div className="arrivals-products-row" ref={productsRowRef}>
          {filteredProducts.map(product => renderProductCard(product))}
        </div>
        
        <button className="arrivals-scroll-button right" onClick={() => scrollProducts('right', productsRowRef)}>
          <FaChevronRight />
        </button>
      </div>

      {/* Category-specific product sections */}
      <div className="arrivals-sections-container">
        {/* Women's Dresses */}
        {renderProductsContainer("Women's Dresses", categoryProducts.womensDresses, "womensDresses")}
        
        {/* Women's Jeans */}
        {renderProductsContainer("Women's Jeans", categoryProducts.womensJeans, "womensJeans")}
        
        {/* Men's Jeans */}
        {renderProductsContainer("Men's Jeans", categoryProducts.mensJeans, "mensJeans")}
        
        {/* Women's Footwear */}
        {renderProductsContainer("Women's Footwear", categoryProducts.womensFootwear, "womensFootwear")}
        
        {/* Accessories */}
        {renderProductsContainer("Accessories", categoryProducts.accessories, "accessories")}
      </div>

      {/* Shopping Benefits */}
      <div className="arrivals-benefits">
        <div className="arrivals-benefit-item">
          <div className="arrivals-benefit-icon">🚚</div>
          <div className="arrivals-benefit-content">
            <h3>Free Shipping</h3>
            <p>On all orders over ₹100</p>
          </div>
        </div>
        <div className="arrivals-benefit-item">
          <div className="arrivals-benefit-icon">⭐</div>
          <div className="arrivals-benefit-content">
            <h3>Quality Guarantee</h3>
            <p>Crafted with premium materials</p>
          </div>
        </div>
        <div className="arrivals-benefit-item">
          <div className="arrivals-benefit-icon">🔄</div>
          <div className="arrivals-benefit-content">
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>
        <div className="arrivals-benefit-item">
          <div className="arrivals-benefit-icon">💳</div>
          <div className="arrivals-benefit-content">
            <h3>Secure Payment</h3>
            <p>Multiple payment options</p>
          </div>
        </div>
      </div>

      {/* View All Link */}
      <div className="arrivals-view-all">
        <Link to="/all-products" className="arrivals-view-all-btn">
          View All Collections
          <span className="arrivals-arrow-circle">&#8599;</span>
        </Link>
      </div>

      {/* Newsletter Signup */}
      <div className="arrivals-newsletter">
        <div className="arrivals-newsletter-content">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for exclusive offers and early access to new arrivals</p>
          <div className="arrivals-newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
