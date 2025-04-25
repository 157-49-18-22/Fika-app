import React from 'react';
import '../styles/FeaturedCollection.css';
import img1 from '../assets/featured.jpg';
import img2 from '../assets/featured1.jpg';

const FeaturedCollection = () => {
  const items = [
    {
      id: 1,
      title: 'Classic Shirt',
      imageTop: img1,
      imageBottom: img2,
    },
  ];

  return (
    <section className="featured-section">
      <h2 className="featured-heading">Featured Collection</h2>
      <div className="featured-grid">
        {items.map((item) => (
          <div key={item.id} className="featured-card">
            <img src={item.imageTop} alt={`${item.title} Front`} className="featured-img" />
            <img src={item.imageBottom} alt={`${item.title} Back`} className="featured-img" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection;
