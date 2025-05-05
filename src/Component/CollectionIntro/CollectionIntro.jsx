import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CollectionIntro.css';

const CircleText = () => {
  return (
    <div className="circle-text">
      <svg viewBox="0 0 100 100">
        <path id="circle" d="M 50, 50 m -25, 0 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0" fill="transparent" />
        <text>
          <textPath href="#circle">
            EXPLORE MORE • EXPLORE MORE •
          </textPath>
        </text>
      </svg>
    </div>
  );
};

const CollectionIntro = () => {
  const navigate = useNavigate();

  const handleCircleClick = () => {
    navigate('/new-arrivals-wish');
  };

  return (
    <section className="collection-intro">
      <div className="mint-container">
        {/* Left side heading */}
        <div className="heading-container">
          <h1 className="main-heading">
            ELEVATE YOUR WARDROBE<br />
            WITH OUR FASHION FINDS
          </h1>
        </div>
        
        {/* Right side descriptive text */}
        <div className="description-container">
          <p>Elevate Your Style With Our Fashion Finds.</p>
          <p>Discover Your Signature Style</p>
        </div>
        
        {/* Collection intro inner container */}
      </div>
        <div className="collection-intro-container">
          {/* Overlaid image */}
          <div className="intro-image">
            <img src="/wish_ginne.jpg" alt="New collection with decorative pillows and throw" />

            {/* shop now button */}
            <button className="wish-btn" onClick={handleCircleClick}>
              Shop Now
            </button>
          
            {/* Circular indicator */}
            <div className="circle-indicator" onClick={handleCircleClick}>
              <CircleText />
              <div className="circle-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default CollectionIntro; 