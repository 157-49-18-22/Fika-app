import React, { useEffect, useState } from 'react';
import './About.css';
import { sliderImages } from '../../assets/about/slider-images';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload images
    const loadImages = async () => {
      const imagePromises = sliderImages.map((slide) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = slide.image;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [imagesLoaded]);

  return (
    <div className="about-container">
      <div className="hero-section">
        <div className="slider-container">
          {sliderImages.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
              role="img"
              aria-label={slide.alt}
            />
          ))}
        </div>
        <div className="hero-content">
          <h1>ABOUT US</h1>
          <p>Crafting Timeless Fashion Experiences</p>
        </div>
        <div className="slider-dots">
          {sliderImages.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <div className="content-section">
        <p>
          At FIKA, we believe that home is more than just a place — it's a feeling. Inspired by
          the Scandinavian concept of slowing down and savoring life's simple moments,
          FIKA brings you thoughtfully designed soft furnishings that turn everyday living
          into a cozy, stylish experience.
        </p>
        <p>
          Our collection includes beautifully crafted cushion covers, bed linens, quilts, dohars,
          and more — each piece a harmonious blend of comfort, quality, and aesthetic
          charm. Whether it's the richness of hand-block prints, the softness of pure cotton,
          or the elegance of velvet textures, our products are made to transform your space
          into a sanctuary.
        </p>
        <p>
          We work with skilled artisans and ethical production practices to create pieces that
          feel as good as they look. Every item from FIKA is a gentle invitation to pause,
          unwind, and enjoy the art of slow living — right at home.
        </p>
        <p className="tagline">
          FIKA — where comfort meets craft.
        </p>
        <button className="learn-more-btn">Learn More</button>
      </div>
    </div>
  );
};

export default About; 