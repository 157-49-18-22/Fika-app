import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingCart,
  FaArrowRight,
  FaShoppingBag,
  FaCheck,
  FaCheckSquare,
  FaSquare
} from "react-icons/fa";
import "./Cart.css";
import Payment from "../Payment/Payment";
import { useAuth } from "../../context/AuthContext";
import LoginPrompt from "../LoginPrompt/LoginPrompt";
import { checkPromoEligibility } from '../../firebase/functions';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart, 
    selectedItems,
    toggleItemSelection,
    selectAllItems,
    unselectAllItems,
    getSelectedItemsTotal,
    removeSelectedItems
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  // Listen for payment success
  useEffect(() => {
    const handlePaymentSuccess = (event) => {
      if (event.data === 'payment_success') {
        // Remove selected items from cart
        removeSelectedItems();
        // Close the payment modal
        setShowPayment(false);
        // Redirect to orders page
        navigate('/my-orders');
      }
    };

    window.addEventListener('message', handlePaymentSuccess);
    return () => window.removeEventListener('message', handlePaymentSuccess);
  }, [removeSelectedItems, navigate]);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('Cart was updated from another component');
      // The cart state is already managed by the CartContext
      // This just forces a re-render if needed
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

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
  
  const handleToggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (!selectMode) {
      // When entering select mode, select all items by default
      selectAllItems();
    }
  };
  
  const handleToggleItemSelection = (productId) => {
    toggleItemSelection(productId);
  };
  
  const handleSelectAll = () => {
    selectAllItems();
  };
  
  const handleUnselectAll = () => {
    unselectAllItems();
  };

  const subtotal = getCartTotal();
  const selectedTotal = getSelectedItemsTotal();
  const shipping = selectedTotal >= 2999 ? 0 : 0; 
  const total = selectedTotal + shipping;


  // Promo code validation (simulate backend check for now)
  const handleApplyPromo = async () => {
    setPromoError("");
    if (promoApplied) {
      // Remove promo code
      setPromoApplied(false);
      setPromoCode("");
      setDiscount(0);
      setPromoError("");
      return;
    }
    if (promoCode.trim().toUpperCase() !== "NEW10OFF") {
      setPromoError("Invalid promo code.");
      setPromoApplied(false);
      setDiscount(0);
      return;
    }
    setPromoLoading(true);
    try {
      const data = await checkPromoEligibility(user?.uid, promoCode.trim().toUpperCase());
      if (data.eligible) {
        setPromoApplied(true);
        setDiscount(selectedTotal * 0.1);
        setPromoError("");
      } else {
        setPromoApplied(false);
        setDiscount(0);
        setPromoError(data.message || "Promo code not eligible.");
      }
    } catch (err) {
      setPromoApplied(false);
      setDiscount(0);
      setPromoError("Error checking promo code. Try again.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item for checkout.");
      return;
    }
    
    // Show payment component
    setShowPayment(true);
  };

  const totalAfterDiscount = promoApplied ? selectedTotal - discount + shipping : selectedTotal + shipping;

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
      <div className="cart-header">
        <h2>
          <FaShoppingCart className="cart-title-icon" /> Shopping Cart
        </h2>
        <div className="cart-header-actions">
          <button 
            className={`select-mode-btn ${selectMode ? 'active' : ''}`} 
            onClick={handleToggleSelectMode}
          >
            {selectMode ? 'Exit Selection' : 'Select Items'}
          </button>
          {selectMode && (
            <div className="selection-actions">
              <button onClick={handleSelectAll}>Select All</button>
              <button onClick={handleUnselectAll}>Unselect All</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => {
            const isSelected = selectedItems.some(selectedItem => selectedItem.id === item.id);
            
            return (
              <div key={item.id} className={`cart-item ${isSelected && selectMode ? 'selected' : ''}`}>
                {selectMode && (
                  <div 
                    className="cart-item-select" 
                    onClick={() => handleToggleItemSelection(item.id)}
                  >
                    {isSelected ? <FaCheckSquare className="select-icon selected" /> : <FaSquare className="select-icon" />}
                  </div>
                )}
                
                <div className="cart-item-image">
                  <img 
                    src={item.image ? '/' + item.image.split(',')[0].trim() : ''} 
                    alt={item.name || item.product_name || 'Product'} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/100x100?text=Product';
                    }}
                  />
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
            );
          })}
        </div>

        <div className="order-summary">
          <div className="promo-info-banner">10% off on your first order! Use code <b>NEW10OFF</b></div>
          <h3 className="summary-header">Order Summary</h3>
          
          {selectMode && (
            <div className="selection-summary">
              <div className="summary-row">
                <span>Selected Items:</span>
                <span>{selectedItems.length} of {cart.length}</span>
              </div>
            </div>
          )}
          
          <div className="promo-code-section">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              disabled={promoApplied}
              className="promo-input"
              style={{textTransform:'uppercase'}}
            />
            <button onClick={handleApplyPromo} className="apply-promo-btn" disabled={promoLoading}>
              {promoLoading ? "Please wait..." : promoApplied ? "Remove" : "Apply"}
            </button>
          </div>
          <div className="summary-row">
            {promoError && <div className="promo-error">{promoError}</div>}
            {promoApplied && <div className="promo-success">10% off applied!</div>}
          </div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{selectedTotal.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="summary-row promo-discount">
              <span>Promo Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping:</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row shipping-note">
            <span className="shipping-info-animated" style={{margin:'auto'}}>Free shipping on orders above ₹2999</span>
          </div>
          <div className="summary-row total-row">
            <span>Total:</span>
            <span>₹{totalAfterDiscount.toFixed(2)}</span>
          </div>
          <button 
            className="checkout-btn" 
            onClick={handleCheckout}
            disabled={selectMode && selectedItems.length === 0}
          >
            {selectMode ? `Checkout Selected (${selectedItems.length})` : 'Proceed to Checkout'}
          </button>
          <Link to="/all-products" className="continue-shopping-link">
            <FaArrowRight /> Continue Shopping
          </Link>
        </div>
      </div>
      {showPayment && (
        <Payment
          selectedItems={selectedItems}
          total={totalAfterDiscount}
          promoCode={promoApplied ? promoCode.trim().toUpperCase() : null}
          discount={promoApplied ? discount : 0}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default Cart;
