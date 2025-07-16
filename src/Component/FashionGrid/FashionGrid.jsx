import React from 'react'
import './FashionGrid.css'

const FashionGrid = () => {
  return (
    <div className="fashion-grid-container">
      <div className="fashion-grid">
      <div className='fashion-grid-left'>
      <div className="grid-item info-box">
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

        <div className="grid-item main-image">
          <img src="./FK-CC-039.jpg" alt="Decorative cushion on sofa" />
        </div>
      </div>

        {/* Right top section - Teal background with text */}
        

        {/* Right bottom section - Two images */}
        <div className="grid-item image-duo">
          <div className="duo-image-container">
            <div className="duo-image">
              <img src="./FK-CC-041 close Up.jpg" alt="Stylish room design" />
            </div>
            <div className="duo-image">
              <img src="./IMG_20250207_144036.jpg" alt="Interior design" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FashionGrid 