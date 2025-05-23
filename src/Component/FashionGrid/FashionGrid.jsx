import React from 'react'
import './FashionGrid.css'

const FashionGrid = () => {
  return (
    <div className="fashion-grid-container">
      <div className="fashion-grid">
        {/* Left section - Large image */}
        <div className="grid-item main-image">
          {/* <div className="exclusive-badge">EXCLUSIVE DESIGN</div> */}
          <img src="./FK-CC-039 & FK-CC-001b..jpg" alt="Decorative cushion on sofa" />
          <div className="content-overlay">
            <div className="action-button-container">
              {/* <button className="action-button">
                GOOD STYLE BOOSTS CONFIDENCE
              </button> */}
              {/* <button className="read-more-button">
                READ MORE
              </button> */}
            </div>
          </div>
        </div>

        {/* Right top section - Teal background with text */}
        <div className="grid-item info-box">
          {/* <div className="our-blog-badge">OUR BLOGS</div> */}
          <div className="info-content">
            <h2 className="info-title">
            Dive into a world of endless <br/>
            home décor possibilities<br/>
            
            </h2>
            <p className="info-text">
            Elevate every corner of your space with style and comfort<br/>
              Discover Your Signature Style At Fika.
            </p>
          </div>
        </div>

        {/* Right bottom section - Two images */}
        <div className="grid-item image-duo">
          <div className="duo-image-container">
            <div className="duo-image">
              <img src="./FK-CC-038 & FK-CC-001a.jpg" alt="Stylish room design" />
              <div className="image-overlay">
                {/* <button className="image-action-button">
                  GOOD STYLE BOOSTS CONFIDENCE
                </button> */}
                {/* <div className="arrow-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div> */}
              </div>
            </div>
            <div className="duo-image">
              <img src="./FK-CC-038 Close Up.jpg" alt="Interior design" />
              <div className="image-overlay">
                {/* <button className="image-action-button">
                  GOOD STYLE BOOSTS CONFIDENCE
                </button>
                <div className="arrow-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FashionGrid 