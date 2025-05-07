import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';
// Modern icons
import { AiOutlineHome, AiOutlineShopping, AiOutlineUser, AiOutlineTags, AiOutlineBarChart, AiOutlineBell, AiOutlineLogout, AiOutlineAppstore } from 'react-icons/ai';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // if (!user?.isAdmin) {
  //   return <div>Access Denied</div>;
  // }

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
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 