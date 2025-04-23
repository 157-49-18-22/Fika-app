import React from "react";
import "./FashionShowcase.css";

const FashionShowcase = () => {
  return (
    <div className="fashion-section">
      <h1 className="section-title" style={{ fontFamily: "carmine" }}>
        FASHION AT YOUR FINGERTIPS
      </h1>
      <div className="fashion-showcase">
        <div className="showcase-main-section">
          <div className="main-content">
            <h1
              className="showcase-main-title"
              style={{ fontFamily: "carmine" }}
            >
              1200+
            </h1>
            <h2 className="main-subtitle">Awesome Collection</h2>
            <p className="main-description">
              Elevate Your Style With Our Fashion Finds. Discover Your Signature
              Style At Fashion Avenue. Elevate Your Style With Our Fashion
              Finds. Discover Your Signature Style At Fashion Avenue.
            </p>
          </div>
          <div className="shop-now-btn">
            <span>Shop Now</span>
            <div className="arrow-icon">
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
          <div style={{ width: "50%" }}>
            <div>
              <img src="./side_image2.png" alt="img" />
            </div>
            <div className="showcase-info-card">
              <div className="info-card-header">
                <img src="./image-icon.png" alt="img" />
                <span
                  style={{ paddingRight: "10px", textTransform: "capitalize" }}
                >
                  cushion collection
                </span>
              </div>
              <div className="info-card-content">
                <p
                  style={{
                    borderBottom: "2px solid #1D1D1D",
                    fontSize: "33px",
                    // fontFamily: "Montserrat",
                    fontWeight: "500",
                    textTransform: "capitalize",
                    paddingBottom: "20px",
                  }}
                >
                  express your through style
                </p>
                <p style={{ padding: "10px" }}>
                  Elevete your style with our fashion finds
                </p>
              </div>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <img src="./side_image1.png" alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionShowcase;
