import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/new-arrivals');
  };

  const handleExplore = () => {
    navigate('/all-products');
  };

  return (
    <section className="hero">
      <div className="hero-heading">
        <div className="hero-heading-content">
          <h1 className="hero-main-title">
            Dive into a w
            <span className="icon-wrapper">
              <img src="/Frame10001.png" alt="o" />
            </span>
            rld of endless
          </h1>
          <div className="hero-main-title-2"> 
            <h1 className="hero-main-title">fashion possibilities</h1>
            <div className="hero-heading-description">
              <p>Elevate Your Style With Our Fashion Finds.</p>
              <p>Discover Your Signature Style At Fika.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-content-left">
          <img src="./hero_image1.png" alt="Shopping bag with products" />
        </div>

        <div className="hero-content-middle">
          <div className="button-container">
            <button className="hero-button primary-btn" onClick={handleShopNow}>
              SHOP NOW <span className="arrow">→</span>
            </button>
            <button className="hero-button secondary-btn" onClick={handleExplore}>
              EXPLORE MORE PRODUCTS
            </button>
          </div>

          <div className="brand-section">
            <div className="trending-text">TRENDING</div>
            <div className="collection-text">Awesome Collection</div>
            <div className="brand-logo">
              <img style={{width: "250px"}} src="/Fika_Logo.jpg" alt="logo" />
            </div>
          </div>
        </div>

        <div className="hero-content-right">
          <div className="main-product-image">
            <img src="./hero_image2.png" alt="Featured product" />
          </div>

          <div className="product-grid">
            <div className="product-grid-item item1 width-40">
              <div className="price-overlay"></div>
              <img src="./hero_image2_1.png" alt="Product thumbnail" />
            </div>
            <div className="product-grid-item item2 width-60">
              <img src="./hero_image2_2.png" alt="Product thumbnail" />
            </div>
            <div className="product-grid-item item3 width-60">
              <div className="collection-overlay">Blue Dreams Collection</div>
              <img src="./hero_image2_5.png" alt="Product thumbnail" />
            </div>
            <div className="product-grid-item item4 width-40">
              <img src="./hero_image2_6.png" alt="Product thumbnail" />
            </div>
            <div className="product-grid-item item5 width-40">
              <img src="./hero_image2_3.png" alt="Product thumbnail" />
            </div>
            <div className="product-grid-item item6 width-60">
              <img src="./hero_image2_4.png" alt="Product thumbnail" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
