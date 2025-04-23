import React from 'react'
import './StyleEmpower.css'

const StyleEmpower = () => {
  return (
    <div className="style-empower-container">
      <div className="style-empower-content">
        <div className="style-text-container">
          <div className="text-row first-row">
            <h2 className="style-text">YOUR STYLE <span className="style-image-marker right"></span></h2>
          </div>
          <div className="text-row second-row">
            <h2 className="style-text"><span className="style-image-marker left"></span> YOUR RULES</h2>
          </div>
          <div className="text-row third-row">
            <h1 className="empower-text">EMPOWER YOUR FASHION</h1>
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
  )
}

export default StyleEmpower 