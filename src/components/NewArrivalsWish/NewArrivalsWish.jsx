import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaClock, FaTag, FaGift } from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import "./NewArrivalsWish.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import LoginPrompt from "../../components/LoginPrompt/LoginPrompt";
import WishGenieLogo from '../../assets/Wish Genie.png';
import { getWishGenieProducts, initializeWishGenieCollection } from '../../firebase/firestore';

const NewArrivalsWish = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 11, minutes: 23, seconds: 45 });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const [categoryProducts, setCategoryProducts] = useState({
    scentedCandles: [],
    crystalJewellery: [],
    journals: []
  });
  const [wishGenieProducts, setWishGenieProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  const productsRowRef = useRef(null);
  const categoryRowRefs = {
    scentedCandles: useRef(null),
    crystalJewellery: useRef(null),
    journals: useRef(null)
  };
  
  const autoScrollTimer = useRef(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Fetch Wish Genie products
  useEffect(() => {
    const fetchWishGenieProducts = async () => {
      try {
        setLoading(true);
        let products = await getWishGenieProducts();
        
        // If no products exist, initialize the collection with a test product
        if (products.length === 0) {
          console.log('No products found, initializing collection...');
          await initializeWishGenieCollection();
          products = await getWishGenieProducts();
        }
        
        console.log('Fetched products:', products);
        
        // Extract unique categories from products
        const categories = [...new Set(products
          .filter(p => p.image && p.image.trim() !== '')
          .map(p => p.Category))]
          .filter(Boolean);
        setAvailableCategories(categories);
        
        // Categorize products based on their actual categories
        const categorizedProducts = {};
        categories.forEach(category => {
          categorizedProducts[category] = products.filter(p => 
            p.Category === category && 
            p.image && 
            p.image.trim() !== ''
          );
        });
        
        setCategoryProducts(categorizedProducts);
        setWishGenieProducts(products.filter(p => p.image && p.image.trim() !== ''));
        
        // Set featured product - prioritize products with discounts or select the first product
        const featuredProduct = products.find(p => p.discount > 0) || products[0];
        
        if (featuredProduct) {
          // Ensure all required fields are present
          const enhancedFeaturedProduct = {
            ...featuredProduct,
            name: featuredProduct['Sticker Content Main'] || featuredProduct.name || 'Featured Product',
            description: featuredProduct['Product Description'] || 'Experience premium quality and exceptional design with this must-have piece from our latest collection.',
            price: featuredProduct.MRP || featuredProduct.price || 0,
            discount: featuredProduct.discount || 0,
            image: featuredProduct.image || '/placeholder-image.jpg'
          };
          setFeaturedProduct(enhancedFeaturedProduct);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching Wish Genie products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchWishGenieProducts();
  }, []);

  const categories = ["all", ...availableCategories];

  const filteredProducts = activeTab === "all" 
    ? wishGenieProducts 
    : wishGenieProducts.filter(product => {
        const hasImage = product.image && product.image.trim() !== '';
        return product.Category === activeTab && hasImage;
      });

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    // Normalize product fields for cart
    const productToAdd = {
      id: product.id,
      name: product['Sticker Content Main'] || product.name || product.product_name || 'Product',
      price: Number(product.MRP) || Number(product.price) || 0,
      image: product.image || '/placeholder-image.jpg',
      category: product.Category || product.category || '',
      quantity: 1,
      discount: Number(product.discount) || 0,
      color: product.color || 'Default',
      product_code: product['Product code'] || product.product_code || '',
    };
    addToCart(productToAdd, undefined, 1, navigate);
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
    navigate(`/product-wish/${id}`);
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
    if (!price) return '0.00';
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '0.00';
    
    if (discount) {
      const discountedPrice = numPrice * (1 - discount / 100);
      return discountedPrice.toFixed(2);
    }
    return numPrice.toFixed(2);
  };

  // Calculate original price display
  const getOriginalPrice = (price) => {
    if (!price) return '0.00';
    const numPrice = Number(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
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

  // Helper to get the first image from the comma-separated image field
  const getFirstImage = (imageField) => {
    if (!imageField) return '/placeholder-image.jpg';
    const imagesArr = imageField.split(',').map(img => img.trim()).filter(Boolean);
    if (imagesArr.length > 0) {
      return imagesArr[0].startsWith('/') ? imagesArr[0] : `/${imagesArr[0]}`;
    }
    return '/placeholder-image.jpg';
  };

  // Render product card - reusable component for all product sections
  const renderProductCard = (product) => {
    return (
      <div 
        key={product.id} 
        className="wish-product-card"
        onClick={() => navigate(`/product-wish/${product.id}`)}
      >
        <div className="wish-product-image">
          <img src={getFirstImage(product.image)} alt="" />
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
          {/* <h3>{product['Sticker Content Main']}</h3> */}
          {/* <p className="wish-product-subtitle">{product['Sticker Content Sub']}</p> */}
          <div className="wish-product-price">
            <span className="wish-current-price">₹{getOriginalPrice(product.MRP)}</span>
          </div>
          <div className="wish-product-details">
            <p className="wish-material">Burn Time: {product['Burn Time']}</p>
            <p className="wish-dimensions">Dimensions: {product['Height Dimensions'] || product['Height/Dimensions']}</p>
            <p className="wish-fragrance">Fragrance: {product.Fragrances}</p>
          </div>
        </div>
        <div className="wish-hover-details">
          <div className="wish-product-details">
            <p className="wish-material">{product['Product Description']?.substring(0, 100)}...</p>
            <p className="wish-dimensions">Diameter: {product.Diameter}</p>
            <p className="wish-jar-type">Jar Type: {product['Jar type']}</p>
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
          <Link to={`/all-products?category=${title.toLowerCase().replace(/\s+/g, '-')}`} className="wish-view-category">
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

  // Category Description
  const getCategoryDescription = (category) => {
    switch (category) {
      case "all":
        return "Discover our newest products, from elegant designs to casual essentials, all crafted with premium materials. Each item is designed to bring warmth and ambiance to your space, perfect for relaxation and creating a cozy atmosphere.";
      case "Luxury/Crystal Candles":
        return "Explore our collection of luxury crystal candles, each one crafted with care to provide a unique and soothing experience. From calming lavender to invigorating citrus, our candles are made with premium materials to ensure a long-lasting and delightful fragrance.";
      case "Crystal Jewellery":
        return "Discover our stunning crystal jewellery collection, featuring unique pieces that combine elegance with natural beauty. Each item is carefully crafted to bring positive energy and style to your everyday look.";
      case "Journals":
        return "Explore our selection of beautifully designed journals, perfect for capturing your thoughts and dreams. Each journal is crafted with high-quality materials to inspire creativity and mindfulness.";
      default:
        return `Explore our collection of ${category}, each one crafted with care to provide a unique and soothing experience.`;
    }
  };

  return (
    <div className="wish-section">
      {/* Wish Genie Logo */}
      <div className="wish-logo-container">
        <img src={WishGenieLogo} alt="Wish Genie Logo" className="wish-genie-logo" />
      </div>
      {/* Introduction Section */}
      <div className="wish-intro">
        <div className="wish-intro-content">
          <h1 className="wish-title">Explore Our Manifestation Products</h1>
          <p className="wish-description">
          Wishgenie specialises in high vibration manifestation tools designed to help you align with your highest potential. Whether you are seeking love, success, health, or peace , our carefully curated collection of products help and guide you towards your dreams.
          </p>
          <div className="wish-features">
            <div className="wish-feature-item">
              <FaTag className="wish-feature-icon" />
              <span>Exclusive Designs</span>
            </div>
            {/* <div className="wish-feature-item">
              <FaGift className="wish-feature-icon" />
              <span>Free Shipping on orders over ₹1499</span>
            </div> */}
            <div className="wish-feature-item">
              <FaClock className="wish-feature-icon" />
              <span>Limited Time Offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Product Section */}
      {featuredProduct && (
        <div className="wish-featured-product">
          <div className="wish-featured-image">
            <img src={getFirstImage(featuredProduct.image)} alt={featuredProduct.name} />
            {featuredProduct.discount && (
              <div className="wish-featured-discount">
                -{featuredProduct.discount}% OFF
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
                <span className="wish-time-separator">:</span>
                <div className="wish-time-block">
                  <span className="wish-time-value">{timeLeft.hours}</span>
                  <span className="wish-time-label">Hours</span>
                </div>
                <span className="wish-time-separator">:</span>
                <div className="wish-time-block">
                  <span className="wish-time-value">{timeLeft.minutes}</span>
                  <span className="wish-time-label">Minutes</span>
                </div>
                <span className="wish-time-separator">:</span>
                <div className="wish-time-block">
                  <span className="wish-time-value">{timeLeft.seconds}</span>
                  <span className="wish-time-label">Seconds</span>
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
                onClick={() => handleAddToCart(featuredProduct)}
              >
                Add to Cart
              </button>
              <button 
                className={`wish-wishlist-btn ${isInWishlist(featuredProduct.id) ? 'active' : ''}`}
                onClick={() => handleAddToWishlist(featuredProduct)}
              >
                <FaHeart /> {isInWishlist(featuredProduct.id) ? "Added to Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="wish-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`wish-tab-btn${activeTab === cat.toLowerCase() ? ' active' : ''}`}
            onClick={() => setActiveTab(cat.toLowerCase())}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Category Description */}
      <div className="wish-category-description">
        <p>{getCategoryDescription(activeTab)}</p>
      </div>

      {/* Main Horizontal Product Row */}
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
        {availableCategories.map(category => (
          renderProductsContainer(category, categoryProducts[category], category.toLowerCase().replace(/\s+/g, ''))
        ))}
      </div>

      {/* Shopping Benefits */}
      <div className="wish-benefits">
        {/* <div className="wish-benefit-item">
          <div className="wish-benefit-icon">🚚</div>
          <div className="wish-benefit-content">
            <h3>Free Shipping</h3>
            <p>On all orders over ₹1499</p>
          </div>
        </div> */}
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
            <p>Easy Return Policy</p>
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

      {/* Newsletter Section */}
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

      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginPrompt message="Please login to add items to your cart or wishlist." />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrivalsWish; 