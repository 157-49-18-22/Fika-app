import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../firebase/firestore';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        if (currentUser) {
          // Fetch orders from Firebase using the user's ID
          const userOrders = await getUserOrders(currentUser.uid);
          setOrders(userOrders);
        } else {
          // If not logged in, check localStorage as fallback
          const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          setOrders(storedOrders);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // Format date function
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    
    // Handle ISO string or other date formats
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  // Get order status with proper capitalization and formatting
  const getOrderStatus = (order) => {
    // Check different status fields
    const status = order.status || order.payment_status || order.fulfillment_status || 'Processing';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get order total with proper formatting
  const getOrderTotal = (order) => {
    // Check different amount fields
    const amount = order.total || order.amount || order.total_amount || order.orderTotal || 0;
    return typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  };

  // Get order items with proper formatting
  const getOrderItems = (order) => {
    return order.items || [];
  };

  // Get order date
  const getOrderDate = (order) => {
    return formatDate(order.created_at || order.orderDate || order.date);
  };

  // Get order ID
  const getOrderId = (order) => {
    return order.id || order.orderId || order.razorpay_order_id || 'Unknown';
  };

  if (loading) {
    return (
      <div className="orders-page">
        <h2>My Orders</h2>
        <div className="loading-indicator">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <h2>My Orders</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={getOrderId(order)} className="order-card">
            <div className="order-header">
              <div className="order-details">
                <div><b>Order ID:</b> {getOrderId(order)}</div>
                <div><b>Date:</b> {getOrderDate(order)}</div>
                <div><b>Status:</b> <span className={`status-${getOrderStatus(order).toLowerCase()}`}>{getOrderStatus(order)}</span></div>
                <div><b>Total:</b> ₹{getOrderTotal(order).toFixed(2)}</div>
              </div>
            </div>
            <div className="order-items">
              {getOrderItems(order).map((item, idx) => (
                <div key={idx} className="order-item">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Product' }}
                  />
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">Qty: {item.quantity || item.qty || 1}</div>
                    <div className="item-price">₹{(item.price || 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders; 