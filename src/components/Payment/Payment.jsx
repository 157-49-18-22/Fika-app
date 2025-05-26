import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Payment.css";
import { createRazorpayOrder, verifyPayment, testRazorpayConnection, createTestOrder } from "../../firebase/functions";
import { saveSuccessfulPayment, getUser } from "../../firebase/firestore";

const Payment = ({ onClose, total }) => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details if logged in
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const userData = await getUser(currentUser.uid);
          setUserDetails(userData);
        } catch (err) {
          console.error('[PAYMENT] Error fetching user details:', err);
        }
      }
    };
    
    fetchUserDetails();
  }, [currentUser]);

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
      const amount = Number(total); // Use the total prop which includes shipping
      console.log('[PAYMENT] Starting payment process with amount:', amount);
      
      if (amount <= 0) {
        console.error('[PAYMENT] Invalid amount:', amount);
        setError("Invalid payment amount");
        return;
      }
      
      // Create order using Firebase callable function
      console.log('[PAYMENT] Creating Razorpay order...');
      const orderResponse = await createRazorpayOrder(amount);
      console.log('[PAYMENT] Order created successfully:', orderResponse);

      if (!orderResponse || !orderResponse.id) {
        console.error('[PAYMENT] Failed to get valid order response:', orderResponse);
        setError("Failed to create payment order");
        return;
      }

      // Initialize Razorpay options - Following documentation more closely
      const options = {
        key: "rzp_live_oR04gue1fn6wcY", // Updated to production key
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "Fika App",
        description: "Food Order Payment",
        order_id: orderResponse.id,
        callback_url: "https://us-central1-fika-3865e.cloudfunctions.net/verifyPaymentCallback", // Add callback URL
        redirect: false, // Disable redirect to prevent the error
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999"
        },
        notes: {
          address: "Customer Address"
        },
        theme: {
          color: "#000000"
        },
        handler: async function(response) {
          try {
            console.log('[PAYMENT] Handler triggered with response:', response);
            
            if (!response.razorpay_payment_id) {
              console.error('[PAYMENT] Missing payment ID in response');
            }
            if (!response.razorpay_order_id) {
              console.error('[PAYMENT] Missing order ID in response');
            }
            if (!response.razorpay_signature) {
              console.error('[PAYMENT] Missing signature in response');
            }
            
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              console.error('[PAYMENT] Invalid payment response - missing required fields');
              setError("Invalid payment response");
              return;
            }
            
            // Save successful payment to backup collection first
            console.log('[PAYMENT] Saving payment details to backup collection...');
            try {
              await saveSuccessfulPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: options.amount,
                currency: options.currency,
                items: cart.map(item => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  image: item.image,
                  id: item.id || item._id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                })),
                userId: currentUser?.uid || null,
                userDetails: userDetails || {
                  name: options.prefill?.name || 'Guest Customer',
                  email: options.prefill?.email || '',
                  phone: options.prefill?.contact || '',
                  address: options.notes?.address || ''
                },
                shippingAddress: options.notes?.address || '',
                orderDate: new Date().toISOString(),
                orderTotal: total
              });
              console.log('[PAYMENT] Successfully saved payment to backup collection');
            } catch (backupError) {
              console.error('[PAYMENT] Error saving to backup collection:', backupError);
              // Continue despite backup error
            }
            
            // Verify payment using Firebase callable function
            console.log('[PAYMENT] Verifying payment with backend...');
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };
            console.log('[PAYMENT] Verification data:', verificationData);
            
            try {
              const verifyResponse = await verifyPayment(verificationData);
              console.log('[PAYMENT] Verification response received:', verifyResponse);

              if (verifyResponse.verified) {
                console.log('[PAYMENT] Payment successfully verified!');
                alert('Payment Successful');
                
                console.log('[PAYMENT] Clearing cart...');
                clearCart();
              }
            } catch (verifyError) {
              console.error('[PAYMENT] Verification error:', verifyError);
              // Continue despite verification error - just log it
            }
            
            // Always navigate to success page if we have payment ID
            // This happens regardless of verification or database errors
            console.log('[PAYMENT] Navigating to success page...');
            navigate(`/payment-success?order_id=${response.razorpay_order_id}`);
            console.log('[PAYMENT] Navigation triggered');
            
          } catch (err) {
            console.error('[PAYMENT] Error in handler function:', err);
            console.error('[PAYMENT] Error details:', {
              message: err.message,
              stack: err.stack,
              code: err.code,
              details: err.details
            });
            setError("Error verifying payment: " + (err.message || JSON.stringify(err)));
            
            // Even if there's a major error, try to navigate to success if we have payment_id
            if (response && response.razorpay_payment_id && response.razorpay_order_id) {
              navigate(`/payment-success?order_id=${response.razorpay_order_id}`);
            }
          }
        }
      };

      console.log('[PAYMENT] Initializing Razorpay with options:', { 
        ...options, 
        key: options.key.substring(0, 5) + '...'  // Don't log full key
      });
      
      // Create and open Razorpay instance
      console.log('[PAYMENT] Creating Razorpay instance...');
      const paymentObject = new window.Razorpay(options);
      console.log('[PAYMENT] Razorpay instance created');
      
      console.log('[PAYMENT] Opening Razorpay payment form...');
      paymentObject.open();
      console.log('[PAYMENT] Razorpay payment form opened');
    } catch (err) {
      console.error('[PAYMENT] Error in displayRazorpay function:', err);
      console.error('[PAYMENT] Error details:', {
        message: err.message,
        stack: err.stack,
        code: err.code,
        name: err.name,
        data: err.data
      });
      setError("Error in payment processing: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[PAYMENT] Payment form submitted');
    
    if (cart.length === 0) {
      console.error('[PAYMENT] Attempted payment with empty cart');
      setError("Your cart is empty");
      return;
    }
    
    // Load Razorpay script
    console.log('[PAYMENT] Loading Razorpay script...');
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log('[PAYMENT] Razorpay script loaded successfully');
      displayRazorpay();
    };
    script.onerror = (err) => {
      console.error('[PAYMENT] Failed to load Razorpay script:', err);
      setError("Failed to load Razorpay SDK. Please check your internet connection.");
    };
    document.body.appendChild(script);
  };

  // Add test function
  const handleTestOrder = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Create test order
      const orderResponse = await createTestOrder();
      console.log('Test order created:', orderResponse);
      
      // Show success
      setError("Test order success! Order ID: " + orderResponse.id);
    } catch (err) {
      console.error('Test order error:', err);
      setError("Test order error: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const testDirectRazorpay = () => {
    setLoading(true);
    setError("");
    
    try {
      console.log('Testing direct Razorpay integration');
      
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        
        // Create a simple test options object
        const options = {
          key: "rzp_live_oR04gue1fn6wcY", // Updated to production key
          amount: "10000", // 100 INR
          currency: "INR",
          name: "Fika Test",
          description: "Test Transaction",
          // No order_id needed for testing
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#000000"
          },
          handler: function(response) {
            console.log('Test payment response:', response);
            alert('Test payment captured');
          }
        };
        
        console.log('Initializing Razorpay with test options');
        
        try {
          const rzp = new window.Razorpay(options);
          console.log('Razorpay object created:', rzp);
          rzp.open();
          console.log('Razorpay opened');
        } catch (err) {
          console.error('Error initializing Razorpay:', err);
          setError("Error initializing Razorpay: " + err.message);
        }
      };
      
      script.onerror = (err) => {
        console.error('Failed to load Razorpay script:', err);
        setError("Failed to load Razorpay script");
      };
      
      document.body.appendChild(script);
    } catch (err) {
      console.error('Razorpay test error:', err);
      setError("Razorpay test error: " + err.message);
    } finally {
      setLoading(false);
    }
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
            <p>Total Amount: ₹{total.toFixed(2)}</p>
          </div>
        </div>

        {error && <div className="payment-error">{error}</div>}

        <div className="payment-actions">
          <button
            className="submit-payment-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay Now ₹${total.toFixed(2)}`}
          </button>
          {/* <button
            className="submit-payment-btn"
            onClick={() => setShowCODForm(true)}
          >
            Cash on Delivery (COD)
          </button> */}
          {/* <button 
            className="test-payment-btn"
            onClick={handleTestOrder}
            disabled={loading}
          >
            Test Razorpay
          </button>
          <button 
            className="test-payment-btn"
            onClick={testDirectRazorpay}
            disabled={loading}
            style={{marginTop: '10px'}}
          >
            Test Direct Razorpay
          </button> */}
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
