import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Payment.css';

const Payment = ({ onClose }) => {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Here you would typically:
    // 1. Validate the form data
    // 2. Send the payment details to your backend
    // 3. Process the payment with Stripe
    // 4. Handle the response

    // Simulating payment processing
    setTimeout(() => {
      setLoading(false);
      // Navigate to success page
      navigate('/payment-success');
    }, 2000);
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Checkout</h2>
        
        <div className="order-overview">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <p>Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p>Total Amount: ${getCartTotal().toFixed(2)}</p>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="method-options">
            <button 
              className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              Credit/Debit Card
            </button>
            <button 
              className={`method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              PayPal
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="form-section">
              <h3>Card Details</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-section">
            <h3>Billing Address</h3>
            <div className="form-row">
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-payment-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment; 