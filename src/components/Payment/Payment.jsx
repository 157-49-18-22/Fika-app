import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Payment.css";
import { createRazorpayOrder, verifyPayment } from "../../firebase/functions";

const Payment = ({ onClose }) => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // COD state
  const [showCODForm, setShowCODForm] = useState(false);
  const [codForm, setCodForm] = useState({
    name: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    deliveryTime: ''
  });
  const [codSuccess, setCodSuccess] = useState(false);

  const handleCODChange = (e) => {
    setCodForm({ ...codForm, [e.target.name]: e.target.value });
  };

  const handleCODSubmit = (e) => {
    e.preventDefault();
    setCodSuccess(true);
    setShowCODForm(false);

    // Create new order object
    const newOrder = {
      id: 'ORD' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      total: getCartTotal(),
      address: { ...codForm },
      items: cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
        image: item.image
      }))
    };

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Add new order
    localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

    clearCart();
  };

  const displayRazorpay = async () => {
    setLoading(true);
    setError("");

    try {
      const amount = Number(getCartTotal()); // Ensure amount is a number
      // Create order using Firebase callable function
      const orderResponse = await createRazorpayOrder(amount);

      const options = {
        key: "rzp_test_05BxV9TnB6Qc7g", // Updated to match Firebase config
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "Fika App",
        description: "Test Payment",
        order_id: orderResponse.id,
        handler: async function(response) {
          try {
            // Verify payment using Firebase callable function
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.verified) {
              alert('Payment Successful');
              clearCart();
              navigate('/');
            } else {
              setError("Payment verification failed.");
            }
          } catch (err) {
            setError("Error verifying payment: " + (err.message || err));
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
      setError("Error in payment processing: " + (err.message || err));
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
            {loading ? "Processing..." : `Pay Now ₹${getCartTotal().toFixed(2)}`}
          </button>
          <button
            className="submit-payment-btn"
            onClick={() => setShowCODForm(true)}
          >
            Cash on Delivery (COD)
          </button>
        </div>

        {showCODForm && (
          <div className="cod-form-overlay">
            <form className="cod-form" onSubmit={handleCODSubmit}>
              <h3>Enter Delivery Address</h3>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={codForm.name}
                onChange={handleCODChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={codForm.address}
                onChange={handleCODChange}
                required
              />
              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={codForm.landmark}
                onChange={handleCODChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={codForm.city}
                onChange={handleCODChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={codForm.state}
                onChange={handleCODChange}
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={codForm.pincode}
                onChange={handleCODChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={codForm.phone}
                onChange={handleCODChange}
                required
              />
              <input
                type="text"
                name="deliveryTime"
                placeholder="Preferred Delivery Time"
                value={codForm.deliveryTime}
                onChange={handleCODChange}
                required
              />
              <button type="submit">Place Order</button>
            </form>
          </div>
        )}

        {codSuccess && (
          <div className="cod-success-overlay">
            <div className="cod-success-modal">
              <h3>Order Placed Successfully!</h3>
              <p>Your COD order has been placed. Thank you!</p>
              <button onClick={() => { setCodSuccess(false); onClose(); }}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
