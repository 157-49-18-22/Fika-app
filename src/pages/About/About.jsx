<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import './About.css';
import { sliderImages } from '../../assets/about/slider-images';
import { FaClock } from 'react-icons/fa';

const About = () => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const aboutText = "ABOUT US";
  const taglineText = "Crafting Timeless Fashion Experiences";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const sliderTimer = setInterval(() => {
      setSliderIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(sliderTimer);
    };
  }, []);

  const handlePrev = () => {
    setSliderIndex((prevIndex) => 
      prevIndex === 0 ? sliderImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSliderIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
  };

  const handleDotClick = (index) => {
    setSliderIndex(index);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
=======
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
>>>>>>> origin

  return (
    <div className="about-container">
      <div className="hero-section">
<<<<<<< HEAD
        <div className="slider-wrapper">
          {sliderImages.map((slide, idx) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              className={`slider-img${idx === sliderIndex ? ' active' : ''}`}
            />
          ))}
          <div className="slider-overlay">
            <div className="slider-content">
              <h1 className="animated-title">
                {aboutText.split('').map((letter, index) => (
                  <span key={index} className="animated-letter" style={{ animationDelay: `${index * 0.1}s` }}>
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </h1>
              <p className="animated-tagline">
                {taglineText.split('').map((letter, index) => (
                  <span key={index} className="animated-letter-small" style={{ animationDelay: `${(index * 0.05) + 0.5}s` }}>
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </p>
            </div>
            <div className="slider-controls">
              <button className="slider-arrow prev" onClick={handlePrev}>&#8592;</button>
              <div className="slider-dots">
                {sliderImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`slider-dot${idx === sliderIndex ? ' active' : ''}`}
                    onClick={() => handleDotClick(idx)}
                  />
                ))}
              </div>
              <button className="slider-arrow next" onClick={handleNext}>&#8594;</button>
            </div>
            <div className="time-display">
              <FaClock className="time-icon" />
              <span className="time-text">{formatTime(currentTime)}</span>
            </div>
          </div>
=======
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
>>>>>>> origin
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