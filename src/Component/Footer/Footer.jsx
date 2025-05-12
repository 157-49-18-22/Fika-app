import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-section">
          <h3 className="footer-heading">CUSTOMER SERVICE</h3>
          <div className="footer-links">
            <Link to="/profile" className="footer-link">My Account</Link>
            <Link to="/returns-exchange" className="footer-link">Returns and Exchange</Link>
            <Link to="/track-order" className="footer-link">Order Tracking</Link>
            <Link to="/shipping-policy" className="footer-link">Shipping Policy</Link>
          </div>
          <p className="copyright">Copyright @2025</p>
        </div>

        {/* Middle Section - Logo */}
        <div className="footer-logo-section">
          <div className="footer-logo">
            <Link to="/" className="logo">
              <img style={{width: "70px"}} src="/fika_page-001.jpg" alt="logo" />
            </Link>
          </div>
          
          <div className="social-links">
            <a href="#" className="social-link facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/fika_x_wishgenie?igsh=emFiOXd1a3g5bmc0" target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-section">
          <h3 className="footer-heading">MORE DETAILS</h3>
          <div className="footer-links">
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/career" className="footer-link">Career</Link>
            <Link to="/business" className="footer-link">Our Business</Link>
            <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer