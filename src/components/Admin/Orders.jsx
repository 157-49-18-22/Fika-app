import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaSearch, FaFilter, FaDownload, FaExclamationCircle } from 'react-icons/fa';
import './Orders.css';
import { getAllOrdersForAdmin, updateOrderStatus, deleteOrder } from '../../firebase/firestore';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getAllOrdersForAdmin();
      
      // Transform the data to handle different formats from both collections
      const transformedOrders = ordersData.map(order => {
        // Extract customer info based on the source
        let customerName = 'N/A';
        let customerEmail = 'N/A';
        let customerPhone = 'N/A';
        let shippingAddress = 'N/A';
        
        if (order.source === 'orders') {
          // Standard orders collection format
          customerName = order.customer?.name || 'N/A';
          customerEmail = order.customer?.email || 'N/A';
          customerPhone = order.customer?.phone || 'N/A';
          shippingAddress = order.shipping?.address || 'N/A';
        } else {
          // successfulPayments collection format
          customerName = order.userDetails?.name || 'N/A';
          customerEmail = order.userDetails?.email || 'N/A';
          customerPhone = order.userDetails?.phone || 'N/A';
          shippingAddress = order.shippingAddress || order.userDetails?.address || 'N/A';
        }
        
        // Handle different date formats
        let createdDate;
        if (order.created_at?.toDate) {
          createdDate = order.created_at.toDate();
        } else if (order.created_at) {
          createdDate = new Date(order.created_at);
        } else if (order.orderDate) {
          createdDate = new Date(order.orderDate);
        } else {
          createdDate = new Date();
        }
        
        // Handle different amount formats (paise vs rupees)
        let totalAmount;
        if (order.amount) {
          // Razorpay stores amounts in paise (100 paise = 1 rupee)
          totalAmount = order.amount / 100;
        } else if (order.total_amount) {
          totalAmount = order.total_amount;
        } else if (order.orderTotal) {
          totalAmount = order.orderTotal;
        } else {
          totalAmount = 0;
        }
        
        return {
          ...order,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          total_amount: totalAmount,
          items: order.items || [],
          created_at: createdDate,
          formatted_date: createdDate.toLocaleDateString(),
          formatted_time: createdDate.toLocaleTimeString(),
          status: order.status || order.payment_status || 'pending'
        };
      });
      
      setOrders(transformedOrders);
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

  const handleDelete = async (id, source) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        console.log(`Deleting order ${id} from ${source} collection`);
        await deleteOrder(id, source);
        await fetchOrders(); // Refresh the orders list
      } catch (err) {
        console.error('Error deleting order:', err);
        setError('Failed to delete order: ' + err.message);
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus, source) => {
    try {
      console.log(`Updating order ${orderId} from ${source} to status: ${newStatus}`);
      await updateOrderStatus(orderId, newStatus, source);
      await fetchOrders(); // Refresh the orders list
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status: ' + err.message);
    }
  };

  // Filter and search functions
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Search term filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        (order.razorpay_order_id && order.razorpay_order_id.toLowerCase().includes(search)) ||
        (order.id && order.id.toLowerCase().includes(search)) ||
        order.customer_name.toLowerCase().includes(search) ||
        order.customer_email.toLowerCase().includes(search) ||
        order.customer_phone.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  const exportToCSV = () => {
    // Create CSV data
    const headers = ['Order ID', 'Source', 'Customer', 'Email', 'Phone', 'Date', 'Amount', 'Status'];
    const csvData = filteredOrders.map(order => [
      order.razorpay_order_id || order.id,
      order.source || 'orders',
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      order.formatted_date,
      order.total_amount.toFixed(2),
      order.status
    ]);
    
    // Combine headers and data
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading">Loading...</div>;
  
  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Orders Management</h2>
        <div className="orders-count">
          <span>Total Orders: {orders.length}</span>
          {error && <div className="error-banner"><FaExclamationCircle /> {error}</div>}
        </div>
      </div>

      <div className="orders-controls">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <FaFilter />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <button className="export-btn" onClick={exportToCSV}>
          <FaDownload /> Export CSV
        </button>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Source</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-orders">No orders found</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.razorpay_order_id || order.id}</td>
                  <td>
                    <span className={`source-badge ${order.source}`}>
                      {order.source || 'orders'}
                    </span>
                  </td>
                  <td>{order.customer_name}</td>
                  <td>{order.formatted_date}</td>
                  <td>₹{order.total_amount.toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value, order.source)}
                      className={`status-select ${order.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
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
                      onClick={() => handleDelete(order.id, order.source)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Order Details</h3>
            
            <div className="order-id-section">
              <h4>Order #{selectedOrder.razorpay_order_id || selectedOrder.id}</h4>
              <div className="order-meta">
                <span className={`status-badge ${selectedOrder.status}`}>
                  {selectedOrder.status}
                </span>
                <span className={`source-badge ${selectedOrder.source}`}>
                  {selectedOrder.source || 'orders'}
                </span>
              </div>
            </div>
            
            <div className="order-sections">
              <div className="order-section">
                <h4>Customer Information</h4>
                <div className="order-details">
                  <div className="detail-group">
                    <label>Name:</label>
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
                </div>
              </div>
              
              <div className="order-section">
                <h4>Shipping Information</h4>
                <div className="order-details">
                  <div className="detail-group">
                    <label>Address:</label>
                    <span>{selectedOrder.shipping_address}</span>
                  </div>
                </div>
              </div>
              
              <div className="order-section">
                <h4>Order Information</h4>
                <div className="order-details">
                  <div className="detail-group">
                    <label>Order Date:</label>
                    <span>{selectedOrder.created_at.toLocaleString()}</span>
                  </div>
                  <div className="detail-group">
                    <label>Total Amount:</label>
                    <span>₹{selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="detail-group">
                    <label>Status:</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value, selectedOrder.source)}
                      className={`status-select ${selectedOrder.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="order-section">
                <h4>Payment Information</h4>
                <div className="order-details">
                  {selectedOrder.razorpay_payment_id ? (
                    <>
                      <div className="detail-group">
                        <label>Payment ID:</label>
                        <span>{selectedOrder.razorpay_payment_id}</span>
                      </div>
                      <div className="detail-group">
                        <label>Payment Method:</label>
                        <span>{selectedOrder.payment_method || 'Razorpay'}</span>
                      </div>
                      <div className="detail-group">
                        <label>Payment Status:</label>
                        <span className="status-badge success">
                          {selectedOrder.payment_status || 'Successful'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="detail-group">
                      <span>Payment information not available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="order-items">
              <h4>Order Items</h4>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
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
                        <td>
                          {item.image && (
                            <img src={item.image} alt={item.name} className="item-image" />
                          )}
                          <span>{item.name}</span>
                        </td>
                        <td>{item.quantity}</td>
                        <td>₹{parseFloat(item.price).toFixed(2)}</td>
                        <td>₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan="3">Total</td>
                      <td>₹{selectedOrder.total_amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="no-items">No items found for this order</p>
              )}
            </div>

            <div className="order-notes">
              <h4>Order Notes</h4>
              <textarea 
                placeholder="Add notes about this order..." 
                defaultValue={selectedOrder.notes || ''}
                className="order-notes-textarea"
              ></textarea>
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