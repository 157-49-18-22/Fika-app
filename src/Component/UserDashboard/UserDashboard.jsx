import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog, FaHistory } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getUserName = () => {
    const name = currentUser?.email.split('@')[0];
    return name?.charAt(0).toUpperCase() + name?.slice(1);
  };

  // Show login dropdown if not logged in
  if (!currentUser) {
    return (
      <div className="user-dashboard" ref={dropdownRef}>
        <button 
          className="login-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaUser className="login-icon" />
          Login
        </button>

        {isOpen && (
          <div className="login-dropdown">
            <div className="login-header">
              <h4>Login</h4>
              <p>Get access to your Orders, Wishlist and Recommendations</p>
            </div>
            <div className="login-content">
              <Link to="/login" className="login-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <div className="signup-prompt">
                <span>New customer?</span>
                <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show dashboard if logged in
  return (
    <div className="user-dashboard" ref={dropdownRef}>
      <button 
        className="user-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Dashboard"
      >
        <FaUser />
      </button>

      {isOpen && (
        <div className="dashboard-dropdown">
          <div className="dashboard-header">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-info">
              <h4>Welcome, {getUserName()}</h4>
              <p>{currentUser.email}</p>
            </div>
          </div>

          <div className="dashboard-menu">
            <Link to="/profile" className="menu-item">
              <FaUser className="menu-icon" />
              <span>My Profile</span>
            </Link>
            <Link to="/orders" className="menu-item">
              <FaHistory className="menu-icon" />
              <span>My Orders</span>
            </Link>
            <Link to="/settings" className="menu-item">
              <FaCog className="menu-icon" />
              <span>Settings</span>
            </Link>
            <button className="menu-item logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="menu-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard; 