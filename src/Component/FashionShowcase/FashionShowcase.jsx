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
            Transform your space with a collection that speaks style and soul. Explore pieces crafted to inspire and elevate everyday living.
            </p>
          </div>
          <div className="shop-nowbtn" onClick={handleShopNow} style={{ cursor: 'pointer' }}>
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
                  style={{
                    paddingRight: "10px",
                    textTransform: "capitalize",
                    fontWeight: "500",
                  }}
                >
                  cushion collection
                </span>
              </div>
              <div className="info-card-content">
                <p
                  style={{
                    borderBottom: "2px solid #1D1D1D",
                    fontSize: "22px",
                    fontWeight: "500",
                    textTransform: "capitalize",
                    paddingBottom: "20px",
                  }}
                >
                  Express Your Style, one cushion at a time
                </p>
                <p
                  style={{
                    padding: "10px",
                    fontWeight: "500",
                    fontSize: "14px",
                    paddingBottom: "0px",
                    display: "flex",
                    alignItems: "center",
                    textTransform: "capitalize",
                    gap: "10px",
                    lineHeight: "1.5",
                  }}
                >
                  showcase your style through thoughtfully curated, stylish accents for every space
                  <svg
                    xmlns="http://www.w3.org/2000/svg"  
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: "rotate(-45deg)" }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </p>
              </div>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <div style={{ position: "relative" }}>
              <img src="./side_image1.png" alt="img" />
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "white",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: "rotate(-45deg)" }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "20px",
                    padding: "30px 20px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: "white",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "8px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      marginBottom: "20px",
                      position: "relative",
                      top: "-10px",
                    }}
                  >
                    CUSHION COLLECTION
                  </div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "500",
                      lineHeight: "1.1",
                      color: "#1D1D1D",
                    }}
                  >
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
