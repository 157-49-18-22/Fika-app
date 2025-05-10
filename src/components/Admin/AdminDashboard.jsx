import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUsers, FaShoppingCart, FaBox, FaList, FaChartLine, FaMoneyBillWave, FaTruck, FaStar } from 'react-icons/fa';
import axios from 'axios';
import './AdminDashboard.css';
// Modern icons
import { AiOutlineHome, AiOutlineShopping, AiOutlineUser, AiOutlineTags, AiOutlineBarChart, AiOutlineBell, AiOutlineLogout, AiOutlineAppstore } from 'react-icons/ai';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch users
      const usersResponse = await axios.get('http://13.202.119.111:5000/api/users');
      const totalUsers = usersResponse.data.length;
      const maleUsers = usersResponse.data.filter(user => user.gender === 'male').length;
      const femaleUsers = usersResponse.data.filter(user => user.gender === 'female').length;

      // Fetch products
      const productsResponse = await axios.get('http://13.202.119.111:5000/api/products');
      const totalProducts = productsResponse.data.length;

      // Extract unique categories
      const categories = new Set(productsResponse.data.map(product => product.category));
      const totalCategories = categories.size;

      // Set default values for order-related stats
      setStats({
        totalUsers,
        maleUsers,
        femaleUsers,
        totalOrders: 0, // Default value
        totalProducts,
        totalCategories,
        totalRevenue: 0, // Default value
        pendingOrders: 0, // Default value
        averageRating: 0 // Default value
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return <div>Access Denied</div>;
  }

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo"><AiOutlineAppstore size={28} /></span>
          <span className="sidebar-brand">Admin Panel</span>
          <button 
            className="toggle-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineHome /></span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineShopping /></span>
            <span className="nav-text">Products</span>
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineShopping /></span>
            <span className="nav-text">Orders</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineUser /></span>
            <span className="nav-text">Users</span>
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineTags /></span>
            <span className="nav-text">Categories</span>
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineBarChart /></span>
            <span className="nav-text">Analytics</span>
          </NavLink>
          <NavLink to="/admin/notifications" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <span className="nav-icon"><AiOutlineBell /></span>
            <span className="nav-text">Notifications</span>
          </NavLink>
          <button onClick={handleLogout} className="nav-item logout">
            <span className="nav-icon"><AiOutlineLogout /></span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1>Welcome, {user?.displayName || 'Admin'}</h1>
          </div>
        </header>
        
        <div className="admin-main-content">
          {window.location.pathname === '/admin' ? (
            <>
              <h2>Dashboard Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUsers />
                  </div>
                  <div className="stat-info">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                    <div className="stat-details">
                      <span>Male: {stats.maleUsers}</span>
                      <span>Female: {stats.femaleUsers}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaShoppingCart />
                  </div>
                  <div className="stat-info">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                    <div className="stat-details">
                      <span>Pending: {stats.pendingOrders}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaBox />
                  </div>
                  <div className="stat-info">
                    <h3>Total Products</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaList />
                  </div>
                  <div className="stat-info">
                    <h3>Categories</h3>
                    <p className="stat-value">{stats.totalCategories}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₹{stats.totalRevenue}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaTruck />
                  </div>
                  <div className="stat-info">
                    <h3>Pending Orders</h3>
                    <p className="stat-value">{stats.pendingOrders}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaStar />
                  </div>
                  <div className="stat-info">
                    <h3>Average Rating</h3>
                    <p className="stat-value">{stats.averageRating.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 