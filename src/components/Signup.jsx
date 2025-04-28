import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login/Login.css';

const sliderImages = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
            <div className="slider-logo">AMU</div>
            <button className="slider-back">Back to website</button>
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
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
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