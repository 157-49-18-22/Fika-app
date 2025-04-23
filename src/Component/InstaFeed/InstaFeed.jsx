import React from 'react'
import './InstaFeed.css'

const InstaFeed = () => {
  return (
    <div className="insta-feed-container">
      <h2 className="insta-feed-title">OUR INSTAGRAM FEED</h2>
      
      <div className="insta-feed-gallery">
        <div className="gallery-image image1">
          <img src="./tilt_image1.png" alt="Yellow cushion with leaf pattern" />
        </div>
        <div className="gallery-image image2">
          <img src="./tilt_image2.png" alt="Orange cushion with fern pattern" />
        </div>
        <div className="gallery-image image3">
          <img src="./tilt_image3.png" alt="Shopping bags and packaging" />
        </div>
        <div className="gallery-image image4">
          <img src="./tilt_image4.png" alt="Folded fabrics and crafts" />
        </div>
        <div className="gallery-image image5">
          <img src="./tilt_image5.png" alt="Blue cushion with floral design" />
        </div>
      </div>
    </div>
  )
}

export default InstaFeed 