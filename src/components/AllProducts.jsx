import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { FaHeart, FaShoppingCart, FaEye, FaTimes } from "react-icons/fa";
import "../styles/AllProducts.css";
import { getAllProducts } from "../data/products";

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleItems, setVisibleItems] = useState(8);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const categories = [
    { id: "all", name: "All", icon: "🌟" },
    { id: "dresses", name: "Dresses", icon: "👗" },
    { id: "sets", name: "Sets", icon: "🎽" },
    { id: "tops", name: "Tops", icon: "👚" },
    { id: "bottoms", name: "Bottoms", icon: "👖" },
    { id: "accessories", name: "Accessories", icon: "👜" },
    { id: "footwear", name: "Footwear", icon: "👟" },
  ];

  const allProducts = getAllProducts();

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ];

  const filteredProducts = allProducts.filter(
    (product) =>
      selectedCategory === "all" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.isNew === a.isNew ? 0 : b.isNew ? -1 : 1;
      case "price-low":
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      case "price-high":
        const priceADesc = a.discount
          ? a.price * (1 - a.discount / 100)
          : a.price;
        const priceBDesc = b.discount
          ? b.price * (1 - b.discount / 100)
          : b.price;
        return priceBDesc - priceADesc;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 8);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleAddToCartClick = (product) => {
    addToCart(product);
    setToast({ show: true, message: `${product.name} added to cart!` });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const handleAddToWishlistClick = (product) => {
    addToWishlist(product);
    setToast({
      show: true,
      message: isInWishlist(product.id)
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist!`,
    });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
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
    <section className="all-products section">
      <div className="container">
        {/* Toast notification */}
        {toast.show && (
          <div className="toast-notification">{toast.message}</div>
        )}

        <div className="section-header">
          <div className="animated-text">
            <span>E</span>
            <span>X</span>
            <span>P</span>
            <span>L</span>
            <span>O</span>
            <span>R</span>
            <span>E</span>
            <span></span>

            <span>O</span>

            <span>U</span>
            <span>R</span>
            <span></span>

            <span>P</span>
            <span>R</span>
            <span>O</span>
            <span>D</span>
            <span>U</span>
            <span>C</span>
            <span>T</span>
            <span>S</span>
          </div>
        </div>

        <div className="products-controls">
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setVisibleItems(8);
                }}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          <div className="sort-section">
            <label htmlFor="sort-select" className="sort-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-grid">
          {sortedProducts.slice(0, visibleItems).map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                </Link>
                {product.isNew && (
                  <div className="new-tag">
                    <span className="new-text">New</span>
                    <span className="arrival-text">Arrival</span>
                  </div>
                )}
                {product.discount && (
                  <div className="save-tag">
                    <span className="save-text">Save</span>
                    <span className="discount-value">{product.discount}%</span>
                  </div>
                )}
                <button
                  className={`wishlist-btn ${
                    isInWishlist(product.id) ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToWishlistClick(product);
                  }}
                >
                  <FaHeart />
                </button>
                <div className="product-actions">
                  <button
                    className="action-btn quick-view-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickView(product);
                    }}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="action-btn add-to-cart-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCartClick(product);
                    }}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="product-price">
                  {product.discount ? (
                    <>
                      <span className="discounted-price">
                        $
                        {(product.price * (1 - product.discount / 100)).toFixed(
                          2
                        )}
                      </span>
                      <span className="original-price">
                        ${product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </p>
                <Link
                  to={`/product/${product.id}`}
                  className="view-details-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {visibleItems < sortedProducts.length && (
          <div className="load-more">
            <button className="load-more-btn" onClick={handleLoadMore}>
              <span>Load More Products</span>
              <i className="arrow-icon">↓</i>
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
          className={`quick-view-modal ${quickViewProduct ? "active" : ""}`}
          onClick={closeQuickView}
        >
          {quickViewProduct && (
            <div
              className="quick-view-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="quick-view-close" onClick={closeQuickView}>
                <FaTimes />
              </button>
              <div className="quick-view-image">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} />
              </div>
              <div className="quick-view-details">
                <h2 className="quick-view-name">{quickViewProduct.name}</h2>
                <p className="quick-view-category">
                  {quickViewProduct.category}
                </p>
                <div className="quick-view-price">
                  {quickViewProduct.discount ? (
                    <>
                      <span className="quick-view-discounted-price">
                        $
                        {(
                          quickViewProduct.price *
                          (1 - quickViewProduct.discount / 100)
                        ).toFixed(2)}
                      </span>
                      <span className="quick-view-original-price">
                        ${quickViewProduct.price.toFixed(2)}
                      </span>
                      <span className="quick-view-discount">
                        -{quickViewProduct.discount}%
                      </span>
                    </>
                  ) : (
                    <span>${quickViewProduct.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="quick-view-actions">
                  <button
                    className="quick-view-cart-btn"
                    onClick={() => {
                      handleAddToCartClick(quickViewProduct);
                      closeQuickView();
                    }}
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${quickViewProduct.id}`}
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
