import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./Contact.css";
import Testimonials from "../Testimonials/Testimonials.jsx";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <div className="contact-card-content">
          <div className="contact-form-area">
            <h1 style={{ color: 'black' }}>Let's talk</h1>
            <p style={{ color: 'black' }}>To request a quote or want to meet up for coffee, contact us directly or fill out the form and we will get back to you promptly.</p>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type something if you want..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
              {showSuccess && (
                <div className="success-message">
                  <span>✓ Message sent successfully!</span>
                </div>
              )}
            </form>
          </div>

          <div className="contact-info-area">
            <div className="contact-illustration">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/contact-us-3483601-2912018.png" alt="Contact illustration" />
            </div>
            <div className="contact-details">
              <p><FaMapMarkerAlt /> 151 New Park Ave, Hartford, CT 06106 United States</p>
              <p><FaPhoneAlt /> +1 (203) 302-9545</p>
              <p><FaEnvelope /> contactus@invertasoft.com</p>
            </div>
            <div className="contact-socials">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="testimonials-section-wrapper">
        <Testimonials />
      </div>
    </div>
  );
};

export default Contact; 
