import React from "react";
import "./FashionShowcase.css";

const FashionShowcase = () => {
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
              1200+
            </h1>
            <h2 className="main-subtitle">Awesome Collection</h2>
            <p className="main-description">
              Elevate Your Style With Our Fashion Finds. Discover Your Signature
              Style At Fashion Avenue. Elevate Your Style With Our Fashion
              Finds. Discover Your Signature Style At Fashion Avenue.
            </p>
          </div>
          <div className="shop-nowbtn">
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
                    fontSize: "33px",
                    fontWeight: "500",
                    textTransform: "capitalize",
                    paddingBottom: "20px",
                  }}
                >
                  express your through style
                </p>
                <p
                  style={{
                    padding: "10px",
                    fontWeight: "500",
                    paddingBottom: "0px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  Elevete your style with our fashion finds
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
                      fontSize: "28px",
                      fontWeight: "500",
                      lineHeight: "1.1",
                      color: "#1D1D1D",
                    }}
                  >
                    Unlock Your
                    <br />
                    Fashion
                    <br />
                    Potential!!!
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
