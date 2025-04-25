import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import '../styles/FashionFooter.css';

const FashionFooter = () => {
  return (
    <div className="fashion-footer">
      <div className="fashion-container">
        {/* Footer Content */}
        <div className="footer-card">
          <div className="footer-grid">
            {/* Help & Information */}
            <div className="footer-section">
              <h2 className="section-title">HELP & INFORMATION</h2>
              <ul className="link-list">
                <li className="link-item"><a href="#">Help</a></li>
                <li className="link-item"><a href="#">Track Order</a></li>
                <li className="link-item"><a href="#">Delivery & Return</a></li>
              </ul>
              <p className="copyright">Copyright @2025</p>
            </div>

            {/* Social Links */}
            <div className="footer-section social-section">
              <h2 className="section-title">Fika</h2>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-icon">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icon">
                  <FaYoutube />
                </a>
                <a href="#" className="social-icon">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            {/* More Details */}
            <div className="footer-section">
              <h2 className="section-title">MORE DETAILS</h2>
              <ul className="link-list">
                <li className="link-item"><a href="#">About us</a></li>
                <li className="link-item"><a href="#">Career</a></li>
                <li className="link-item"><a href="#">Our Business</a></li>
                <li className="link-item"><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionFooter;