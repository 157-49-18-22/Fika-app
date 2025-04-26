import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { FaShoppingBag, FaHeart, FaShoppingCart, FaEye, FaTimes, FaRegHeart, FaTshirt, FaSearch, FaChevronRight, FaStar, FaStarHalfAlt, FaRegStar, FaFilter, FaSort, FaTags, FaArrowRight, FaSlidersH, FaDollarSign, FaSortAmountDown } from "react-icons/fa";
import { GiLargeDress, GiRunningShoe, GiWatch, GiHeartNecklace, GiTrousers } from "react-icons/gi";
import "./AllProductsStyles.css";
import { getAllProducts } from "../../data/products";

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [visibleItems, setVisibleItems] = useState(12);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const [minRating, setMinRating] = useState(0);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedGender, setSelectedGender] = useState('all');
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setFadeIn(true);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Add click outside listener
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categories = [
    { id: "all", name: "All Products", icon: <FaShoppingBag /> },
    { id: "clothing", name: "Clothing", icon: <FaTshirt /> },
    { id: "dresses", name: "Dresses", icon: <GiLargeDress /> },
    { id: "shoes", name: "Shoes", icon: <GiRunningShoe /> },
    { id: "accessories", name: "Accessories", icon: <GiHeartNecklace /> },
    { id: "pants", name: "Pants", icon: <GiTrousers /> },
    { id: "watches", name: "Watches", icon: <GiWatch /> },
  ];

  const allProducts = getAllProducts();

  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "newest", name: "Newest" },
    { id: "priceAsc", name: "Price: Low to High" },
    { id: "priceDesc", name: "Price: High to Low" },
    { id: "nameAsc", name: "Name: A-Z" },
    { id: "nameDesc", name: "Name: Z-A" },
  ];

  // Count products per category
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat.id] = allProducts.filter(
      (product) => cat.id === 'all' || product.category === cat.id
    ).length;
    return acc;
  }, {});

  // Filter products by category, search, price, rating, discount, stock, gender
  const filteredProducts = allProducts.filter(
    (product) =>
      (selectedCategory === "all" || product.category === selectedCategory) &&
      (searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
      (minRating === 0 || (product.rating && product.rating >= minRating)) &&
      (!showDiscounted || product.discount) &&
      (!inStockOnly || product.inStock) &&
      (selectedGender === 'all' || (product.gender && product.gender.toLowerCase() === selectedGender))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.isNew === a.isNew ? 0 : b.isNew ? -1 : 1;
      case "priceAsc":
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      case "priceDesc":
        const priceADesc = a.discount
          ? a.price * (1 - a.discount / 100)
          : a.price;
        const priceBDesc = b.discount
          ? b.price * (1 - b.discount / 100)
          : b.price;
        return priceBDesc - priceADesc;
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 8);
  };

  const handleImageClick = (image, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already being applied through the filteredProducts
  };

  const handleAddToCartClick = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToWishlistClick = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setToastMessage(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      setToastMessage(`${product.name} added to wishlist!`);
    }
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleQuickView = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setQuickView(product);
  };

  const closeQuickView = () => {
    setQuickView(null);
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star-icon filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star-icon filled" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star-icon" />);
    }
    
    return stars;
  };

  return (
    <section className={`products-section ${fadeIn ? 'fade-in' : ''}`}>
      {/* Toast notification */}
      {showToast && (
        <div className="products-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="products-container">
        {/* Hero Header */}
        <div className="products-header">
          <div className="animated-title">
            {Array.from("Our Collection").map((letter, index) => (
              <span key={index} className={letter === ' ' ? 'space' : ''} style={{ animationDelay: `${0.1 * index}s` }}>
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
          <div className="products-subtitle">
            Discover our curated selection of premium fashion items designed for style and comfort
          </div>
          <div className="products-divider"></div>
        </div>

        {/* Horizontal Category Bar */}
        <div className="category-bar-horizontal">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn-horizontal ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(category.id);
                setVisibleItems(12);
              }}
            >
              <span className="category-icon-horizontal">{category.icon}</span>
              {category.name} <span style={{color:'#888',fontWeight:400}}>({categoryCounts[category.id]})</span>
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        {/* <div className="filters-bar">
          <button 
            className="filter-toggle-btn" 
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            Filters
          </button>
        </div> */}

        <div className="products-main-content">
          {/* Side Filters Panel */}
          <div className={`products-filters ${filtersVisible ? 'visible' : ''}`}>
            <div className="filters-header">
              <h3><FaSlidersH /> Filters</h3>
              <button className="close-filters" onClick={() => setFiltersVisible(false)}>×</button>
            </div>
            
            {/* Gender Filter */}
            <div className="filter-group">
              <h4>Gender</h4>
              <div className="gender-options">
                {['all', 'men', 'women', 'unisex'].map((gender) => (
                  <label key={gender} className="gender-radio">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={selectedGender === gender}
                      onChange={() => setSelectedGender(gender)}
                    />
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Minimum Rating Filter */}
            <div className="filter-group">
              <h4><FaStar /> Minimum Rating</h4>
              <div className="rating-options">
                {[4, 3, 2, 1].map((star) => (
                  <label key={star} className="rating-checkbox">
                    <input
                      type="radio"
                      name="minRating"
                      value={star}
                      checked={minRating === star}
                      onChange={() => setMinRating(star)}
                    />
                    {star} stars & up
                  </label>
                ))}
                <label className="rating-checkbox">
                  <input
                    type="radio"
                    name="minRating"
                    value={0}
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                  />
                  Any
                </label>
              </div>
            </div>
            
            {/* On Sale & In Stock Only */}
            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showDiscounted}
                  onChange={() => setShowDiscounted((v) => !v)}
                />
                On Sale
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={() => setInStockOnly((v) => !v)}
                />
                In Stock Only
              </label>
            </div>
            
            {/* Price Range */}
            <div className="filter-group">
              <h4><FaDollarSign /> Price Range</h4>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider"
              />
              <div className="price-range-display">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            {/* Sort By */}
            <div className="filter-group">
              <h4><FaSortAmountDown /> Sort By</h4>
              <select
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Clear All Filters Button */}
            <button className="reset-filters-btn" style={{marginTop:16, width:'100%'}}
              onClick={() => {
                setSelectedCategory('all');
                setMinRating(0);
                setShowDiscounted(false);
                setInStockOnly(false);
                setPriceRange([0, 1000]);
                setSortOption('featured');
                setSelectedGender('all');
              }}
            >
              Clear All Filters
            </button>
          </div>

          {/* Main Products Grid */}
          <div className="products-content">
            <div className="products-result-stats">
              <div className="results-count">
                Showing {Math.min(visibleItems, sortedProducts.length)} of {sortedProducts.length} products
              </div>
              <div className="sort-mobile">
                <button className="sort-btn" onClick={() => setFiltersVisible(true)}>
                  <FaSort /> Sort
                </button>
              </div>
            </div>

            <div className="products-grid">
              {sortedProducts.slice(0, visibleItems).map((product) => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="product-image-container">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-image" 
                      loading="lazy" 
                    />
                    
                    {product.isNew && (
                      <div className="product-badge new">New</div>
                    )}
                    
                    {product.discount && (
                      <div className="product-badge discount">-{product.discount}%</div>
                    )}
                    
                    <div className="product-actions">
                      <button 
                        className="product-action-btn cart-btn"
                        onClick={(e) => handleAddToCartClick(product, e)}
                        title="Add to Cart"
                      >
                        <FaShoppingCart />
                      </button>
                      <button 
                        className={`product-action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={(e) => handleAddToWishlistClick(product, e)}
                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      <button 
                        className="product-action-btn quickview-btn"
                        onClick={(e) => handleQuickView(product, e)}
                        title="Quick View"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="product-action-btn expand-btn"
                        onClick={(e) => handleImageClick(product.image, e)}
                        title="Expand Image"
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="product-price">
                      {product.discount ? (
                        <>
                          <span className="current-price">
                            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                          <span className="original-price">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="current-price">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    {product.rating && (
                      <div className="product-rating">
                        <div className="stars">
                          {renderStars(product.rating)}
                        </div>
                        {product.reviewsCount && (
                          <span className="reviews-count">({product.reviewsCount})</span>
                        )}
                      </div>
                    )}
                    
                    <button className="shop-now-btn">
                      Shop Now <FaArrowRight className="arrow-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {visibleItems < sortedProducts.length && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={handleLoadMore}>
                  Load More Products
                </button>
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="no-products-found">
                <div className="empty-state">
                  <FaShoppingBag className="empty-icon" />
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button 
                    className="reset-filters-btn"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                      setPriceRange([0, 1000]);
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="image-modal" onClick={handleCloseModal}>
            <div className="modal-content">
              <button className="close-modal" onClick={handleCloseModal}>
                ×
              </button>
              <img src={selectedImage} alt="Product Preview" />
            </div>
          </div>
        )}

        {/* Quick View Modal */}
        <div
          className={`quickview-modal ${quickView ? "active" : ""}`}
          onClick={closeQuickView}
        >
          {quickView && (
            <div
              className="quickview-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="quickview-close" onClick={closeQuickView}>
                <FaTimes />
              </button>
              
              <div className="quickview-grid">
                <div className="quickview-image">
                  <img src={quickView.image} alt={quickView.name} />
                  {quickView.discount && (
                    <div className="quickview-badge">-{quickView.discount}%</div>
                  )}
                </div>
                
                <div className="quickview-details">
                  <h2 className="quickview-name">{quickView.name}</h2>
                  
                  <div className="quickview-category">
                    <FaTags className="category-icon" />
                    {quickView.category.charAt(0).toUpperCase() + quickView.category.slice(1)}
                  </div>
                  
                  <div className="quickview-price">
                    {quickView.discount ? (
                      <>
                        <span className="current-price">
                          ${(quickView.price * (1 - quickView.discount / 100)).toFixed(2)}
                        </span>
                        <span className="original-price">
                          ${quickView.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="current-price">${quickView.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {quickView.rating && (
                    <div className="quickview-rating">
                      <div className="stars">
                        {renderStars(quickView.rating)}
                      </div>
                      {quickView.reviewsCount && (
                        <span className="reviews-count">({quickView.reviewsCount} reviews)</span>
                      )}
                    </div>
                  )}
                  
                  <div className="quickview-description">
                    {quickView.description || 
                      "This premium product combines style, comfort and durability. Perfect for everyday use and special occasions alike."}
                  </div>
                  
                  {quickView.sizes && (
                    <div className="quickview-sizes">
                      <h4>Available Sizes</h4>
                      <div className="size-options">
                        {quickView.sizes.map((size, index) => (
                          <span key={index} className="size-option">{size}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {quickView.colors && (
                    <div className="quickview-colors">
                      <h4>Available Colors</h4>
                      <div className="color-options">
                        {quickView.colors.map((color, index) => (
                          <div 
                            key={index} 
                            className="color-option"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="quickview-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        handleAddToCartClick(quickView);
                        closeQuickView();
                      }}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                    
                    <button
                      className={`add-to-wishlist-btn ${isInWishlist(quickView.id) ? 'active' : ''}`}
                      onClick={() => handleAddToWishlistClick(quickView)}
                    >
                      {isInWishlist(quickView.id) ? <FaHeart /> : <FaRegHeart />}
                      {isInWishlist(quickView.id) ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                  
                  <Link
                    to={`/product/${quickView.id}`}
                    className="view-details-btn"
                    onClick={closeQuickView}
                  >
                    View Full Details <FaChevronRight className="arrow-icon" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllProducts;
