import React from "react";
import "./Navbar.css";
import { FaSearch, FaShoppingCart, FaHeart, FaBars } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";

function Navbar() {
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  return (
    <div className="navbar">
      <div className="navbar-container">
        <button className="mobile-menu-toggle" aria-label="Toggle menu">
          <FaBars />
        </button>

        <div className="navbar-left">
          <NavLink to="/new-arrivals" className="nav-link">
            New Arrival
          </NavLink>
          <NavLink to="/all-products" className="nav-link">
            All Product
          </NavLink>
          <NavLink to="/blog" className="nav-link">
            Blog
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact Us
          </NavLink>
        </div>

        <div className="navbar-center">
          <Link to="/" className="logo">
            Fika
          </Link>
        </div>

        <div className="navbar-right">
          <div className="search-bar">
            <input type="text" placeholder="Search Product..." />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
          <div className="header-actions">
            <Link
              to="/wishlist"
              className="action-btn wishlist-btn"
              aria-label="Wishlist"
            >
              <FaHeart />
              {wishlist.length > 0 && (
                <span className="badge">{wishlist.length}</span>
              )}
            </Link>
            <Link
              to="/cart"
              className="action-btn cart-btn"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart />
              {getCartCount() > 0 && (
                <span className="badge">{getCartCount()}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
