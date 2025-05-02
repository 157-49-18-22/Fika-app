import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Payment.css";

const Payment = ({ onClose }) => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const displayRazorpay = async () => {
    setLoading(true);
    setError("");

    try {
      const options = {
        key: "rzp_test_2LKLmubQ5uu0M4",
        amount: Math.round(getCartTotal() * 100),
        currency: "INR",
        name: "Fika App",
        description: "Test Payment",
        handler: function(response) {
          console.log("Payment ID: ", response.razorpay_payment_id);
          alert('Payment Successful');
          clearCart();
          navigate('/');
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        notes: {
          address: "Customer Address"
        },
        theme: {
          color: "#000000"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      setError("Error in payment processing: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }
    
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      displayRazorpay();
    };
    script.onerror = () => {
      setError("Failed to load Razorpay SDK. Please check your internet connection.");
    };
    document.body.appendChild(script);
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Checkout</h2>

        <div className="order-overview">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <p>
              Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
            <p>Total Amount: ₹{getCartTotal().toFixed(2)}</p>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="method-options">
            <button
              className={`method-btn ${paymentMethod === "card" ? "active" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              Credit/Debit Card
            </button>
            <button
              className={`method-btn ${paymentMethod === "upi" ? "active" : ""}`}
              onClick={() => setPaymentMethod("upi")}
            >
              UPI
            </button>
          </div>
        </div>

        {error && <div className="payment-error">{error}</div>}

        <div className="payment-actions">
          <button
            className="submit-payment-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ₹${getCartTotal().toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
