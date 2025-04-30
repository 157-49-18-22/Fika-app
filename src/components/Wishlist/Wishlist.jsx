import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaArrowRight, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
<<<<<<< HEAD
import { useAuth } from "../../context/AuthContext";
import LoginPrompt from "../LoginPrompt/LoginPrompt";
=======
>>>>>>> 0c6c6f502019923f6ee4fd1657bc9331f5376831
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
<<<<<<< HEAD
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="wishlist-container">
        <LoginPrompt message="Please login to view and manage your wishlist items. Login to save your favorite products and access them anytime." />
      </div>
    );
  }

=======

>>>>>>> 0c6c6f502019923f6ee4fd1657bc9331f5376831
  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="empty-wishlist-icon">
          <FaHeart />
        </div>
        <h2>Your Wishlist is Empty</h2>
        <p>Save items you love and come back to them later!</p>
        <Link to="/all-products" className="continue-shopping-btn">
          EXPLORE PRODUCTS <FaArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2>
        <FaHeart className="wishlist-title-icon" />
        My Wishlist ({wishlist.length} {wishlist.length === 1 ? "item" : "items"})
      </h2>
      <div className="wishlist-items">
        {wishlist.map((item) => (
          <div key={item.id} className="wishlist-item">
            <div className="wishlist-item-image">
              <img src={item.image} alt={item.name} />
              <button
                className="quick-remove-btn"
                onClick={() => removeFromWishlist(item.id)}
                title="Remove from wishlist"
              >
                <FaTrash />
              </button>
            </div>
            <div className="wishlist-item-details">
              <Link to={`/product/${item.id}`} className="wishlist-item-name">
                {item.name}
              </Link>
              <div className="wishlist-item-category">{item.category}</div>
              <div className="wishlist-item-price">
                {item.discount ? (
                  <>
                    <span className="discounted-price">
                      ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                    </span>
                    <span className="original-price">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="discount-badge">
                      -{item.discount}% OFF
                    </span>
                  </>
                ) : (
                  <span className="regular-price">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="wishlist-item-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <Link to={`/product/${item.id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="wishlist-footer">
        <Link to="/all-products" className="continue-shopping-link">
          <FaArrowRight /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
