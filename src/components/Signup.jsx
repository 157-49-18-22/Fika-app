import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login/Login.css';

const sliderImages = [
  'https://images.unsplash.com/photo-1540638349517-3abd5afc5847?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Modern geometric cushions
  'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Cozy textured cushions
  'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Designer pattern cushions
];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [sliderIndex, setSliderIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.terms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (formData.firstName && formData.lastName && formData.email && formData.password && formData.terms) {
      // Signup logic here
      alert('Account created!');
      navigate('/login');
    } else {
      alert('Please fill in all fields');
    }
  };

  // Slider auto-play
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (idx) => setSliderIndex(idx);
  const handlePrev = () => setSliderIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  const handleNext = () => setSliderIndex((prev) => (prev + 1) % sliderImages.length);

  return (
    <div className="login-bg-dark">
      <div className="login-card-dark">
        {/* Left: Image Slider */}
        <div className="login-slider">
          <div className="slider-img-wrapper">
            {sliderImages.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt="slider"
                className={`slider-img${idx === sliderIndex ? ' active' : ''}`}
                style={{ opacity: idx === sliderIndex ? 1 : 0, zIndex: idx === sliderIndex ? 2 : 1 }}
              />
            ))}
            <button className="slider-arrow left" onClick={handlePrev}>&#8592;</button>
            <button className="slider-arrow right" onClick={handleNext}>&#8594;</button>
            <div className="slider-dots">
              {sliderImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`slider-dot${idx === sliderIndex ? ' active' : ''}`}
                  onClick={() => handleDotClick(idx)}
                />
              ))}
            </div>
          </div>
          <div className="slider-overlay">
            <div className="slider-logo">
              FIKA
              <div className="time-display">
                <FaClock className="logo-watch" />
                <span className="time-text">{formatTime(currentTime)}</span>
              </div>
            </div>
            <div className="slider-caption">
              <div>Capturing Moments,<br/>Creating Memories</div>
            </div>
          </div>
        </div>
        {/* Right: Signup Form */}
        <div className="login-form-dark">
          <div className="login-form-title">Create an account</div>
          <div className="login-form-sub">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
          <form className="login-form-fields" onSubmit={handleSubmit}>
            <div className="signup-names-row">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="password-input-container">
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('password')}
                aria-label={showPassword.password ? "Hide password" : "Show password"}
              >
                {showPassword.password ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-input-container">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                aria-label={showPassword.confirmPassword ? "Hide password" : "Show password"}
              >
                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="login-form-check">
              <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} required />
              <label htmlFor="terms">I agree to the <a href="#">Terms & Conditions</a></label>
            </div>
            <button className="login-form-btn" type="submit">Create account</button>
          </form>
          <div className="login-form-or">or register with</div>
          <div className="login-form-socials">
            <button className="social-btn google" type="button">Google</button>
            <button className="social-btn apple" type="button">Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 