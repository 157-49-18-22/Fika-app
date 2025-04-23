import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './FeaturedCollection.css';

const FeaturedCollection = () => {
  const [activeIndex, setActiveIndex] = useState(3);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [enteringCardId, setEnteringCardId] = useState(null);
  const lastIndex = useRef(3);

  const products = [
    {
      id: 1,
      image: '/image-1.png',
      title: 'Floral Pink Pillowcase',
      price: '48.75',
      isNew: false
    },
    {
      id: 2,
      image: '/image-2.png',
      title: 'Colorful Embroidered Pillowcase',
      price: '52.99',
      isNew: false
    },
    {
      id: 3,
      image: '/image-3.png',
      title: 'Blue Pattern Pillowcase',
      price: '45.50',
      isNew: false
    },
    {
      id: 4,
      image: '/image-4.png',
      title: 'Orange Embroidered Pillowcase',
      price: '120.25',
      isNew: true
    },
    {
      id: 5,
      image: '/image-5.png',
      title: 'Colorful Cushion Set',
      price: '89.99',
      isNew: false
    },
    {
      id: 6,
      image: '/image-6.png',
      title: 'Kids Pattern Pillowcase',
      price: '35.50',
      isNew: false
    },
    {
      id: 7,
      image: '/image-4.png',
      title: 'Golden Embroidered Cushion',
      price: '65.75',
      isNew: false
    }
  ];

  // Create an extended array for infinite scrolling illusion
  const extendedProducts = useMemo(() => {
    // Create copies of the products to add before and after the original array
    const before = products.slice(-3).map(p => ({ ...p, id: `before-${p.id}` }));
    const after = products.slice(0, 3).map(p => ({ ...p, id: `after-${p.id}` }));
    return [...before, ...products, ...after];
  }, [products]);
  
  const productsLength = products.length;

  // Advanced rotation handling for infinite loop effect
  const rotateCarousel = useCallback(() => {
    if (isTransitioning) return;
    
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
    if (isAutoPlay) {
      interval = setInterval(rotateCarousel, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, rotateCarousel]);

  const handleCardClick = (index) => {
    if (isTransitioning) return;
    
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
                  <img src={product.image} alt={product.title} />
                  {product.isNew && <span className="new-label">NEW</span>}
                </div>
                {index === activeIndex && (
                  <div className="card-info">
                    <div className="price-badge">
                      <div className="price-info">
                        <span className="start-from">Start From</span>
                        <span className="price">${product.price}USD</span>
                      </div>
                    </div>
                    <button className="shop-btn">
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
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection; 