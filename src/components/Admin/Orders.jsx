import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaTrash } from 'react-icons/fa';
import './Orders.css';
import config from '../../config';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/api/orders`);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`${config.API_URL}/api/orders/${id}`);
        fetchOrders();
      } catch (err) {
        console.error('Error deleting order:', err);
        setError('Failed to delete order');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${config.API_URL}/api/orders/${orderId}`, {
        status: newStatus
      });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Orders Management</h2>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer_name}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>₹{order.total_amount}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select ${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="action-buttons">
                  <button 
                    className="view-btn"
                    onClick={() => handleViewOrder(order)}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(order.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Order Details</h3>
            <div className="order-details">
              <div className="detail-group">
                <label>Order ID:</label>
                <span>#{selectedOrder.id}</span>
              </div>
              <div className="detail-group">
                <label>Customer Name:</label>
                <span>{selectedOrder.customer_name}</span>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <span>{selectedOrder.customer_email}</span>
              </div>
              <div className="detail-group">
                <label>Phone:</label>
                <span>{selectedOrder.customer_phone}</span>
              </div>
              <div className="detail-group">
                <label>Shipping Address:</label>
                <span>{selectedOrder.shipping_address}</span>
              </div>
              <div className="detail-group">
                <label>Order Date:</label>
                <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
              </div>
              <div className="detail-group">
                <label>Status:</label>
                <span className={`status-badge ${selectedOrder.status}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="detail-group">
                <label>Total Amount:</label>
                <span>₹{selectedOrder.total_amount}</span>
              </div>
            </div>

            <div className="order-items">
              <h4>Order Items</h4>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-buttons">
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 