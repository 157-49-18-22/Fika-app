import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
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
  FaUsers,
  FaShoppingBag,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import "./ProductDetails.css";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';
import LoginPrompt from '../LoginPrompt/LoginPrompt';
import config from '../../config';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [colorError, setColorError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [availableColors] = useState([
    { name: "Black", code: "#000000", available: true },
    { name: "White", code: "#FFFFFF", available: true },
    { name: "Red", code: "#FF0000", available: true },
    { name: "Blue", code: "#0000FF", available: true },
    { name: "Green", code: "#008000", available: false },
    { name: "Yellow", code: "#FFFF00", available: true },
    { name: "Purple", code: "#800080", available: true }
  ]);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [pincodeError, setPincodeError] = useState('');
  const galleryRef = useRef(null);
  const wrapperRef = useRef(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const socketRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.API_URL}/api/products/${id}`);
        setProduct(response.data);
        
        // Fetch related products
        const relatedResponse = await axios.get(`${config.API_URL}/api/products`);
        const related = relatedResponse.data
          .filter(p => p.category === response.data.category && p.id !== response.data.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io(config.SOCKET_URL);

    // Join product room
    socketRef.current.emit('joinProduct', id);

    // Listen for viewer count updates
    socketRef.current.on('viewerCount', (count) => {
      setViewerCount(count);
    });

    // Listen for purchase count updates
    socketRef.current.on('purchaseCount', (count) => {
      setPurchaseCount(count);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.emit('leaveProduct', id);
      socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current && wrapperRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const galleryRect = galleryRef.current.getBoundingClientRect();
        
        if (wrapperRect.top <= 0 && wrapperRect.bottom >= galleryRect.height) {
          const translateY = -wrapperRect.top;
          galleryRef.current.style.transform = `translateY(${translateY}px)`;
        } else if (wrapperRect.top > 0) {
          galleryRef.current.style.transform = 'translateY(0)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Products
        </button>
      </div>
    );
  }

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

  const handleColorSelect = (color) => {
    if (!color.available) {
      setColorError("This color is currently not available. Please select another color.");
      setSelectedColor("");
      return;
    }
    setSelectedColor(color.code);
    setColorError("");
  };

  const handleSizeSelect = (size) => {
    if (!product.sizes.includes(size)) {
      setSizeError("This size is currently not available. Please select another size.");
      setSelectedSize("");
      return;
    }
    setSelectedSize(size);
    setSizeError("");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!selectedColor) {
      setColorError("Please select a color");
      return;
    }
    if (!selectedSize) {
      setSizeError("Please select a size");
      return;
    }
    
    const productToAdd = {
      ...product,
      selectedColor,
      selectedSize,
      quantity
    };
    
    addToCart(productToAdd);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    addToWishlist(product);
  };

  const handleQuickView = (productId, e) => {
    e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  const handleRelatedProductAction = (e, action, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (action === 'cart') {
      addToCart(product);
    } else if (action === 'wishlist') {
      addToWishlist(product);
    }
  };

  const handlePincodeCheck = () => {
    // Basic validation for Indian pincode (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      setDeliveryDate(null);
      return;
    }

    setPincodeError('');
    // Simulate delivery date calculation (usually 3-7 days)
    const today = new Date();
    const deliveryDays = Math.floor(Math.random() * 5) + 3; // Random between 3-7 days
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + deliveryDays);
    
    // Format date as "Day, DD Month YYYY"
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setDeliveryDate(delivery.toLocaleDateString('en-IN', options));
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

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  const getSizeWidth = (size) => {
    if (size === "Standard") return "180";
    if (size === "4-5Y") return "45";
    if (size === "6-7Y") return "50";
    if (size === "40") return "50";
    if (size === "42") return "52";
    return "N/A";
  };

  const getSizeLength = (size) => {
    if (size === "Standard") return "240";
    if (size === "4-5Y") return "65";
    if (size === "6-7Y") return "70";
    if (size === "40") return "70";
    if (size === "42") return "72";
    return "N/A";
  };

  return (
    <div className="product-details-container">
      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginPrompt message="Please login to add items to your cart or wishlist." />
          </div>
        </div>
      )}

      <div className="product-details-wrapper" ref={wrapperRef}>
        <div className="product-gallery" ref={galleryRef}>
          <ProductGallery images={productImages} />
        </div>

        <div className="product-info">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> /<Link to="/all-products">Products</Link> /
            <Link to={`/all-products?category=${product.category}`}>
              {product.category}
            </Link>
          </nav>

          <h1 className="product-title">{product.name}</h1>

          <div className="product-meta">
            <div className="product-stats">
              <div className="viewer-count">
                <FaUsers /> {viewerCount} people viewing
              </div>
              <div className="purchase-count">
                <FaShoppingBag /> {purchaseCount} people bought this
              </div>
            </div>
            <div className="rating">
              {renderStars(product.rating)}
              <span className="review-count">
                ({product.reviewsCount} Reviews)
              </span>
            </div>
            <div className="product-price">
              {product.discount ? (
                <>
                  <span className="original-price">{formatPrice(product.price)}</span>
                  <span className="discounted-price">
                    {formatPrice(product.price * (1 - product.discount / 100))}
                  </span>
                  <span className="discount-tag">-{product.discount}%</span>
                </>
              ) : (
                <span className="current-price">{formatPrice(product.price)}</span>
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
              {availableColors.map((color) => (
                <div
                  key={color.code}
                  className={`color-option ${!color.available ? 'unavailable' : ''} ${selectedColor === color.code ? 'selected' : ''}`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => handleColorSelect(color)}
                  title={color.name}
                />
              ))}
            </div>
            {colorError && <div className="error-message">{colorError}</div>}
            {selectedColor && (
              <div className="selected-color-info">
                Selected: {availableColors.find(c => c.code === selectedColor)?.name}
              </div>
            )}
          </div>

          <div className="delivery-check">
            <h3>Check Delivery Date</h3>
            <div className="pincode-input">
              <input
                type="text"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
              />
              <button onClick={handlePincodeCheck}>Check</button>
            </div>
            {pincodeError && <div className="error-message">{pincodeError}</div>}
            {deliveryDate && (
              <div className="delivery-date">
                <span className="delivery-icon">🚚</span>
                <span>Expected delivery by {deliveryDate}</span>
              </div>
            )}
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
                        className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError && <div className="error-message">{sizeError}</div>}
                  {selectedSize && (
                    <div className="selected-size-info">
                      Selected: {selectedSize}
                    </div>
                  )}
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
                          {product.sizes.map((size) => (
                            <tr key={size}>
                              <td>{size}</td>
                              <td>{getSizeWidth(size)}</td>
                              <td>{getSizeLength(size)}</td>
                            </tr>
                          ))}
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
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Add to Cart - {formatPrice(product.price * quantity)}
              </button>
              <button
                className={`main-wishlist-btn ${isInWishlist(product.id) ? "in-wishlist" : ""}`}
                onClick={handleAddToWishlist}
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
        </div>
      </div>

      <div className="product-tabs-section">
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
                    onClick={(e) => handleRelatedProductAction(e, 'wishlist', relatedProduct)}
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
                    onClick={(e) => handleRelatedProductAction(e, 'cart', relatedProduct)}
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
                      <span className="original-price">{formatPrice(relatedProduct.price)}</span>
                      <span className="discounted-price">
                        {formatPrice(relatedProduct.price * (1 - relatedProduct.discount / 100))}
                      </span>
                    </>
                  ) : (
                    <span className="current-price">{formatPrice(relatedProduct.price)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recently-viewed">
        <h2>Recently Viewed</h2>
        <div className="recently-viewed-grid">
          {getAllProducts()
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((recentProduct) => (
              <div key={recentProduct.id} className="recent-product-card">
                <div className="recent-product-image">
                  <img src={recentProduct.image} alt={recentProduct.name} />
                  <div className="product-actions">
                    <button
                      className={`action-btn wishlist-btn ${
                        isInWishlist(recentProduct.id) ? "active" : ""
                      }`}
                      onClick={(e) => handleRelatedProductAction(e, 'wishlist', recentProduct)}
                    >
                      <FaHeart />
                    </button>
                    <button
                      className="action-btn quick-view-btn"
                      onClick={(e) => handleQuickView(recentProduct.id, e)}
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                <div className="recent-product-info">
                  <h3>{recentProduct.name}</h3>
                  <div className="product-price">
                    {recentProduct.discount ? (
                      <>
                        <span className="original-price">{formatPrice(recentProduct.price)}</span>
                        <span className="discounted-price">
                          {formatPrice(recentProduct.price * (1 - recentProduct.discount / 100))}
                        </span>
                      </>
                    ) : (
                      <span className="current-price">{formatPrice(recentProduct.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="trending-products">
        <h2>Trending Now</h2>
        <div className="trending-products-grid">
          {getAllProducts()
            .filter((p) => p.id !== product.id)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
            .map((trendingProduct) => (
              <div key={trendingProduct.id} className="trending-product-card">
                <div className="trending-product-image">
                  <img src={trendingProduct.image} alt={trendingProduct.name} />
                  <div className="product-actions">
                    <button
                      className={`action-btn wishlist-btn ${
                        isInWishlist(trendingProduct.id) ? "active" : ""
                      }`}
                      onClick={(e) => handleRelatedProductAction(e, 'wishlist', trendingProduct)}
                    >
                      <FaHeart />
                    </button>
                    <button
                      className="action-btn quick-view-btn"
                      onClick={(e) => handleQuickView(trendingProduct.id, e)}
                    >
                      <FaEye />
                    </button>
                  </div>
                  {trendingProduct.isNew && (
                    <div className="new-badge">NEW</div>
                  )}
                  {trendingProduct.discount && (
                    <div className="discount-badge">
                      -{trendingProduct.discount}%
                    </div>
                  )}
                </div>
                <div className="trending-product-info">
                  <h3>{trendingProduct.name}</h3>
                  <div className="product-price">
                    {trendingProduct.discount ? (
                      <>
                        <span className="original-price">{formatPrice(trendingProduct.price)}</span>
                        <span className="discounted-price">
                          {formatPrice(trendingProduct.price * (1 - trendingProduct.discount / 100))}
                        </span>
                      </>
                    ) : (
                      <span className="current-price">{formatPrice(trendingProduct.price)}</span>
                    )}
                  </div>
                  <div className="trending-rating">
                    {renderStars(trendingProduct.rating)}
                    <span>({trendingProduct.reviewsCount})</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="customer-testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          {[
            {
              name: "Sarah Johnson",
              rating: 5,
              comment: "Absolutely love this product! The quality is outstanding and it exceeded my expectations.",
              date: "2 days ago",
              verified: true
            },
            {
              name: "Michael Brown",
              rating: 4,
              comment: "Great product with excellent customer service. Will definitely buy again!",
              date: "1 week ago",
              verified: true
            },
            {
              name: "Emily Davis",
              rating: 5,
              comment: "The best purchase I've made this year. Highly recommend to everyone!",
              date: "2 weeks ago",
              verified: true
            }
          ].map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="testimonial-verified">
                  {testimonial.verified && <span>Verified Purchase</span>}
                </div>
              </div>
              <p className="testimonial-comment">{testimonial.comment}</p>
              <div className="testimonial-footer">
                <span className="testimonial-name">{testimonial.name}</span>
                <span className="testimonial-date">{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="brand-features">
        <div className="feature-item">
          <FaTruck />
          <div className="feature-content">
            <h3>Free Shipping</h3>
            <p>On orders over $50</p>
          </div>
        </div>
        <div className="feature-item">
          <FaUndo />
          <div className="feature-content">
            <h3>Easy Returns</h3>
            <p>30 days return policy</p>
          </div>
        </div>
        <div className="feature-item">
          <FaShieldAlt />
          <div className="feature-content">
            <h3>Secure Payment</h3>
            <p>100% secure checkout</p>
          </div>
        </div>
        <div className="feature-item">
          <FaTag />
          <div className="feature-content">
            <h3>Best Price</h3>
            <p>Guaranteed best prices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
