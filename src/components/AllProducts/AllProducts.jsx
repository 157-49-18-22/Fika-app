import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { FaShoppingBag, FaHeart, FaShoppingCart, FaEye, FaTimes, FaRegHeart, FaTshirt } from "react-icons/fa";
import { GiLargeDress, GiRunningShoe, GiWatch, GiHeartNecklace, GiTrousers } from "react-icons/gi";
import "./AllProducts.css";
import { getAllProducts } from "../../data/products";

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [visibleItems, setVisibleItems] = useState(20);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [quickView, setQuickView] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  React.useEffect(() => {
    setFadeIn(true);
  }, []);

  const categories = [
    { id: "all", name: "All Products", icon: <FaShoppingBag /> },
    { id: "clothing", name: "Clothing", icon: <FaTshirt /> },
    { id: "dresses", name: "Dresses", icon: <GiLargeDress /> },
    { id: "shoes", name: "Shoes", icon: <GiRunningShoe /> },
    { id: "accessories", name: "Accessories", icon: <GiHeartNecklace /> },
    { id: "pants", name: "Pants", icon: <GiTrousers /> },
    { id: "watches", name: "Watches", icon: <GiWatch /> },
  ];

  const allProducts = getAllProducts();

  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "newest", name: "Newest" },
    { id: "priceAsc", name: "Price: Low to High" },
    { id: "priceDesc", name: "Price: High to Low" },
    { id: "nameAsc", name: "Name: A-Z" },
    { id: "nameDesc", name: "Name: Z-A" },
  ];

  const filteredProducts = allProducts.filter(
    (product) =>
      selectedCategory === "all" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.isNew === a.isNew ? 0 : b.isNew ? -1 : 1;
      case "priceAsc":
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      case "priceDesc":
        const priceADesc = a.discount
          ? a.price * (1 - a.discount / 100)
          : a.price;
        const priceBDesc = b.discount
          ? b.price * (1 - b.discount / 100)
          : b.price;
        return priceBDesc - priceADesc;
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 10);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleAddToCartClick = (product) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToWishlistClick = (product) => {
    addToWishlist(product);
    setToastMessage(isInWishlist(product.id) ? `${product.name} removed from wishlist` : `${product.name} added to wishlist!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleQuickView = (product) => {
    setQuickView(product);
  };

  const closeQuickView = () => {
    setQuickView(null);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star ${index < Math.floor(rating) ? "filled" : ""}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className={`all-products-section ${fadeIn ? 'fade-in' : ''}`}>
      {/* Toast notification */}
      {showToast && (
        <div className="all-products-toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container">
        <div className="all-products-section-header">
          <div className="all-products-animated-text">
            {Array.from("Discover Our Collection").map((letter, index) => (
              <span key={index} className={letter === ' ' ? 'space' : ''}>
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
          <div className="all-products-section-divider"></div>
        </div>

        <div className="all-products-controls">
          <div className="all-products-category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`all-products-category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setVisibleItems(20);
                }}
              >
                <span className="all-products-category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          <div className="all-products-sort-section">
            <span className="all-products-sort-label">Sort By:</span>
            <select
              className="all-products-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="all-products-grid">
          {sortedProducts.slice(0, visibleItems).map((product) => (
            <div key={product.id} className="all-products-product-card">
              <div className="all-products-product-image">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} loading="lazy" onClick={() => handleImageClick(product.image)} />
                </Link>
                {product.isNew && (
                  <div className="all-products-product-badge">New Arrival</div>
                )}
              </div>
              <div className="all-products-product-info">
                <h3 className="all-products-product-name">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="all-products-product-price">
                  {product.discount ? (
                    <>
                      <span className="discounted-price">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      <span className="original-price">
                        ${product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </div>
                <div className="all-products-product-actions">
                  <button
                    className="all-products-view-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickView(product);
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className={`all-products-wishlist-btn ${
                      isInWishlist(product.id) ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToWishlistClick(product);
                    }}
                  >
                    {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleItems < sortedProducts.length && (
          <div className="all-products-load-more">
            <button className="all-products-load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}

        {selectedImage && (
          <div className="image-modal" onClick={handleCloseModal}>
            <div className="modal-content">
              <button className="close-modal" onClick={handleCloseModal}>
                ×
              </button>
              <img src={selectedImage} alt="Product Preview" />
            </div>
          </div>
        )}

        {/* Quick View Modal */}
        <div
          className={`quick-view-modal ${quickView ? "active" : ""}`}
          onClick={closeQuickView}
        >
          {quickView && (
            <div
              className="quick-view-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="quick-view-close" onClick={closeQuickView}>
                <FaTimes />
              </button>
              <div className="quick-view-image">
                <img src={quickView.image} alt={quickView.name} />
              </div>
              <div className="quick-view-details">
                <h2 className="quick-view-name">{quickView.name}</h2>
                <p className="quick-view-category">
                  {quickView.category}
                </p>
                <div className="quick-view-price">
                  {quickView.discount ? (
                    <>
                      <span className="quick-view-discounted-price">
                        ${(quickView.price * (1 - quickView.discount / 100)).toFixed(2)}
                      </span>
                      <span className="quick-view-original-price">
                        ${quickView.price.toFixed(2)}
                      </span>
                      <span className="quick-view-discount">
                        -{quickView.discount}%
                      </span>
                    </>
                  ) : (
                    <span>${quickView.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="quick-view-actions">
                  <button
                    className="quick-view-cart-btn"
                    onClick={(e) => {
                      handleAddToCartClick(quickView);
                      closeQuickView();
                    }}
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${quickView.id}`}
                    className="quick-view-details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllProducts;
