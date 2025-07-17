import React from "react";
import { useNavigate } from "react-router-dom";
import "./FashionShowcase.css";

const FashionShowcase = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/all-products');
  };

  return (
    <div className="fashion-section">
      <h1 className="sectiontitle">
        CRAFT AT YOUR FINGERTIPS
      </h1>
      <div className="fashion-showcase">
        <div className="showcase-main-section">
          <div className="main-content">
            <h1
              className="showcase-main-title"
            >
              100+
            </h1>
            <h2 className="main-subtitle">Collection of Inspired Living</h2>
            <p className="main-description">
            Transform your space with a collection that speaks style and soul. <span className="mobile-hidden">Explore pieces crafted to inspire and elevate everyday living.</span>
            </p>
          </div>
          <div className="shop-nowbtn" onClick={handleShopNow}>
            <span>Shop Now</span>
            <div className="arrow-icon" >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="showcase-side-container">
          <div className="showcase-side-item">
            <div>
              <img src="./side_image2.png" alt="img" />
            </div>
            <div className="showcase-info-card">
              <div className="info-card-header">
                <img src="./image-icon.png" alt="img" />
                <span>
                  cushion collection
                </span>
              </div>
              <div className="info-card-content">
                <p>
                  Express Your Style, one cushion at a time
                </p>
                <p>
                  showcase your style through thoughtfully curated, stylish accents for every space
                  <svg
                    onClick={handleShopNow}
                    xmlns="http://www.w3.org/2000/svg"  
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </p>
              </div>
            </div>
          </div>
          <div className="showcase-side-item">
            <div className="showcase-side-image-container">
              <img src="./side_image1.png" alt="img" />
              <div className="showcase-side-image-overlay">
                <svg
                  onClick={handleShopNow}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="showcase-side-image-bottom">
                <div className="showcase-side-image-card">
                  <div className="showcase-side-image-badge">
                    CUSHION COLLECTION
                  </div>
                  <h2 className="showcase-side-image-title">
                    Let Your Cushions
                    <br />
                    Do The Talking
                    <br />
                    Style That's All You
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionShowcase;
