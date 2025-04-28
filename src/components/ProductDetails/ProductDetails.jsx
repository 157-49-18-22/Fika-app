import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaArrowLeft,
  FaShare,
  FaStar,
  FaStarHalf,
  FaEye,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaTag,
  FaInstagram,
  FaPinterest,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { getAllProducts } from "../../data/products";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const product = getAllProducts().find((p) => p.id === parseInt(id));
  const relatedProducts = getAllProducts()
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleAddToWishlist = (product, e) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  const handleQuickView = (productId, e) => {
    e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="star half" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star" />);
    }
    return stars;
  };

  const productImages = [
    product?.image,
    product?.image.replace("w=800", "w=801"),
    product?.image.replace("w=800", "w=802"),
    product?.image.replace("w=800", "w=803"),
  ].filter(Boolean);

  const ProductGallery = ({ images }) => {
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const { left, top, width, height } =
          containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setMagnifierPosition({ x, y });
      }
    };

    return (
      <div className="product-gallery">
        <div className="thumbnail-column">
          {images.map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${selectedImage === index ? "active" : ""}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={img} alt={`Product thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="main-image-container" ref={containerRef}>
          <img
            src={images[selectedImage]}
            alt="Selected product"
            className="main-image"
          />
          <div className="magnifier-container" onMouseMove={handleMouseMove}>
            <div
              className="magnified-view"
              style={{
                left: `${magnifierPosition.x}%`,
                top: `${magnifierPosition.y}%`,
                transform: "translate(-50%, -50%)",
                backgroundImage: `url(${images[selectedImage]})`,
                backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                backgroundSize: "400%",
              }}
            />
          </div>
          {product.isNew && <div className="new-badge">NEW</div>}
          {product.discount && (
            <div className="discount-badge">-{product.discount}%</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="product-details-container">
      <div className="product-details-wrapper">
        <ProductGallery images={productImages} />

        <div className="product-info">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> /<Link to="/all-products">Products</Link> /
            <Link to={`/all-products?category=${product.category}`}>
              {product.category}
            </Link>
          </nav>

          <h1 className="product-title">{product.name}</h1>

          <div className="product-meta">
            <div className="rating">
              {renderStars(product.rating)}
              <span className="review-count">
                ({product.reviewsCount} Reviews)
              </span>
            </div>
            <div className="product-price">
              {product.discount ? (
                <>
                  <span className="original-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="discounted-price">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="discount-tag">-{product.discount}%</span>
                </>
              ) : (
                <span className="current-price">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="product-features">
            <div className="feature-item">
              <FaTruck />
              <span>Free Shipping</span>
            </div>
            <div className="feature-item">
              <FaUndo />
              <span>30 Days Return</span>
            </div>
            <div className="feature-item">
              <FaShieldAlt />
              <span>Secure Payment</span>
            </div>
          </div>

          <div className="product-colors">
            <h3>Available Colors</h3>
            <div className="color-options">
              {product.colors?.map((color) => (
                <div
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="main-cart-section">
            <div className="cart-options">
              {product.sizes && (
                <div className="size-selection">
                  <div className="size-header">
                    <h3>Select Size</h3>
                    <button
                      className="size-guide-btn"
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${
                          selectedSize === size ? "selected" : ""
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {showSizeGuide && (
                    <div className="size-guide">
                      <h4>Size Guide</h4>
                      <table>
                        <thead>
                          <tr>
                            <th>Size</th>
                            <th>Width (cm)</th>
                            <th>Length (cm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>S</td>
                            <td>45</td>
                            <td>65</td>
                          </tr>
                          <tr>
                            <td>M</td>
                            <td>50</td>
                            <td>70</td>
                          </tr>
                          <tr>
                            <td>L</td>
                            <td>55</td>
                            <td>75</td>
                          </tr>
                          <tr>
                            <td>XL</td>
                            <td>60</td>
                            <td>80</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className="quantity-selection">
                <h3>Quantity</h3>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="main-cart-actions">
              <button
                className="main-add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                <FaShoppingCart /> Add to Cart - $
                {product.discount
                  ? (
                      product.price *
                      (1 - product.discount / 100) *
                      quantity
                    ).toFixed(2)
                  : (product.price * quantity).toFixed(2)}
              </button>
              <button
                className={`main-wishlist-btn ${
                  isInWishlist(product.id) ? "in-wishlist" : ""
                }`}
                onClick={(e) => handleAddToWishlist(product, e)}
              >
                <FaHeart />
              </button>
            </div>

            <div className="social-share">
              <h3>Share this product</h3>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <FaFacebook />
                </a>
                <a href="#" className="social-icon">
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icon">
                  <FaPinterest />
                </a>
              </div>
            </div>
          </div>

          {showSuccessMessage && (
            <div className="success-message">
              Product added to cart successfully!
            </div>
          )}

          <div className="product-tabs">
            <div className="tab-buttons">
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={activeTab === "details" ? "active" : ""}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={activeTab === "reviews" ? "active" : ""}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviewsCount})
              </button>
              <button
                className={activeTab === "shipping" ? "active" : ""}
                onClick={() => setActiveTab("shipping")}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "description" && (
                <div className="description">
                  <p>{product.description}</p>
                  <div className="description-features">
                    <h4>Key Features</h4>
                    <ul>
                      <li>Premium quality materials</li>
                      <li>Handcrafted with attention to detail</li>
                      <li>Eco-friendly production process</li>
                      <li>Designed for comfort and style</li>
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === "details" && (
                <div className="details">
                  <div className="details-section">
                    <h4>Material & Care</h4>
                    <p>
                      <strong>Material:</strong> {product.material}
                    </p>
                    <p>
                      <strong>Care Instructions:</strong> {product.care}
                    </p>
                  </div>
                  <div className="details-section">
                    <h4>Product Specifications</h4>
                    <ul>
                      <li>Weight: {product.weight || "0.5 kg"}</li>
                      <li>Dimensions: {product.dimensions || "30 x 20 x 10 cm"}</li>
                      <li>Origin: {product.origin || "Made in USA"}</li>
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="reviews">
                  <div className="rating-summary">
                    <div className="average-rating">
                      <h3>{product.rating.toFixed(1)}</h3>
                      <div className="stars">{renderStars(product.rating)}</div>
                      <p>Based on {product.reviewsCount} reviews</p>
                    </div>
                    <div className="rating-distribution">
                      <div className="rating-bar">
                        <span>5 Stars</span>
                        <div className="bar">
                          <div className="fill" style={{ width: "80%" }}></div>
                        </div>
                        <span>80%</span>
                      </div>
                      <div className="rating-bar">
                        <span>4 Stars</span>
                        <div className="bar">
                          <div className="fill" style={{ width: "15%" }}></div>
                        </div>
                        <span>15%</span>
                      </div>
                      <div className="rating-bar">
                        <span>3 Stars</span>
                        <div className="bar">
                          <div className="fill" style={{ width: "3%" }}></div>
                        </div>
                        <span>3%</span>
                      </div>
                      <div className="rating-bar">
                        <span>2 Stars</span>
                        <div className="bar">
                          <div className="fill" style={{ width: "1%" }}></div>
                        </div>
                        <span>1%</span>
                      </div>
                      <div className="rating-bar">
                        <span>1 Star</span>
                        <div className="bar">
                          <div className="fill" style={{ width: "1%" }}></div>
                        </div>
                        <span>1%</span>
                      </div>
                    </div>
                  </div>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="reviews-list">
                      {product.reviews.map((review, index) => (
                        <div key={review.id || index} className="review-item">
                          <div className="review-header">
                            <h4>{review.name}</h4>
                            <div className="review-rating">
                              {renderStars(review.rating)}
                            </div>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-reviews">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="shipping-info">
                  <div className="shipping-section">
                    <h4>Shipping Information</h4>
                    <ul>
                      <li>Free shipping on orders over $50</li>
                      <li>Standard delivery: 3-5 business days</li>
                      <li>Express delivery: 1-2 business days</li>
                      <li>International shipping available</li>
                    </ul>
                  </div>
                  <div className="returns-section">
                    <h4>Returns Policy</h4>
                    <ul>
                      <li>30-day return policy</li>
                      <li>Free returns for all items</li>
                      <li>Items must be unused and in original packaging</li>
                      <li>Refund will be processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>You May Also Like</h2>
        <div className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="related-product-card">
              <div className="related-product-image">
                <img src={relatedProduct.image} alt={relatedProduct.name} />
                <div className="product-actions">
                  <button
                    className={`action-btn wishlist-btn ${
                      isInWishlist(relatedProduct.id) ? "active" : ""
                    }`}
                    onClick={(e) => handleAddToWishlist(relatedProduct, e)}
                  >
                    <FaHeart />
                  </button>
                  <button
                    className="action-btn quick-view-btn"
                    onClick={(e) => handleQuickView(relatedProduct.id, e)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="action-btn add-to-cart-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(relatedProduct);
                    }}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
                {relatedProduct.isNew && (
                  <div className="new-badge">NEW</div>
                )}
                {relatedProduct.discount && (
                  <div className="discount-badge">
                    -{relatedProduct.discount}%
                  </div>
                )}
              </div>
              <div className="related-product-info">
                <h3>{relatedProduct.name}</h3>
                <div className="product-price">
                  {relatedProduct.discount ? (
                    <>
                      <span className="original-price">
                        ${relatedProduct.price.toFixed(2)}
                      </span>
                      <span className="discounted-price">
                        $
                        {(
                          relatedProduct.price *
                          (1 - relatedProduct.discount / 100)
                        ).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="current-price">
                      ${relatedProduct.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
