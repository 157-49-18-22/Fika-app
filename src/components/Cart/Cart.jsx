import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingCart,
  FaArrowRight,
  FaShoppingBag,
} from "react-icons/fa";
import "./Cart.css";
import Payment from "../Payment/Payment";
import { useAuth } from "../../context/AuthContext";
import LoginPrompt from "../LoginPrompt/LoginPrompt";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="cart-section">
        <LoginPrompt message="Please login to view and manage your cart items. Login to access your shopping cart." />
      </div>
    );
  }

  const handleQuantityDecrease = (productId) => {
    const item = cart.find((item) => item.id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleQuantityIncrease = (productId) => {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const shipping = 0; // Free shipping
  const subtotal = getCartTotal();
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <FaShoppingBag />
          </div>
          <h2>Your Shopping Cart is Empty</h2>
          <p>Discover our amazing collection and add your favorite items to the cart!</p>
          <Link to="/all-products" className="start-shopping-btn">
            START SHOPPING →
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>
        <FaShoppingCart className="cart-title-icon" /> Shopping Cart
      </h2>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name || item.product_name || 'Product'} />
              </div>

              <div className="cart-item-details">
                <Link
                  to={`/product/${item.id}`}
                  className="cart-item-name"
                >
                  {item.name || item.product_name || 'Product'}
                </Link>
                <span className="cart-item-category">{item.category}</span>
                <div className="cart-item-price">
                  {item.discount ? (
                    <>
                      <span className="discounted-price">
                        ₹{((Number(item.price) || 0) * (1 - (Number(item.discount) || 0) / 100)).toFixed(2)}
                      </span>
                      <span className="original-price">
                        ₹{(Number(item.price) || 0).toFixed(2)}
                      </span>
                      <span className="discount-badge">-{item.discount}%</span>
                    </>
                  ) : (
                    `₹${(Number(item.price) || 0).toFixed(2)}`
                  )}
                </div>
              </div>

              <div className="cart-item-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityDecrease(item.id)}
                  disabled={item.quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityIncrease(item.id)}
                >
                  <FaPlus />
                </button>
              </div>

              <div className="cart-item-total">
                <span className="total-label">Total:</span>₹
                {(
                  (item.discount
                    ? (Number(item.price) || 0) * (1 - (Number(item.discount) || 0) / 100)
                    : (Number(item.price) || 0)) * item.quantity
                ).toFixed(2)}
              </div>

              <button
                className="remove-btn"
                onClick={() => handleRemoveItem(item.id)}
                title="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3 className="summary-header">Order Summary</h3>
          <div className="summary-row">
            <span>
              Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})
            </span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">
              {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={() => setShowPayment(true)}>
            Proceed to Checkout
          </button>
          <Link to="/all-products" className="continue-shopping-link">
            <FaArrowRight /> Continue Shopping
          </Link>
        </div>
      </div>
      {showPayment && (
        <Payment onClose={() => setShowPayment(false)} total={total} />
      )}
    </div>
  );
};

export default Cart;
