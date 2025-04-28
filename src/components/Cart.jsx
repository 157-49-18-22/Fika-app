import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaMinus, FaTrash, FaShoppingCart, FaArrowRight, FaShoppingBag } from "react-icons/fa";
import { getAllProducts } from "../data/products";
import "./Cart/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  // Fetch cart items from backend
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios.get("http://localhost:5000/api/cart")
      .then(res => setCart(res.data))
      .catch(err => console.error(err));
  };

  // Remove item from cart
  const removeFromCart = (cartId) => {
    axios.delete(`http://localhost:5000/api/cart/${cartId}`)
      .then(res => {
        fetchCart();
      })
      .catch(err => {
        console.error(err);
        alert("Error: " + (err.response?.data?.error || err.message));
      });
  };

  // Update quantity in cart
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    axios.patch(`http://localhost:5000/api/cart/${cartId}`, { quantity: newQuantity })
      .then(() => fetchCart())
      .catch(err => {
        console.error(err);
        alert("Error: " + (err.response?.data?.error || err.message));
      });
  };

  // Merge cart items with product details
  const products = getAllProducts();
  const mergedCart = cart.map(item => {
    const product = products.find(p => p.id === item.product_id);
    return product
      ? { ...product, ...item, productId: product.id, cartId: item.id }
      : item;
  });

  // Calculate subtotal
  const subtotal = mergedCart.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  if (mergedCart.length === 0) {
    return (
      <div className="cart-section">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <FaShoppingBag />
          </div>
          <h2>Your Shopping Cart is Empty</h2>
          <p>Discover our amazing collection and add your favorite items to the cart!</p>
          <Link to="/all-products" className="continue-shopping-btn">
            Start Shopping <FaArrowRight />
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
          {mergedCart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-item-details">
                <Link to={`/product/${item.id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <span className="cart-item-category">{item.category}</span>
                <div className="cart-item-price">
                  {item.discount ? (
                    <>
                      <span className="discounted-price">
                        ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                      </span>
                      <span className="original-price">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="discount-badge">-{item.discount}%</span>
                    </>
                  ) : (
                    `$${item.price.toFixed(2)}`
                  )}
                </div>
              </div>
              <div className="cart-item-quantity">
                <button className="quantity-btn" onClick={() => updateQuantity(item.cartId, item.quantity - 1)} disabled={item.quantity <= 1}>
                  <FaMinus />
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button className="quantity-btn" onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>
                  <FaPlus />
                </button>
              </div>
              <div className="cart-item-total">
                <span className="total-label">Total:</span>$
                {(
                  (item.discount
                    ? item.price * (1 - item.discount / 100)
                    : item.price) * item.quantity
                ).toFixed(2)}
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.cartId)}
                title="Remove item"
              >
                <FaTrash />
              </button>
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
              Subtotal ({mergedCart.length} {mergedCart.length === 1 ? "item" : "items"})
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