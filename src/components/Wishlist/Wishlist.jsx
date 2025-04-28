import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaArrowRight, FaShoppingCart, FaTrash } from "react-icons/fa";
import { getAllProducts } from "../../data/products";
import "./Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist items from backend
  const fetchWishlist = () => {
    axios.get("http://localhost:5000/api/wishlist")
      .then(res => setWishlist(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add to cart (optional: you can implement backend cart add here)
  const addToCart = (productId) => {
    axios.post("http://localhost:5000/api/cart", { product_id: productId, quantity: 1 })
      .then(() => removeFromWishlistByProductId(productId))
      .catch(err => alert("Error: " + (err.response?.data?.error || err.message)));
  };

  // Remove from wishlist by wishlist id
  const removeFromWishlist = (wishlistId) => {
    axios.delete(`http://localhost:5000/api/wishlist/${wishlistId}`)
      .then(() => fetchWishlist())
      .catch(err => alert("Error: " + (err.response?.data?.error || err.message)));
  };

  // Remove from wishlist by product id (for addToCart)
  const removeFromWishlistByProductId = (productId) => {
    const item = wishlist.find(w => w.product_id === productId);
    if (item) removeFromWishlist(item.id);
  };

  // Merge wishlist with product details
  const products = getAllProducts();
  const mergedWishlist = wishlist.map(item => {
    const product = products.find(p => Number(p.id) === Number(item.product_id));
    return product ? { ...product, ...item } : item;
  });

  if (mergedWishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="empty-wishlist-icon">
          <FaHeart />
        </div>
        <h2>Your Wishlist is Empty</h2>
        <p>Save items you love and come back to them later!</p>
        <Link to="/all-products" className="continue-shopping-btn">
          Explore Products <FaArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2>
        <FaHeart className="wishlist-title-icon" />
        My Wishlist ({mergedWishlist.length} {mergedWishlist.length === 1 ? "item" : "items"})
      </h2>
      <div className="wishlist-items">
        {mergedWishlist.map((item) => (
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
                  onClick={() => addToCart(item.product_id)}
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
