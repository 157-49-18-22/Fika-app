import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { FaSearch, FaShoppingCart, FaHeart, FaBars } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { getAllProducts } from "../../data/products";
import UserDashboard from "../UserDashboard/UserDashboard";
import { useAuthRedirect } from '../../utils/authUtils';
import LoginPrompt from "../../components/LoginPrompt/LoginPrompt";

function Navbar() {
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { requireAuth, showLoginPrompt, setShowLoginPrompt } = useAuthRedirect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Get all products for search
  const allProducts = getAllProducts();

  // Filter products based on search query
  const filteredProducts = allProducts.filter(
    (product) =>
      searchQuery &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5); // Limit to 5 results

  const words = ["Search Products", "Find Your Style", "Discover Fashion", "Explore Collections"];

  useEffect(() => {
    let timeout;
    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
      setTypingText(currentWord.substring(0, typingText.length - 1));
      setTypingSpeed(50);
    } else {
      setTypingText(currentWord.substring(0, typingText.length + 1));
      setTypingSpeed(150);
    }

    if (!isDeleting && typingText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typingText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }

    timeout = setTimeout(() => {
      if (isDeleting) {
        setTypingText(currentWord.substring(0, typingText.length - 1));
      } else {
        setTypingText(currentWord.substring(0, typingText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, currentWordIndex]);

  // Handle click outside to close dropdown
  useEffect(() => {
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/all-products?search=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
      setSearchQuery("");
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (!requireAuth('view wishlist')) {
      setShowLoginPrompt(true);
      return;
    }
    navigate('/wishlist');
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!requireAuth('view cart')) {
      setShowLoginPrompt(true);
      return;
    }
    navigate('/cart');
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-container">
          {/* <button className="mobile-menu-toggle" aria-label="Toggle menu">
            <FaBars />
          </button> */}

          <div className="navbar-left">
            <NavLink to="/new-arrivals" className="nav-link">New Arrival</NavLink>
            <NavLink to="/all-products" className="nav-link">All Product</NavLink>
            <NavLink to="/blog" className="nav-link">Blog</NavLink>
            <NavLink to="/about" className="nav-link">About Us</NavLink>
            <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
          </div>

          <div className="navbar-center">
            <Link to="/" className="logo">Fika</Link>
          </div>

          <div className="navbar-right">
            <div className="search-bar" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder={typingText}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchQuery) setShowDropdown(true);
                  }}
                />
                <button type="submit" className="search-btn">
                  <FaSearch size={14} />
                </button>
              </form>

              {/* Search Results Dropdown */}
              {showDropdown && searchQuery && (
                <div className="search-results-dropdown">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="search-result-item"
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setShowDropdown(false);
                        setSearchQuery("");
                      }}
                    >
                      <img src={product.image} alt={product.name} className="search-result-image" />
                      <div className="search-result-info">
                        <div className="search-result-name">{product.name}</div>
                        <div className="search-result-price">${product.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="no-results">No products found</div>
                  )}
                </div>
              )}
            </div>
            <Link to="/wishlist" className="" aria-label="Wishlist" onClick={handleWishlistClick}>
              <FaHeart style={{ color: '#333' }} />
              {wishlist.length > 0 && (
                <span className="badge">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/cart" className="" aria-label="Shopping Cart" onClick={handleCartClick}>
              <FiShoppingBag style={{ color: '#333' }} />
              {getCartCount() > 0 && (
                <span className="badge">{getCartCount()}</span>
              )}
            </Link>
            <UserDashboard />
          </div>
        </div>
      </div>
      
      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={handleCloseLoginPrompt}>
          <div className="login-prompt-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginPrompt message="Please login to access your cart and wishlist items." />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
