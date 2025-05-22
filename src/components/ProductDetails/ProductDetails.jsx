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
  FaArrowRight,
  FaRegHeart,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import "./ProductDetails.css";
import { useAuth } from '../../context/AuthContext';
import LoginPrompt from '../LoginPrompt/LoginPrompt';
import config from '../../config';
import { db } from '../../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const getAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

const formatPrice = (price) => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '₹0.00';
  return `₹${numPrice.toFixed(2)}`;
};

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
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id); // Debug log

        // Fetch product from Firestore using numeric ID
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('id', '==', parseInt(id)));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log('Product not found in Firestore'); // Debug log
          setError('Product not found');
          setLoading(false);
          return;
        }

        // Get the first matching document
        const productDoc = querySnapshot.docs[0];
        const raw = productDoc.data();
        console.log('Raw product data:', raw); // Debug log
        
        const normalized = {
          ...raw,
          id: productDoc.id,
          image: raw.image || '/placeholder-image.jpg',
          image2: raw.image2 || '/placeholder-image.jpg',
          image3: raw.image3 || '/placeholder-image.jpg',
          image4: raw.image4 || '/placeholder-image.jpg',
          reviews: raw.reviews || [],
          reviewsCount: raw.reviewsCount || 0,
          discount: raw.discount || 0,
          isNew: raw.isNew || false,
          sizes: raw.sizes || [],
          rating: raw.rating || 4.5,
          mrp: Number(raw.mrp) || 0,
          cost_price: Number(raw.cost_price) || 0,
          color: raw.color || 'N/A',
          product_description: raw.product_description || '',
          product_details: raw.product_details || '',
          material: raw.material || '',
          dimension: raw.dimension || '',
          care_instructions: raw.care_instructions || '',
          inventory: raw.inventory || 0,
          product_name: raw.product_name || '',
          product_code: raw.product_code || '',
          category: raw.category || '',
          sub_category: raw.sub_category || '',
        };
        console.log('Normalized product data:', normalized); // Debug log
        setProduct(normalized);

        // Fetch related products from Firestore
        const relatedQuery = query(
          productsRef,
          where('category', '==', raw.category)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const related = relatedSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.id !== parseInt(id))
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
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

  useEffect(() => {
    const fetchAllProducts = async () => {
      const products = await getAllProducts();
      // Filter out current product and get recently viewed
      const filteredProducts = products.filter(p => p.id !== product?.id);
      setRecentlyViewedProducts(filteredProducts.slice(0, 4));
      
      // Get trending products (sorted by rating)
      const trending = [...filteredProducts]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);
      setTrendingProducts(trending);
    };

    if (product) {
      fetchAllProducts();
    }
  }, [product]);

  useEffect(() => {
    // If product and product.image exist, split by comma and trim
    if (product && product.image) {
      const imagesArr = product.image
        .split(',')
        .map(img => img.trim())
        .filter(Boolean)
        .map(img => img.startsWith('/') ? img : `/${img}`); // Ensure leading slash for public folder
      setProductImages(imagesArr.length > 0 ? imagesArr : ['/placeholder-image.jpg']);
    } else {
      setProductImages(['/placeholder-image.jpg']);
    }
  }, [product]);

  useEffect(() => {
    if (showLoginPrompt) {
      document.body.classList.add('login-prompt-active');
    } else {
      document.body.classList.remove('login-prompt-active');
    }

    return () => {
      document.body.classList.remove('login-prompt-active');
    };
  }, [showLoginPrompt]);

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
    console.log('Add to cart button clicked');
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      console.log('User not authenticated, showing login prompt');
      setShowLoginPrompt(true);
      return;
    }
    
    // Log product data for debugging
    console.log('Product data:', {
      id: product.id,
      name: product.product_name,
      price: product.mrp,
      sizes: product.sizes,
      color: product.color
    });
    
    // Create the product object to add to cart
    const productToAdd = {
      id: product.id,
      name: product.product_name,
      price: product.mrp,
      discount: product.discount || 0,
      image: product.image || '/placeholder-image.jpg',
      category: product.category,
      size: selectedSize || 'Standard',
      quantity: quantity,
      color: product.color || 'Default',
      product_code: product.product_code
    };
    
    console.log('Adding to cart:', productToAdd);
    
    // Add to cart - no need for async/await
    addToCart(productToAdd);
    
    // Show success message
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

          <h1 className="product-title">{product.product_name}</h1>

          <div className="product-meta">
            <div className="product-stats">
              <div className="viewer-count">
                <FaUsers /> {viewerCount} people viewing
              </div>
              <div className="purchase-count">
                <FaShoppingBag /> {purchaseCount} people bought this
              </div>
            </div>
            <div className="product-price">
              {/* <span className="cost-price" style={{fontSize: '18px'}}>Price: ₹{product.cost_price}</span> */}
              <span className="current-price" style={{fontSize: '18px'}}>Price:₹{product.mrp}</span>
            </div>
          </div>

          <div className="product-features">
            {/* <div className="feature-item">
              <FaTruck />
              <span>Free Shipping</span>
            </div> */}
            <div className="feature-item">
              <FaUndo />
              <span>Easy Return Policy</span>
            </div>
            <div className="feature-item">
              <FaShieldAlt />
              <span>Secure Payment</span>
            </div>
          </div>

          <div className="product-colors">
            <h3>Color</h3>
            <div className="color-options">
              <div
                className="color-option selected"
                style={{ backgroundColor: product.color.toLowerCase() }}
                title={product.color}
              />
            </div>
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
                    disabled={quantity >= product.inventory}
                  >
                    +
                  </button>
                </div>
                <div className="inventory-info">
                  {product.inventory > 0 ? (
                    <span className="in-stock">In Stock ({product.inventory} available)</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            <div className="main-cart-actions">
              <button
                className="main-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.inventory <= 0}
              >
                <FaShoppingCart /> Add to Cart - ₹{product.mrp * quantity}
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
                <p>{product.product_description}</p>
              </div>
            )}
            {activeTab === "details" && (
              <div className="details">
                <div className="details-section">
                  <h4>Product Information</h4>
                  <ul>
                    <li><strong>Product Code:</strong> {product.product_code}</li>
                    <li><strong>Category:</strong> {product.category}</li>
                    <li><strong>Sub Category:</strong> {product.sub_category}</li>
                    <li><strong>Color:</strong> {product.color}</li>
                    <li><strong>Material:</strong> {product.material}</li>
                    <li><strong>Product Details:</strong> {product.product_details}</li>
                    <li><strong>Dimensions:</strong> {product.dimension}</li>
                  </ul>
                </div>
                <div className="details-section">
                  <h4>Care Instructions</h4>
                  <p>{product.care_instructions}</p>
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
                </div>
                <div className="returns-section">
                  <h4>Returns Policy</h4>
                  <ul>
                    <li>Easy Return Policy</li>
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
        <div className="products-grid">
          {relatedProducts.map((product) => {
            let firstImage = '';
            if (product.image) {
              const imagesArr = product.image.split(',').map(img => img.trim()).filter(Boolean);
              if (imagesArr.length > 0) {
                firstImage = imagesArr[0].startsWith('/') ? imagesArr[0] : `/${imagesArr[0]}`;
              }
            }
            return (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="product-image-container">
                  <img 
                    src={firstImage} 
                    alt={product.product_name} 
                    className="product-image" 
                    loading="lazy" 
                  />
                  
                  <div className="product-actions">
                    <button 
                      className="product-action-btn cart-btn"
                      onClick={(e) => handleRelatedProductAction(e, 'cart', product)}
                      title="Add to Cart"
                      disabled={product.inventory <= 0}
                    >
                      <FaShoppingCart />
                    </button>
                    <button 
                      className={`product-action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => handleRelatedProductAction(e, 'wishlist', product)}
                      title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button 
                      className="product-action-btn quickview-btn"
                      onClick={(e) => handleQuickView(product.id, e)}
                      title="Quick View"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-category">{product.category} - {product.sub_category}</p>
                  <div className="product-price">
                    <span className="current-price">
                      ₹{Number(product.mrp).toFixed(2)}
                    </span>
                  </div>
                  
                  <button className="shop-now-btn">
                    Shop Now <FaArrowRight className="" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="recently-viewed">
        <h2>Recently Viewed</h2>
        <div className="products-grid">
          {recentlyViewedProducts.map((product) => {
            let firstImage = '';
            if (product.image) {
              const imagesArr = product.image.split(',').map(img => img.trim()).filter(Boolean);
              if (imagesArr.length > 0) {
                firstImage = imagesArr[0].startsWith('/') ? imagesArr[0] : `/${imagesArr[0]}`;
              }
            }
            return (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="product-image-container">
                  <img 
                    src={firstImage} 
                    alt={product.product_name} 
                    className="product-image" 
                    loading="lazy" 
                  />
                  
                  <div className="product-actions">
                    <button 
                      className="product-action-btn cart-btn"
                      onClick={(e) => handleRelatedProductAction(e, 'cart', product)}
                      title="Add to Cart"
                      disabled={product.inventory <= 0}
                    >
                      <FaShoppingCart />
                    </button>
                    <button 
                      className={`product-action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => handleRelatedProductAction(e, 'wishlist', product)}
                      title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button 
                      className="product-action-btn quickview-btn"
                      onClick={(e) => handleQuickView(product.id, e)}
                      title="Quick View"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-category">{product.category} - {product.sub_category}</p>
                  <div className="product-price">
                    <span className="current-price">
                      ₹{Number(product.mrp).toFixed(2)}
                    </span>
                  </div>
                  
                  <button className="shop-now-btn">
                    Shop Now <FaArrowRight className="" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="trending-products">
        <h2>Trending Now</h2>
        <div className="products-grid">
          {trendingProducts.map((product) => {
            let firstImage = '';
            if (product.image) {
              const imagesArr = product.image.split(',').map(img => img.trim()).filter(Boolean);
              if (imagesArr.length > 0) {
                firstImage = imagesArr[0].startsWith('/') ? imagesArr[0] : `/${imagesArr[0]}`;
              }
            }
            return (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="product-image-container">
                  <img 
                    src={firstImage} 
                    alt={product.product_name} 
                    className="product-image" 
                    loading="lazy" 
                  />
                  
                  <div className="product-actions">
                    <button 
                      className="product-action-btn cart-btn"
                      onClick={(e) => handleRelatedProductAction(e, 'cart', product)}
                      title="Add to Cart"
                      disabled={product.inventory <= 0}
                    >
                      <FaShoppingCart />
                    </button>
                    <button 
                      className={`product-action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => handleRelatedProductAction(e, 'wishlist', product)}
                      title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button 
                      className="product-action-btn quickview-btn"
                      onClick={(e) => handleQuickView(product.id, e)}
                      title="Quick View"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-category">{product.category} - {product.sub_category}</p>
                  <div className="product-price">
                    <span className="current-price">
                      ₹{Number(product.mrp).toFixed(2)}
                    </span>
                  </div>
                  
                  <button className="shop-now-btn">
                    Shop Now <FaArrowRight className="" />
                  </button>
                </div>
              </div>
            );
          })}
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
        {/* <div className="feature-item">
          <FaTruck />
          <div className="feature-content">
            <h3>Free Shipping</h3>
            <p>On orders over $50</p>
          </div>
        </div> */}
        <div className="feature-item">
          <FaUndo />
          <div className="feature-content">
            <h3>Easy Returns</h3>
            <p>Easy Return Policy</p>
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
