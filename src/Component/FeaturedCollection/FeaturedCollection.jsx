import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeaturedCollection.css';
import config from '../../config';

const FeaturedCollection = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [enteringCardId, setEnteringCardId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastIndex = useRef(0);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://13.202.119.111:5000/api/products');
        
        // Get products added in the last 30 days as featured
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const featuredProducts = response.data.filter(product => {
          if (!product.created_at) return true;
          const productDate = new Date(product.created_at);
          return productDate >= thirtyDaysAgo;
        });

        setProducts(featuredProducts);
        setError(null);
      } catch (err) {
        setError('Error fetching products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Create an extended array for infinite scrolling illusion
  const extendedProducts = useMemo(() => {
    if (products.length === 0) return [];
    // Create copies of the products to add before and after the original array
    const before = products.slice(-3).map(p => ({ ...p, id: `before-${p.id}` }));
    const after = products.slice(0, 3).map(p => ({ ...p, id: `after-${p.id}` }));
    return [...before, ...products, ...after];
  }, [products]);
  
  const productsLength = products.length;

  // Advanced rotation handling for infinite loop effect
  const rotateCarousel = useCallback(() => {
    if (isTransitioning || productsLength === 0) return;
    
    setIsTransitioning(true);
    
    const nextIndex = (activeIndex + 1) % productsLength;
    
    // If we're moving from the last to the first item
    if (activeIndex === productsLength - 1 && nextIndex === 0) {
      setEnteringCardId(products[0].id);
    }
    
    setActiveIndex(nextIndex);
    lastIndex.current = activeIndex;
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      setEnteringCardId(null);
    }, 700);
  }, [activeIndex, isTransitioning, productsLength, products]);

  useEffect(() => {
    let interval;
    if (isAutoPlay && productsLength > 0) {
      interval = setInterval(rotateCarousel, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, rotateCarousel, productsLength]);

  const handleCardClick = (index) => {
    if (isTransitioning || productsLength === 0) return;
    
    setIsTransitioning(true);
    
    // Check if we're jumping across the loop point (between first and last items)
    if ((activeIndex === productsLength - 1 && index === 0) || 
        (activeIndex === 0 && index === productsLength - 1)) {
      setEnteringCardId(products[index].id);
    }
    
    setActiveIndex(index);
    lastIndex.current = activeIndex;
    setIsAutoPlay(false);
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      setEnteringCardId(null);
    }, 700);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const getCardClass = (index) => {
    if (productsLength === 0) return 'card card-hidden';
    
    // Calculate the relative position considering the infinite loop
    let position = index - activeIndex;
    
    // Optimize for the loop transition
    if (Math.abs(position) > productsLength / 2) {
      position = position > 0 
        ? position - productsLength 
        : position + productsLength;
    }
    
    if (position === 0) return 'card card-active';
    if (Math.abs(position) > 3) return 'card card-hidden';
    
    // Add entering class for the card that's entering from the opposite side during loop transition
    const isEntering = enteringCardId === products[index].id;
    const baseClass = `card card-${position < 0 ? 'left' : 'right'}${Math.min(Math.abs(position), 3)}`;
    
    return isEntering ? `${baseClass} card-entering` : baseClass;
  };

  const getVisibleRange = () => {
    if (productsLength === 0) return [];
    
    // Return indices for visible cards (active card +/- 3 in each direction)
    const visibleRange = [];
    for (let i = -3; i <= 3; i++) {
      const wrappedIndex = ((activeIndex + i) % productsLength + productsLength) % productsLength;
      visibleRange.push(wrappedIndex);
    }
    
    // Special case: if we're at a loop point, make sure both ends are visible
    if (activeIndex <= 2) {
      visibleRange.push(productsLength - 1, productsLength - 2);
    } else if (activeIndex >= productsLength - 3) {
      visibleRange.push(0, 1);
    }
    
    return [...new Set(visibleRange)]; // Remove any duplicates
  };

  const visibleIndices = getVisibleRange();

  const handleIndicatorClick = (index) => {
    handleCardClick(index);
    navigate('/all-products');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No featured products available</div>;
  }

  return (
    <section className="featured-collection">
      <div className="collection-header">
        <h2 className="collection-title">FEATURED COLLECTION</h2>
        <button className="carousel-control" onClick={toggleAutoPlay}>
          {isAutoPlay ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 9V15M14 9V15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 16.5L16 12L10 7.5V16.5Z" fill="#222"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      
      <div className="card-carousel">
        {products.map((product, index) => {
          // Only render cards that are visible or will become visible soon
          if (!visibleIndices.includes(index)) return null;
          
          return (
            <div 
              key={product.id} 
              className={getCardClass(index)}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-image">
                  <img src={product.image} alt={product.product_name} />
                  {new Date(product.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && 
                    <span className="new-label">NEW</span>
                  }
                </div>
                {index === activeIndex && (
                  <div className="card-info">
                    <div className="price-badge">
                      <div className="price-info">
                        <span className="start-from">Start From</span>
                        <span className="price">₹{Number(product.mrp).toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="shop-btn" onClick={() => navigate(`/product/${product.id}`)}>
                      <svg className="shop-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 7.67V6.7C7.5 4.45 9.31 2.24 11.56 2.03C14.24 1.77 16.5 3.88 16.5 6.51V7.89" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.0001 22H15.0001C19.0201 22 19.7401 20.39 19.9501 18.43L20.7001 12.43C20.9701 9.99 20.2701 8 16.0001 8H8.0001C3.7301 8 3.0301 9.99 3.3001 12.43L4.0501 18.43C4.2601 20.39 4.9801 22 9.0001 22Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.4955 12H15.5045" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.49451 12H8.50349" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="carousel-indicators">
        {products.map((_, index) => (
          <span 
            key={index} 
            className={`indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleIndicatorClick(index)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection; 