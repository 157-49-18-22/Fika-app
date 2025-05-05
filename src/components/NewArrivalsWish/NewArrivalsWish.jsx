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
import GenieLoader from "../GenieLoader";

const NewArrivalsWish = () => {
  const [showLoader, setShowLoader] = useState(true);
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
      {showLoader && <GenieLoader onFinish={() => setShowLoader(false)} />}
      {!showLoader && <h1 style={{color: 'red', textAlign: 'center', marginTop: '100px'}}>Hello World</h1>}
    </>
  );
};

export default NewArrivalsWish; 