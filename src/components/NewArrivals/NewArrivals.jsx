import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import {
  FaTimes,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";
import "./NewArrivals.css";

const categoryProducts = {
  "Floral Summer Dress": [
    {
      id: "fd1",
      name: "Yellow Floral Maxi Dress",
      price: "₹499",
      image:
        "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Summer Collection",
    },
    {
      id: "fd2",
      name: "Blue Floral Wrap Dress",
      price: "₹599",
      image:
        "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Trending",
    },
    {
      id: "fd3",
      name: "White Floral Sundress",
      price: "₹449",
      image:
        "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Best Seller",
    },
    {
      id: "fd4",
      name: "Pink Floral Mini Dress",
      price: "₹399",
      image:
        "https://images.pexels.com/photos/1375736/pexels-photo-1375736.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "New Arrival",
    },
    {
      id: "fd5",
      name: "Red Floral Summer Dress",
      price: "₹549",
      image:
        "https://images.pexels.com/photos/1848471/pexels-photo-1848471.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Limited Edition",
    },
    {
      id: "fd6",
      name: "Green Floral Midi Dress",
      price: "₹649",
      image:
        "https://images.pexels.com/photos/1100790/pexels-photo-1100790.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Editor's Choice",
    },
  ],
  "Women's Fashion": [
    {
      id: "w1",
      name: "Floral Summer Dress",
      price: "From ₹499",
      image:
        "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Top Trending",
    },
    {
      id: "w2",
      name: "Party Dresses",
      price: "From ₹999",
      image:
        "https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Shop Now",
    },
    {
      id: "w3",
      name: "Casual Wear",
      price: "From ₹399",
      image:
        "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Best Deals",
    },
    {
      id: "w4",
      name: "Evening Gowns",
      price: "From ₹1,499",
      image:
        "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "New Arrival",
    },
  ],
  "Trending Accessories": [
    {
      id: "a1",
      name: "Designer Bags",
      price: "From ₹799",
      image:
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Best Seller",
    },
    {
      id: "a2",
      name: "Luxury Watches",
      price: "From ₹2,499",
      image:
        "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Premium Collection",
    },
    {
      id: "a3",
      name: "Sunglasses",
      price: "From ₹299",
      image:
        "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "New Season",
    },
    {
      id: "a4",
      name: "Fashion Jewelry",
      price: "From ₹199",
      image:
        "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Trending Now",
    },
  ],
  "Footwear Collection": [
    {
      id: "f1",
      name: "Ankle Boots",
      price: "From ₹999",
      image:
        "https://images.pexels.com/photos/1446521/pexels-photo-1446521.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Most Popular",
    },
    {
      id: "f2",
      name: "Sneakers",
      price: "From ₹699",
      image:
        "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Latest Styles",
    },
    {
      id: "f3",
      name: "High Heels",
      price: "From ₹899",
      image:
        "https://images.pexels.com/photos/1537671/pexels-photo-1537671.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Party Wear",
    },
    {
      id: "f4",
      name: "Casual Shoes",
      price: "From ₹599",
      image:
        "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Everyday Comfort",
    },
  ],
};

const categoryData = {
  "Women's Fashion": [
    {
      id: "w1",
      name: "Floral Summer Dress",
      price: "From ₹499",
      image:
        "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Top Trending",
    },
    {
      id: "w2",
      name: "Party Dresses",
      price: "From ₹999",
      image:
        "https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Shop Now",
    },
    {
      id: "w3",
      name: "Casual Wear",
      price: "From ₹399",
      image:
        "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Best Deals",
    },
    {
      id: "w4",
      name: "Evening Gowns",
      price: "From ₹1,499",
      image:
        "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "New Arrival",
    },
  ],
  "Trending Accessories": [
    {
      id: "a1",
      name: "Designer Bags",
      price: "From ₹799",
      image:
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Best Seller",
    },
    {
      id: "a2",
      name: "Luxury Watches",
      price: "From ₹2,499",
      image:
        "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Premium Collection",
    },
    {
      id: "a3",
      name: "Sunglasses",
      price: "From ₹299",
      image:
        "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "New Season",
    },
    {
      id: "a4",
      name: "Fashion Jewelry",
      price: "From ₹199",
      image:
        "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Trending Now",
    },
  ],
  "Footwear Collection": [
    {
      id: "f1",
      name: "Ankle Boots",
      price: "From ₹999",
      image:
        "https://images.pexels.com/photos/1446521/pexels-photo-1446521.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Most Popular",
    },
    {
      id: "f2",
      name: "Sneakers",
      price: "From ₹699",
      image:
        "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Latest Styles",
    },
    {
      id: "f3",
      name: "High Heels",
      price: "From ₹899",
      image:
        "https://images.pexels.com/photos/1537671/pexels-photo-1537671.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Party Wear",
    },
    {
      id: "f4",
      name: "Casual Shoes",
      price: "From ₹599",
      image:
        "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600",
      description: "Everyday Comfort",
    },
  ],
};

const NewArrivals = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [visibleItems, setVisibleItems] = useState(6);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState({
    "womens-fashion": 0,
    "trending-accessories": 0,
    "footwear-collection": 0,
  });

  const topCategories = {
    All: [
      { name: "New Arrivals", icon: "🆕" },
      { name: "Best Sellers", icon: "⭐" },
      { name: "Top Rated", icon: "🏆" },
      { name: "Featured", icon: "✨" },
    ],
    Women: [
      { name: "Floral Summer Dress", icon: "🌸" },
      { name: "Party Dresses", icon: "👗" },
      { name: "Casual Wear", icon: "👚" },
      { name: "Evening Gowns", icon: "👘" },
      { name: "Designer Collection", icon: "💎" },
    ],
    Accessories: [
      { name: "Designer Bags", icon: "👜" },
      { name: "Luxury Watches", icon: "⌚" },
      { name: "Fashion Jewelry", icon: "💍" },
      { name: "Designer Sunglasses", icon: "🕶️" },
      { name: "Premium Collection", icon: "💎" },
    ],
    Footwear: [
      { name: "Ankle Boots", icon: "👢" },
      { name: "Sneakers", icon: "👟" },
      { name: "High Heels", icon: "👠" },
      { name: "Casual Shoes", icon: "🥿" },
      { name: "Party Wear", icon: "👡" },
    ],
  };

  const categories = [
    { id: "all", name: "All", icon: "🌟" },
    { id: "women", name: "Women", icon: "👗" },
    { id: "accessories", name: "Accessories", icon: "👜" },
    { id: "footwear", name: "Footwear", icon: "👠" },
  ];

  const colors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Pink",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const newArrivalsData = [
    {
      id: 1,
      name: "Elegant Evening Dress",
      category: "clothing",
      price: 189.99,
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      discount: 20,
      rating: 4.8,
      reviews: 42,
    },
    {
      id: 2,
      name: "Designer Leather Tote",
      category: "accessories",
      price: 249.99,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      rating: 4.9,
      reviews: 56,
    },
    {
      id: 3,
      name: "Premium Sneakers",
      category: "footwear",
      price: 159.99,
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      discount: 15,
      rating: 4.7,
      reviews: 38,
    },
    {
      id: 4,
      name: "Silk Summer Blouse",
      category: "clothing",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      rating: 4.6,
      reviews: 29,
    },
    {
      id: 5,
      name: "Designer Watch",
      category: "accessories",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      discount: 10,
      rating: 4.9,
      reviews: 64,
    },
    {
      id: 6,
      name: "Leather Ankle Boots",
      category: "footwear",
      price: 179.99,
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      rating: 4.8,
      reviews: 45,
    },
    {
      id: 7,
      name: "Designer Sunglasses",
      category: "accessories",
      price: 159.99,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      discount: 25,
      rating: 4.7,
      reviews: 33,
    },
    {
      id: 8,
      name: "Cocktail Dress",
      category: "clothing",
      price: 219.99,
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      rating: 4.8,
      reviews: 51,
    },
    {
      id: 9,
      name: "Luxury Handbag",
      category: "accessories",
      price: 329.99,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      discount: 15,
      rating: 4.9,
      reviews: 72,
    },
    {
      id: 10,
      name: "Designer Heels",
      category: "footwear",
      price: 189.99,
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      rating: 4.7,
      reviews: 48,
    },
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setVisibleItems(6);
  };

  const handleTopCategoryClick = (category) => {
    // Convert category name to URL-friendly format
    const urlFriendlyName = category
      .toLowerCase()
      .replace(/[']/g, "")
      .replace(/\s+/g, "-");
    navigate(`/category/${urlFriendlyName}`);
    setShowDropdown(false);
  };

  const handleCategoryClick = (categoryName) => {
    // Convert category name to URL-friendly format
    const urlFriendlyName = categoryName
      .toLowerCase()
      .replace(/[']/g, "")
      .replace(/\s+/g, "-");
    navigate(`/category/${urlFriendlyName}`);
  };

  const filteredItems = newArrivalsData.filter(
    (item) =>
      (selectedCategory === "all" || item.category === selectedCategory) &&
      item.price >= priceRange[0] &&
      item.price <= priceRange[1]
  );

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.name === "min") {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 6);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleAddToCartClick = (product) => {
    const defaultSize =
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : "One Size";
    addToCart(product, defaultSize, 1);

    // Show toast notification
    setToast({ show: true, message: `${product.name} added to cart!` });

    // Hide toast after 2 seconds
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000);
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

  const sliderImages = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "New Collection 2024",
      subtitle: "Up to 70% Off on Latest Fashion",
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Summer Special",
      subtitle: "New Arrivals Starting from ₹499",
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Exclusive Brands",
      subtitle: "Premium Collection at Best Prices",
    },
    {
      id: 4,
      image:
        "https://images.pexels.com/photos/5872361/pexels-photo-5872361.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Winter Collection",
      subtitle: "Latest Winter Wear Collection",
    },
    {
      id: 5,
      image:
        "https://images.pexels.com/photos/5868275/pexels-photo-5868275.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Premium Styles",
      subtitle: "Luxury Fashion Collection",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === sliderImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll function
  useEffect(() => {
    const autoScroll = () => {
      Object.entries(categoryData).forEach(([section]) => {
        const sectionId = section
          .toLowerCase()
          .replace(/[']/g, "")
          .replace(/\s+/g, "-");
        const container = document.getElementById(sectionId);

        if (container) {
          const cardWidth = 280; // Width of each card
          const gap = 30; // Gap between cards
          const scrollAmount = cardWidth + gap;

          if (
            container.scrollLeft >=
            container.scrollWidth - container.offsetWidth
          ) {
            // Reset to start when reached end
            container.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            // Scroll to next card
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        }
      });
    };

    // Set interval for auto scrolling
    const interval = setInterval(autoScroll, 3000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // Manual scroll function
  const scrollProducts = (direction, containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      const cardWidth = 280; // Width of each card
      const gap = 30; // Gap between cards
      const scrollAmount =
        direction === "left" ? -(cardWidth + gap) : cardWidth + gap;

      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="new-arrivals section">
      <div className="container">
        {/* Toast notification */}
        {toast.show && (
          <div className="toast-notification">{toast.message}</div>
        )}

        {/* Top Category Navigation */}
        <div className="category-nav">
          <div className="category-list">
            {Object.keys(topCategories).map((category) => (
              <div className="category-item" key={category}>
                <button
                  className={`category-button ${
                    showDropdown === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category === "All" && "🌟"}
                  {category === "Women" && "👗"}
                  {category === "Accessories" && "👜"}
                  {category === "Footwear" && "👠"}
                  {category}
                  <FaChevronDown
                    className={`dropdown-icon ${
                      showDropdown === category ? "rotate" : ""
                    }`}
                  />
                </button>
                <div className="subcategory-dropdown">
                  {topCategories[category].map((subCategory) => (
                    <button
                      key={subCategory.name}
                      className="subcategory-item"
                      onClick={() => handleTopCategoryClick(subCategory.name)}
                    >
                      <span className="subcategory-icon">
                        {subCategory.icon}
                      </span>
                      {subCategory.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Image Slider */}
          <div className="slider-container">
            <button
              className="slider-button prev"
              onClick={() =>
                setCurrentSlide(
                  currentSlide === 0
                    ? sliderImages.length - 1
                    : currentSlide - 1
                )
              }
            >
              <FaChevronLeft />
            </button>

            <div className="slider-wrapper">
              {sliderImages.map((slide, index) => (
                <div
                  key={slide.id}
                  className="slide"
                  style={{
                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                    opacity: index === currentSlide ? 1 : 0,
                    transition: "all 0.5s ease",
                  }}
                >
                  <img src={slide.image} alt={slide.title} />
                  <div className="slide-content">
                    <h2>{slide.title}</h2>
                    <p>{slide.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="slider-button next"
              onClick={() =>
                setCurrentSlide(
                  currentSlide === sliderImages.length - 1
                    ? 0
                    : currentSlide + 1
                )
              }
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Category Sections */}
          {Object.entries(categoryData).map(([sectionTitle, categories]) => {
            const sectionId = sectionTitle
              .toLowerCase()
              .replace(/[']/g, "")
              .replace(/\s+/g, "-");

            return (
              <div key={sectionTitle} className="category-section">
                <div className="category-section-header">
                  <h2 className="category-section-title">{sectionTitle}</h2>
                  <button
                    className="view-all-btn"
                    onClick={() => handleCategoryClick(sectionTitle)}
                  >
                    View All <FaArrowRight style={{ marginLeft: "0.5rem" }} />
                  </button>
                </div>
                <div className="category-row-container">
                  <button
                    className="scroll-button left"
                    onClick={() => scrollProducts("left", sectionId)}
                  >
                    <FaChevronLeft />
                  </button>
                  <div className="products-row" id={sectionId}>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="category-card"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <div className="category-image">
                          <img
                            src={category.image}
                            alt={category.name}
                            loading="lazy"
                          />
                        </div>
                        <div className="category-info">
                          <h3>{category.name}</h3>
                          <div className="category-details">
                            <span className="price">{category.price}</span>
                            <span
                              className={`tag ${category.description
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {category.description}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="scroll-button right"
                    onClick={() => scrollProducts("right", sectionId)}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Products Grid */}
          <div className="products-grid">
            {filteredItems.slice(0, visibleItems).map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onClick={() => handleImageClick(product.image)}
                  />
                  <div className="product-overlay">
                    <button
                      className="wishlist-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlistClick(product);
                      }}
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <p className="description">{product.description}</p>
                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCartClick(product);
                    }}
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="view-details-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {visibleItems < filteredItems.length && (
            <div className="load-more">
              <button className="load-more-btn" onClick={handleLoadMore}>
                <span>Load More Products</span>
                <i className="arrow-icon">↓</i>
              </button>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="image-modal" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={handleCloseModal}>
                ×
              </button>
              <img src={selectedImage} alt="Product Preview" />
            </div>
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewProduct && (
          <div className="quick-view-modal active" onClick={closeQuickView}>
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
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
