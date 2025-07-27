import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiHeart, FiFilter, FiX } from "react-icons/fi";
import { BsGrid, BsList } from "react-icons/bs";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./CategoryProducts.css";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const FilterSection = styled.aside`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
  width: 280px;

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;

    h2 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .clear-all {
      font-size: 0.9rem;
      color: #007bff;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .filter-group {
    margin-bottom: 24px;

    h3 {
      font-size: 1rem;
      color: #555;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .count {
        font-size: 0.8rem;
        color: #777;
        font-weight: normal;
      }
    }
  }

  .price-range {
    .range-inputs {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 12px;

      input {
        width: 100px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      span {
        color: #666;
      }
    }

    .range-slider {
      margin-top: 15px;
      width: 100%;

      input[type="range"] {
        width: 100%;
        height: 4px;
        -webkit-appearance: none;
        background: #e0e0e0;
        border-radius: 2px;
        outline: none;

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #007bff;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.15s ease-in-out;

          &:hover {
            background: #0056b3;
          }
        }
      }
    }
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 200px;
    overflow-y: auto;
    padding-right: 10px;

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 6px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f5f5;
      }

      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        border: 2px solid #ddd;
        border-radius: 3px;
        cursor: pointer;
      }

      span {
        font-size: 0.9rem;
        color: #444;
      }

      .count {
        margin-left: auto;
        font-size: 0.8rem;
        color: #777;
      }
    }
  }

  &.show {
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    margin: 0;
    border-radius: 0;
    width: 85%;
    max-width: 350px;
    overflow-y: auto;
  }
`;

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  // Initialize filter states from URL parameters
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const priceRangeFromUrl = searchParams.get('priceRange');
    const stylesFromUrl = searchParams.get('styles');
    const materialsFromUrl = searchParams.get('materials');
    const brandsFromUrl = searchParams.get('brands');
    
    return {
      priceRange: priceRangeFromUrl ? JSON.parse(priceRangeFromUrl) : [0, 150000],
      styles: stylesFromUrl ? JSON.parse(stylesFromUrl) : [],
      materials: materialsFromUrl ? JSON.parse(materialsFromUrl) : [],
      brands: brandsFromUrl ? JSON.parse(brandsFromUrl) : [],
    };
  });

  // Updated product categories
  const categories = {
    "luxury-watches": {
      name: "Luxury Watches",
      subcategories: ["analog", "digital", "smart-watches"],
    },
    "womens-fashion": {
      name: "Women's Fashion",
      subcategories: ["dresses", "casual-wear", "evening-gowns"],
    },
    accessories: {
      name: "Accessories",
      subcategories: ["bags", "jewelry"],
    },
    footwear: {
      name: "Footwear",
      subcategories: ["heels", "sneakers", "boots"],
    },
  };

  // Format category name for display
  const formatCategoryName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get relevant brands based on category
  const getRelevantBrands = () => {
    const uniqueBrands = new Set();
    products.forEach((product) => {
      uniqueBrands.add(product.brand);
    });
    return Array.from(uniqueBrands);
  };

  // Get style options based on category
  const getStyleOptions = () => {
    if (categoryName === "luxury-watches") {
      return ["Luxury", "Classic", "Sports", "Modern", "Minimalist"];
    }
    return ["Casual", "Formal", "Party", "Ethnic", "Beach"];
  };

  // Get material options based on category
  const getMaterialOptions = () => {
    if (categoryName === "luxury-watches") {
      return ["Steel", "Gold", "Rose Gold", "Titanium", "Ceramic"];
    }
    return ["Cotton", "Silk", "Linen", "Denim", "Polyester"];
  };

  // Function to update URL with current filter state
  const updateURL = (newFilters) => {
    const params = new URLSearchParams(location.search);
    
    if (newFilters.priceRange && (newFilters.priceRange[0] !== 0 || newFilters.priceRange[1] !== 150000)) {
      params.set('priceRange', JSON.stringify(newFilters.priceRange));
    } else {
      params.delete('priceRange');
    }
    
    if (newFilters.styles && newFilters.styles.length > 0) {
      params.set('styles', JSON.stringify(newFilters.styles));
    } else {
      params.delete('styles');
    }
    
    if (newFilters.materials && newFilters.materials.length > 0) {
      params.set('materials', JSON.stringify(newFilters.materials));
    } else {
      params.delete('materials');
    }
    
    if (newFilters.brands && newFilters.brands.length > 0) {
      params.set('brands', JSON.stringify(newFilters.brands));
    } else {
      params.delete('brands');
    }
    
    // Update URL without causing a page reload
    const newURL = `${location.pathname}?${params.toString()}`;
    if (newURL !== location.pathname + location.search) {
      navigate(newURL, { replace: true });
    }
  };

  // Track if we're updating from URL to prevent infinite loops
  const [isUpdatingFromURL, setIsUpdatingFromURL] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Update URL whenever filters change
  useEffect(() => {
    if (isInitialized && !isUpdatingFromURL) {
      updateURL(selectedFilters);
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [selectedFilters, isInitialized, isUpdatingFromURL]);

  // Handle URL parameter changes (e.g., when navigating back)
  useEffect(() => {
    if (!isInitialized) return; // Skip during initial load
    
    const newSearchParams = new URLSearchParams(location.search);
    
    const newPriceRange = newSearchParams.get('priceRange');
    const newStyles = newSearchParams.get('styles');
    const newMaterials = newSearchParams.get('materials');
    const newBrands = newSearchParams.get('brands');
    
    // Check if any values have actually changed
    let hasChanges = false;
    const newFilters = { ...selectedFilters };
    
    if (newPriceRange !== null) {
      const parsedPriceRange = JSON.parse(newPriceRange);
      if (JSON.stringify(parsedPriceRange) !== JSON.stringify(selectedFilters.priceRange)) {
        newFilters.priceRange = parsedPriceRange;
        hasChanges = true;
      }
    }
    
    if (newStyles !== null) {
      const parsedStyles = JSON.parse(newStyles);
      if (JSON.stringify(parsedStyles) !== JSON.stringify(selectedFilters.styles)) {
        newFilters.styles = parsedStyles;
        hasChanges = true;
      }
    }
    
    if (newMaterials !== null) {
      const parsedMaterials = JSON.parse(newMaterials);
      if (JSON.stringify(parsedMaterials) !== JSON.stringify(selectedFilters.materials)) {
        newFilters.materials = parsedMaterials;
        hasChanges = true;
      }
    }
    
    if (newBrands !== null) {
      const parsedBrands = JSON.parse(newBrands);
      if (JSON.stringify(parsedBrands) !== JSON.stringify(selectedFilters.brands)) {
        newFilters.brands = parsedBrands;
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      setIsUpdatingFromURL(true);
      setSelectedFilters(newFilters);
      // Reset the flag after a short delay
      setTimeout(() => setIsUpdatingFromURL(false), 100);
    }
  }, [location.search, isInitialized]);

  // Simulated product data with proper categorization
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Mock products with proper categorization
        const mockProducts = [
          // Luxury Watches
          {
            id: 1,
            name: "Rolex Submariner",
            price: 89999,
            image:
              "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800",
            brand: "Rolex",
            style: "Luxury",
            material: "Steel",
            category: "luxury-watches",
            subcategory: "analog",
          },
          {
            id: 2,
            name: "Patek Philippe Nautilus",
            price: 125000,
            image:
              "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
            brand: "Patek Philippe",
            style: "Classic",
            material: "Gold",
            category: "luxury-watches",
            subcategory: "analog",
          },
          {
            id: 3,
            name: "Omega Seamaster",
            price: 75000,
            image:
              "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800",
            brand: "Omega",
            style: "Sports",
            material: "Steel",
            category: "luxury-watches",
            subcategory: "analog",
          },
          {
            id: 4,
            name: "Cartier Tank",
            price: 95000,
            image:
              "https://images.unsplash.com/photo-1639037687665-8d5071445873?w=800",
            brand: "Cartier",
            style: "Luxury",
            material: "Rose Gold",
            category: "luxury-watches",
            subcategory: "analog",
          },
          {
            id: 5,
            name: "Hublot Classic Fusion",
            price: 110000,
            image:
              "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800",
            brand: "Hublot",
            style: "Luxury",
            material: "Titanium",
            category: "luxury-watches",
            subcategory: "analog",
          },
          {
            id: 6,
            name: "IWC Portuguese",
            price: 82000,
            image:
              "https://images.unsplash.com/photo-1639037687862-3eaaeb906d49?w=800",
            brand: "IWC",
            style: "Luxury",
            material: "Ceramic",
            category: "luxury-watches",
            subcategory: "analog",
          },

          // Floral Summer Dresses
          {
            id: 7,
            name: "Yellow Floral Maxi Dress",
            price: 1499,
            image:
              "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800",
            brand: "MANGO",
            style: "Casual",
            material: "Cotton",
            size: "M",
            category: "floral-summer-dress",
            subcategory: "maxi-dress",
          },
          {
            id: 8,
            name: "Floral Print Sundress",
            price: 1299,
            image:
              "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
            brand: "H&M",
            style: "Casual",
            material: "Silk",
            size: "S",
            category: "floral-summer-dress",
            subcategory: "sundress",
          },
          {
            id: 9,
            name: "Summer Floral Wrap Dress",
            price: 1699,
            image:
              "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
            brand: "Zara",
            style: "Party",
            material: "Polyester",
            size: "L",
            category: "floral-summer-dress",
            subcategory: "wrap-dress",
          },
          {
            id: 10,
            name: "Floral Mini Dress",
            price: 1199,
            image:
              "https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=800",
            brand: "Forever 21",
            style: "Casual",
            material: "Cotton",
            size: "M",
            category: "floral-summer-dress",
            subcategory: "mini-dress",
          },
          {
            id: 11,
            name: "Floral Beach Dress",
            price: 1599,
            image:
              "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800",
            brand: "ONLY",
            style: "Beach",
            material: "Denim",
            size: "S",
            category: "floral-summer-dress",
            subcategory: "beach-dress",
          },
          {
            id: 12,
            name: "Floral A-Line Dress",
            price: 1899,
            image:
              "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800",
            brand: "AND",
            style: "Ethnic",
            material: "Linen",
            size: "L",
            category: "floral-summer-dress",
            subcategory: "a-line-dress",
          },

          // Party Dresses
          {
            id: 13,
            name: "Red Evening Gown",
            price: 3999,
            image:
              "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
            brand: "Vera Moda",
            style: "Formal",
            material: "Silk",
            size: "M",
            category: "party-dresses",
            subcategory: "evening-gown",
          },
          {
            id: 14,
            name: "Black Cocktail Dress",
            price: 2999,
            image:
              "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
            brand: "MANGO",
            style: "Party",
            material: "Polyester",
            size: "S",
            category: "party-dresses",
            subcategory: "cocktail",
          },
          {
            id: 15,
            name: "Sequin Party Dress",
            price: 4499,
            image:
              "https://images.unsplash.com/photo-1576663042137-e71d9e98579c?w=800",
            brand: "Forever New",
            style: "Party",
            material: "Silk",
            size: "M",
            category: "womens-fashion",
            subcategory: "party-dresses",
          },

          // Casual Wear
          {
            id: 16,
            name: "Casual Denim Dress",
            price: 1899,
            image:
              "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
            brand: "Zara",
            style: "Casual",
            material: "Denim",
            size: "M",
            category: "womens-fashion",
            subcategory: "casual-wear",
          },
          {
            id: 17,
            name: "Cotton T-shirt Dress",
            price: 999,
            image:
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
            brand: "H&M",
            style: "Casual",
            material: "Cotton",
            size: "L",
            category: "womens-fashion",
            subcategory: "casual-wear",
          },

          // Evening Gowns
          {
            id: 18,
            name: "Elegant Evening Gown",
            price: 5999,
            image:
              "https://images.unsplash.com/photo-1559034750-cdab70a66b8e?w=800",
            brand: "Forever New",
            style: "Formal",
            material: "Silk",
            size: "M",
            category: "womens-fashion",
            subcategory: "evening-gowns",
          },
          {
            id: 19,
            name: "Designer Ball Gown",
            price: 7999,
            image:
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
            brand: "Gucci",
            style: "Formal",
            material: "Silk",
            size: "S",
            category: "womens-fashion",
            subcategory: "evening-gowns",
          },

          // Trending Accessories - Bags
          {
            id: 20,
            name: "Leather Tote Bag",
            price: 24999,
            image:
              "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
            brand: "Michael Kors",
            style: "Luxury",
            material: "Leather",
            category: "designer-bags",
            subcategory: "tote",
          },
          {
            id: 21,
            name: "Designer Handbag",
            price: 39999,
            image:
              "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
            brand: "Louis Vuitton",
            style: "Luxury",
            material: "Leather",
            category: "designer-bags",
            subcategory: "handbag",
          },

          // Trending Accessories - Watches
          {
            id: 22,
            name: "Luxury Chronograph Watch",
            price: 15999,
            image:
              "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
            brand: "Rolex",
            color: "Gold",
            category: "accessories",
            subcategory: "watches",
          },
          {
            id: 23,
            name: "Classic Steel Watch",
            price: 12999,
            image:
              "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800",
            brand: "Omega",
            color: "Silver",
            category: "accessories",
            subcategory: "watches",
          },

          // Trending Accessories - Sunglasses
          {
            id: 24,
            name: "Designer Sunglasses",
            price: 1999,
            image:
              "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
            brand: "Ray-Ban",
            color: "Black",
            category: "accessories",
            subcategory: "sunglasses",
          },
          {
            id: 25,
            name: "Aviator Sunglasses",
            price: 2499,
            image:
              "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800",
            brand: "Ray-Ban",
            color: "Gold",
            category: "accessories",
            subcategory: "sunglasses",
          },

          // Trending Accessories - Jewelry
          {
            id: 26,
            name: "Gold Earrings",
            price: 3999,
            image:
              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
            brand: "Tanishq",
            color: "Gold",
            category: "accessories",
            subcategory: "jewelry",
          },
          {
            id: 27,
            name: "Diamond Pendant",
            price: 5999,
            image:
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
            brand: "Cartier",
            color: "Silver",
            category: "accessories",
            subcategory: "jewelry",
          },

          // Men's Fashion - Shirts
          {
            id: 28,
            name: "Formal White Shirt",
            price: 1499,
            image:
              "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800",
            brand: "Peter England",
            color: "White",
            size: "L",
            category: "mens-fashion",
            subcategory: "shirts",
          },
          {
            id: 29,
            name: "Casual Denim Shirt",
            price: 1799,
            image:
              "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=800",
            brand: "Levis",
            color: "Blue",
            size: "M",
            category: "mens-fashion",
            subcategory: "shirts",
          },

          // Men's Fashion - Pants
          {
            id: 30,
            name: "Slim Fit Chinos",
            price: 1999,
            image:
              "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
            brand: "H&M",
            color: "Beige",
            size: "32",
            category: "mens-fashion",
            subcategory: "pants",
          },
          {
            id: 31,
            name: "Formal Trousers",
            price: 2499,
            image:
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
            brand: "Van Heusen",
            color: "Black",
            size: "34",
            category: "mens-fashion",
            subcategory: "pants",
          },

          // Men's Fashion - Suits
          {
            id: 32,
            name: "Classic Black Suit",
            price: 12999,
            image:
              "https://images.unsplash.com/photo-1594938374182-f8830bea75fe?w=800",
            brand: "Raymond",
            color: "Black",
            size: "40",
            category: "mens-fashion",
            subcategory: "suits",
          },
          {
            id: 33,
            name: "Navy Blue Blazer",
            price: 8999,
            image:
              "https://images.unsplash.com/photo-1592878940526-0214b0f374f6?w=800",
            brand: "Arrow",
            color: "Navy",
            size: "42",
            category: "mens-fashion",
            subcategory: "suits",
          },

          // Kids Fashion - Girls
          {
            id: 34,
            name: "Floral Print Dress",
            price: 999,
            image:
              "https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=800",
            brand: "H&M Kids",
            color: "Pink",
            size: "4-5Y",
            category: "kids-fashion",
            subcategory: "girls",
          },
          {
            id: 35,
            name: "Casual Denim Set",
            price: 1299,
            image:
              "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=800",
            brand: "Zara Kids",
            color: "Blue",
            size: "6-7Y",
            category: "kids-fashion",
            subcategory: "girls",
          },

          // Kids Fashion - Boys
          {
            id: 36,
            name: "Boys Casual T-shirt",
            price: 699,
            image:
              "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800",
            brand: "H&M Kids",
            color: "Red",
            size: "5-6Y",
            category: "kids-fashion",
            subcategory: "boys",
          },
          {
            id: 37,
            name: "Boys Party Wear",
            price: 1599,
            image:
              "https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=800",
            brand: "Marks & Spencer",
            color: "Navy",
            size: "7-8Y",
            category: "kids-fashion",
            subcategory: "boys",
          },

          // Footwear - Men
          {
            id: 38,
            name: "Leather Oxford Shoes",
            price: 3999,
            image:
              "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800",
            brand: "Hush Puppies",
            color: "Brown",
            size: "42",
            category: "footwear",
            subcategory: "mens-shoes",
          },
          {
            id: 39,
            name: "Sports Sneakers",
            price: 4499,
            image:
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
            brand: "Nike",
            color: "White",
            size: "43",
            category: "footwear",
            subcategory: "mens-shoes",
          },

          // Footwear - Women
          {
            id: 40,
            name: "Stiletto Heels",
            price: 2999,
            image:
              "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
            brand: "Jimmy Choo",
            color: "Black",
            size: "38",
            category: "footwear",
            subcategory: "womens-shoes",
          },
          {
            id: 41,
            name: "Casual Flats",
            price: 1499,
            image:
              "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800",
            brand: "Clarks",
            color: "Beige",
            size: "37",
            category: "footwear",
            subcategory: "womens-shoes",
          },

          // Sports & Fitness
          {
            id: 42,
            name: "Yoga Mat",
            price: 999,
            image:
              "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
            brand: "Nike",
            color: "Purple",
            category: "sports",
            subcategory: "yoga",
          },
          {
            id: 43,
            name: "Gym Dumbbells",
            price: 2499,
            image:
              "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800",
            brand: "Reebok",
            color: "Black",
            category: "sports",
            subcategory: "gym",
          },

          // Home Decor
          {
            id: 44,
            name: "Decorative Cushions",
            price: 799,
            image:
              "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800",
            brand: "Home Centre",
            color: "Multicolor",
            category: "home-decor",
            subcategory: "cushions",
          },
          {
            id: 45,
            name: "Table Lamp",
            price: 1299,
            image:
              "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
            brand: "IKEA",
            color: "Gold",
            category: "home-decor",
            subcategory: "lighting",
          },

          // Electronics
          {
            id: 46,
            name: "Wireless Earbuds",
            price: 9999,
            image:
              "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=800",
            brand: "Apple",
            color: "White",
            category: "electronics",
            subcategory: "audio",
          },
          {
            id: 47,
            name: "Smart Watch",
            price: 24999,
            image:
              "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800",
            brand: "Samsung",
            color: "Black",
            category: "electronics",
            subcategory: "wearables",
          },
        ];

        console.log("Category Name:", categoryName); // Debug log

        // Filter products based on category and subcategory
        const filteredMockProducts = mockProducts.filter((product) => {
          console.log(
            "Filtering product:",
            product.category,
            "against categoryName:",
            categoryName
          );
          if (categoryName === "all") return true;
          return (
            product.category === categoryName ||
            product.subcategory === categoryName
          );
        });

        console.log("Filtered products:", filteredMockProducts);
        setProducts(filteredMockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Add debug log for products state
  useEffect(() => {
    console.log("Current Products State:", products);
  }, [products]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`${product.name} added to cart!`);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      showToast(`${product.name} added to wishlist!`);
    }
  };

  // Update filtered products logic
  const filteredProducts = products.filter((product) => {
    const priceInRange =
      product.price >= selectedFilters.priceRange[0] &&
      product.price <= selectedFilters.priceRange[1];
    const styleMatch =
      selectedFilters.styles.length === 0 ||
      (product.style && selectedFilters.styles.includes(product.style));
    const materialMatch =
      selectedFilters.materials.length === 0 ||
      (product.material &&
        selectedFilters.materials.includes(product.material));
    const brandMatch =
      selectedFilters.brands.length === 0 ||
      selectedFilters.brands.includes(product.brand);

    return priceInRange && styleMatch && materialMatch && brandMatch;
  });

  return (
    <div className="category-products">
      {toast.show && <div className="toast-notification">{toast.message}</div>}

      <div className="category-header">
        <h1>{formatCategoryName(categoryName)}</h1>
        <div className="view-controls">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            <BsGrid />
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            <BsList />
          </button>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <FiX /> : <FiFilter />}
            Filters
          </button>
        </div>
      </div>

      <div className="category-content">
        <FilterSection
          className={`category-filters ${showFilters ? "show" : ""}`}
        >
          <div className="filter-header">
            <h2>Filters</h2>
            <button
              className="clear-all"
              onClick={() => {
                setSelectedFilters({
                  priceRange: [0, 150000],
                  styles: [],
                  materials: [],
                  brands: [],
                });
                // Clear URL parameters
                navigate(location.pathname, { replace: true });
              }}
            >
              Clear All
            </button>
          </div>

          <div className="filter-group">
            <h3>
              Price Range
              <span className="count">
                ₹{selectedFilters.priceRange[0].toLocaleString()} - ₹
                {selectedFilters.priceRange[1].toLocaleString()}
              </span>
            </h3>
            <div className="price-range">
              <div className="range-slider">
                <input
                  type="range"
                  min="0"
                  max="150000"
                  value={selectedFilters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      selectedFilters.priceRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                />
              </div>
              <div className="range-inputs">
                <input
                  type="number"
                  value={selectedFilters.priceRange[0]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      parseInt(e.target.value),
                      selectedFilters.priceRange[1],
                    ])
                  }
                  min="0"
                  max={selectedFilters.priceRange[1]}
                />
                <span>-</span>
                <input
                  type="number"
                  value={selectedFilters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      selectedFilters.priceRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  min={selectedFilters.priceRange[0]}
                  max="150000"
                />
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h3>
              Style
              <span className="count">
                {selectedFilters.styles.length} selected
              </span>
            </h3>
            <div className="checkbox-group">
              {getStyleOptions().map((style) => {
                const count = products.filter((p) => p.style === style).length;
                return (
                  <label key={style}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.styles.includes(style)}
                      onChange={() => {
                        const newStyles = selectedFilters.styles.includes(style)
                          ? selectedFilters.styles.filter((s) => s !== style)
                          : [...selectedFilters.styles, style];
                        handleFilterChange("styles", newStyles);
                      }}
                    />
                    <span>{style}</span>
                    <span className="count">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3>
              Material
              <span className="count">
                {selectedFilters.materials.length} selected
              </span>
            </h3>
            <div className="checkbox-group">
              {getMaterialOptions().map((material) => {
                const count = products.filter(
                  (p) => p.material === material
                ).length;
                return (
                  <label key={material}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.materials.includes(material)}
                      onChange={() => {
                        const newMaterials = selectedFilters.materials.includes(
                          material
                        )
                          ? selectedFilters.materials.filter(
                              (m) => m !== material
                            )
                          : [...selectedFilters.materials, material];
                        handleFilterChange("materials", newMaterials);
                      }}
                    />
                    <span>{material}</span>
                    <span className="count">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3>
              Brands
              <span className="count">
                {selectedFilters.brands.length} selected
              </span>
            </h3>
            <div className="checkbox-group">
              {getRelevantBrands().map((brand) => {
                const count = products.filter((p) => p.brand === brand).length;
                return (
                  <label key={brand}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.brands.includes(brand)}
                      onChange={() => {
                        const newBrands = selectedFilters.brands.includes(brand)
                          ? selectedFilters.brands.filter((b) => b !== brand)
                          : [...selectedFilters.brands, brand];
                        handleFilterChange("brands", newBrands);
                      }}
                    />
                    <span>{brand}</span>
                    <span className="count">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        </FilterSection>

        <main className={`products-grid ${viewMode}`}>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      console.log("Image failed to load:", product.image);
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=Product+Image";
                    }}
                  />
                  <button
                    className={`wishlist-btn ${
                      isInWishlist(product.id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(product)}
                  >
                    <FiHeart />
                  </button>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="brand">{product.brand}</p>
                  <p className="price">₹{product.price.toLocaleString()}</p>
                  <div className="product-meta">
                    <span className="color">{product.color}</span>
                    {product.size && (
                      <span className="size">Size: {product.size}</span>
                    )}
                  </div>
                  <button
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="view-details-btn"
                    state={{ product }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryProducts;
