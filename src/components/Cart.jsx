import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaShoppingCart, FaArrowRight, FaShoppingBag, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "./LoginPrompt/LoginPrompt";
import "./Cart/Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <LoginPrompt message="Please login to view and manage your cart items. Login to save your shopping cart and proceed to checkout." />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/all-products" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>
          <FaShoppingCart className="cart-title-icon" /> Shopping Cart
        </h2>
      </div>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-category">{item.category}</p>
                <div className="cart-item-price">
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
                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <h3 className="summary-header">Order Summary</h3>
          <div className="promo-code">
            <input
              type="text"
              className="promo-code-input"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="submit-promo">Apply</button>
          </div>
          <div className="summary-row">
            <span>
              Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={() => setShowPayment(true)}>
            Proceed to Checkout
          </button>
          <Link to="/all-products" className="continue-shopping-link">
            <FaArrowRight /> Continue Shopping
          </Link>
        </div>
      </div>
      {/* Payment modal can be added here if needed */}
    </div>
  );
};

export default Cart; 