import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });

  // Dummy data for demonstration
  useEffect(() => {
    const dummyOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customer: 'John Doe',
        email: 'john@example.com',
        date: '2024-03-15',
        status: 'pending',
        total: 299.99,
        items: 3
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customer: 'Jane Smith',
        email: 'jane@example.com',
        date: '2024-03-14',
        status: 'completed',
        total: 149.99,
        items: 2
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customer: 'Bob Johnson',
        email: 'bob@example.com',
        date: '2024-03-13',
        status: 'processing',
        total: 499.99,
        items: 5
      }
    ];

    setOrders(dummyOrders);
    setFilteredOrders(dummyOrders);
    setLoading(false);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
  };

  useEffect(() => {
    let result = [...orders];

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(order => order.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const daysAgo = new Date(today);
      daysAgo.setDate(today.getDate() - parseInt(filters.dateRange));
      
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= daysAgo;
      });
    }

    // Apply search filter
    if (filters.search) {
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(filters.search) ||
        order.customer.toLowerCase().includes(filters.search) ||
        order.email.toLowerCase().includes(filters.search)
      );
    }

    setFilteredOrders(result);
  }, [filters, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // In a real app, this would be an API call
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Order Management</h2>
        <div className="orders-actions">
          <button className="btn-primary">
            <i className="fas fa-plus"></i> New Order
          </button>
        </div>
      </div>

      <div className="orders-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>
                  <div className="customer-info">
                    <span className="customer-name">{order.customer}</span>
                    <span className="customer-email">{order.email}</span>
                  </div>
                </td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select ${getStatusBadgeClass(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>${order.total.toFixed(2)}</td>
                <td>{order.items}</td>
                <td>
                  <div className="order-actions">
                    <button className="btn-icon" title="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn-icon" title="Edit Order">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-icon" title="Delete Order">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders; 