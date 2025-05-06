import React from "react";
import "./StyleEmpower.css";

const StyleEmpower = () => {
  return (
    <div className="style-empower-container">
      <div className="style-empower-content">
        <div className="style-text-container">
          <div className="text-row first-row">
            <h2 className="style-text">
            Where Comfort 
              <img
                src="/textured_image1.png"
                alt="Texture 1"
                className="textured-image"
              />
            </h2>
          </div>
          <div className="text-row second-row">
            <h2 className="style-text">
              <img
                src="/textured_image2.png"
                alt="Texture 2"
                className="textured-image"
              />
             Meets Craft
            </h2>
          </div>
        

          <div className="button-container">
            <button className="shop-now-button">
              <span>SHOP NOW</span>
              <span className="arrow-line"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleEmpower;
