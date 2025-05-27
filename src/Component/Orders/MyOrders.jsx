import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './MyOrders.css';
import { FaSpinner, FaShoppingBag, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        if (user && user.uid) {
          // Fetch orders from successfulPayments collection
          const paymentsQuery = query(
            collection(db, 'successfulPayments'),
            where('userId', '==', user.uid),
            orderBy('payment_date', 'desc')
          );
          
          const querySnapshot = await getDocs(paymentsQuery);
          const ordersData = [];
          
          querySnapshot.forEach((doc) => {
            ordersData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setOrders(ordersData);
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
  }, [user]);

  // Format date function
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore timestamp
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Handle ISO string or other date formats
    try {
      return new Date(timestamp).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Get order status with proper formatting
  const getOrderStatus = (order) => {
    const status = order.status || order.payment_status || order.fulfillment_status || 'Processing';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('success') || statusLower.includes('complete') || statusLower === 'delivered') {
      return 'success';
    } else if (statusLower.includes('process') || statusLower === 'pending' || statusLower === 'shipping') {
      return 'processing';
    } else if (statusLower.includes('cancel') || statusLower.includes('fail')) {
      return 'cancelled';
    }
    return 'default';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get order images
  const getItemImages = (item) => {
    if (!item.image) return ['https://placehold.co/100x100?text=Product'];
    
    // Handle comma-separated image URLs
    if (typeof item.image === 'string' && item.image.includes(',')) {
      return item.image.split(',')[0].trim();
    }
    
    return item.image;
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h2><FaShoppingBag /> My Orders</h2>
        </div>
        <hr className="divider" />
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h2><FaShoppingBag /> My Orders</h2>
        </div>
        <hr className="divider" />
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2><FaShoppingBag /> My Orders</h2>
      </div>
      <hr className="divider" />
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-count">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      )}
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-id">
                <strong>Order ID:</strong> {order.razorpay_order_id || order.id}
              </div>
              <div className={`order-status status-${getStatusColor(getOrderStatus(order))}`}>
                <FaCheckCircle /> {getOrderStatus(order)}
              </div>
            </div>
            
            <div className="order-info">
              <div className="order-date">
                <FaCalendarAlt className="icon" />
                <span>{formatDate(order.payment_date || order.created_at || order.orderDate)}</span>
              </div>
              <div className="order-total">
                <FaMoneyBillWave className="icon" />
                <span>{formatCurrency(order.amount || order.total_amount || order.orderTotal || 0)}</span>
              </div>
            </div>
            
            <div className="order-items">
              {(order.items || []).map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img 
                      src={getItemImages(item)} 
                      alt={item.name} 
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Product' }}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price-qty">
                      <span>{formatCurrency(item.price || 0)}</span>
                      <span>×</span>
                      <span>{item.quantity || item.qty || 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {order.shippingAddress && (
              <div className="order-address">
                <div className="address-header">
                  <FaMapMarkerAlt className="icon" />
                  <span>Delivery Address</span>
                </div>
                <div className="address-details">
                  <div className="address-name">{order.shippingAddress.fullName}</div>
                  <div className="address-content">
                    {order.shippingAddress.addressLine1},
                    {order.shippingAddress.addressLine2 && ` ${order.shippingAddress.addressLine2},`}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                  </div>
                  <div className="address-phone">{order.shippingAddress.mobile}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders; 