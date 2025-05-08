import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Payment.css";
import axios from "axios";

const Payment = ({ onClose }) => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const displayRazorpay = async () => {
    setLoading(true);
    setError("");

    try {
      // Create order on backend
      const orderResponse = await axios.post('http://13.202.119.111:5000/api/payment/create-order', {
        amount: Math.round(getCartTotal() * 100), // Convert to paise
        currency: "INR"
      });

      const options = {
        key: "rzp_test_2LKLmubQ5uu0M4",
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "Fika App",
        description: "Test Payment",
        order_id: orderResponse.data.id,
        handler: async function(response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post('http://13.202.119.111:5000/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              alert('Payment Successful');
              clearCart();
              navigate('/');
            } else {
              setError("Payment verification failed");
            }
          } catch (err) {
            console.error('Verification error:', err);
            setError("Error verifying payment");
          }
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
