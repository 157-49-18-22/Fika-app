import React, { useState } from 'react';
import '../styles/Contact.css';
import Testimonials from './Testimonials';
import { FaHeart } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="typing-animation">
          <FaHeart className="heart-icon" /> Get in Touch <FaHeart className="heart-icon" />
        </h1>
        <p className="subtitle">We'd love to hear from you! Whether you have a question about our products,
          need support, or just want to share your experience, we're here to help.</p>
      </div>

      <div className="contact-content">
        <div className="contact-main">
          <div className="contact-form-section">
            <div className="contact-info">
              <div className="info-card">
                <h3>Our Location</h3>
                <p>123 Fashion Street, New York, NY 10001</p>
              </div>
              <div className="info-card">
                <h3>Email Us</h3>
                <p>info@fika.com</p>
              </div>
              <div className="info-card">
                <h3>Call Us</h3>
                <p>+1 (123) 456-7890</p>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
              {showSuccess && (
                <div className="success-message">
                  <span className="success-icon">✓</span>
                  <span className="success-text">Message sent successfully!</span>
                </div>
              )}
            </form>
          </div>
          
          <div className="testimonials-section">
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 