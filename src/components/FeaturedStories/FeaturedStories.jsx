import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronRight, FaCalendarAlt, FaUserAlt, FaClock, FaHeart, FaComment, FaGlobeAmericas, FaTshirt, FaGem, FaLeaf, FaFeatherAlt } from "react-icons/fa";
import "./FeaturedStories.css";
import axios from "axios";

const FeaturedStories = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/blog-newsletter", { email })
      .then(() => {
        setShowSuccess(true);
        setEmail("");
        setTimeout(() => setShowSuccess(false), 3000);
      })
      .catch(err => {
        alert("Error: " + (err.response?.data?.error || err.message));
      });
  };

  const handlePostClick = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const featuredPosts = [
    {
      id: 1,
      title: "Cushion Styling Ideas for Every Room",
      excerpt:
        "Discover creative ways to style cushions to elevate your living space...",
      category: "cushions",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
      author: "Aarav Singh",
      date: "May 15, 2024",
      readTime: "4 min read",
      likes: 210,
      comments: 18,
      fullContent:
        "Cushions are the easiest way to add color and comfort to any room. Learn how to mix and match patterns, textures, and sizes for a designer look.",
    },
    {
      id: 2,
      title: "Choosing the Perfect Bedsheet for Your Bedroom",
      excerpt:
        "A guide to selecting bedsheets that match your style and ensure a good night's sleep...",
      category: "bedsheets",
      image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=600&q=80",
      author: "Simran Kaur",
      date: "May 12, 2024",
      readTime: "5 min read",
      likes: 185,
      comments: 22,
      fullContent:
        "From cotton to linen, explore the best fabrics and patterns for bedsheets that suit every season and decor theme.",
    },
    {
      id: 3,
      title: "Dohars & Quilts: Comfort Meets Style",
      excerpt:
        "Find out how dohars and quilts can add both warmth and elegance to your bedroom...",
      category: "dohars & quilts",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      author: "Priya Mehra",
      date: "May 10, 2024",
      readTime: "6 min read",
      likes: 170,
      comments: 19,
      fullContent:
        "Dohars and quilts are perfect for every season. Learn about the latest trends, materials, and how to layer them for a cozy look.",
    },
    {
      id: 4,
      title: "How to Create a Luxurious Bedset",
      excerpt:
        "Tips and tricks to make your bed look and feel like a five-star hotel...",
      category: "bedsets",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      author: "Rohit Sharma",
      date: "May 8, 2024",
      readTime: "5 min read",
      likes: 145,
      comments: 15,
      fullContent:
        "A beautiful bedset can transform your bedroom. Discover how to layer sheets, duvets, and pillows for maximum comfort and style.",
    },
    {
      id: 5,
      title: "Home Decor Trends: Soft Furnishings Edition",
      excerpt:
        "Stay updated with the latest trends in cushions, throws, and bedding for 2024...",
      category: "home decor",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
      author: "Ananya Gupta",
      date: "May 6, 2024",
      readTime: "4 min read",
      likes: 130,
      comments: 12,
      fullContent:
        "Soft furnishings are the heart of home decor. Explore trending colors, prints, and textures for cushions, bedsheets, and more this year.",
    },
    {
      id: 6,
      title: "Care Tips for Your Bedding Essentials",
      excerpt:
        "Learn how to keep your bedsheets, quilts, and cushions fresh and long-lasting...",
      category: "care tips",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
      author: "Mehul Patel",
      date: "May 4, 2024",
      readTime: "3 min read",
      likes: 120,
      comments: 10,
      fullContent:
        "Proper care can extend the life of your bedding. Get expert advice on washing, storing, and maintaining your soft furnishings.",
    },
    {
      id: 7,
      title: "Mix & Match: Styling Cushions and Throws",
      excerpt:
        "How to combine different cushions and throws for a cozy, stylish living room...",
      category: "cushions",
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
      author: "Neha Verma",
      date: "May 2, 2024",
      readTime: "4 min read",
      likes: 110,
      comments: 9,
      fullContent:
        "Mixing and matching cushions and throws can instantly refresh your space. Learn the secrets to a balanced and inviting look.",
    },
    {
      id: 8,
      title: "Seasonal Bedding: What to Use When?",
      excerpt:
        "A guide to choosing the right bedding for every season, from summer to winter...",
      category: "bedsheets",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
      author: "Sarah Johnson",
      date: "April 30, 2024",
      readTime: "5 min read",
      likes: 100,
      comments: 8,
      fullContent:
        "Switching your bedding with the seasons keeps you comfortable year-round. Find out which materials and layers work best for each time of year.",
    },
    {
      id: 9,
      title: "How to Choose the Right Pillow for Better Sleep",
      excerpt:
        "A complete guide to picking pillows that support your sleep and style...",
      category: "pillows",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
      author: "Kavita Joshi",
      date: "April 28, 2024",
      readTime: "4 min read",
      likes: 95,
      comments: 7,
      fullContent:
        "The right pillow can make all the difference. Learn about different types, fillings, and how to match them to your sleeping style.",
    },
    {
      id: 10,
      title: "Decorating with Throws: Cozy Up Your Home",
      excerpt:
        "Throws are more than just for warmth—see how to use them for style...",
      category: "throws",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
      author: "Ritu Sharma",
      date: "April 25, 2024",
      readTime: "3 min read",
      likes: 88,
      comments: 6,
      fullContent:
        "Throws add instant coziness and color. Discover creative ways to drape and style them in every room.",
    },
    {
      id: 11,
      title: "Kids' Bedding: Fun & Functional Ideas",
      excerpt:
        "Make your kids' room cheerful and comfy with these bedding tips...",
      category: "kids bedding",
      image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=600&q=80",
      author: "Amit Sinha",
      date: "April 22, 2024",
      readTime: "5 min read",
      likes: 77,
      comments: 5,
      fullContent:
        "Kids' bedding should be both fun and practical. Explore playful prints, easy-care fabrics, and safety tips for your little ones.",
    },
    {
      id: 12,
      title: "Guest Room Makeover: Bedding Essentials",
      excerpt:
        "Impress your guests with a welcoming and comfortable bed setup...",
      category: "guest room",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      author: "Sonal Jain",
      date: "April 20, 2024",
      readTime: "4 min read",
      likes: 70,
      comments: 4,
      fullContent:
        "A great guest room starts with the right bedding. Get tips on layering, extra pillows, and thoughtful touches for visitors.",
    },
  ];

  const blogPosts = [
    {
      id: 3,
      title: "Accessorizing for Every Occasion",
      excerpt:
        "Master the art of accessorizing with our comprehensive guide...",
      category: "accessories",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
      author: "Emma Wilson",
      date: "May 10, 2024",
      readTime: "4 min read",
      likes: 156,
      comments: 24,
      fullContent:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 4,
      title: "Fashion Trends for Men in 2024",
      excerpt:
        "The ultimate guide to men's fashion trends that will define this year...",
      category: "fashion",
      image: "https://images.unsplash.com/photo-1520975661595-6453be3f7070",
      author: "James Smith",
      date: "May 9, 2024",
      readTime: "6 min read",
      likes: 142,
      comments: 19,
      fullContent:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    },
    {
      id: 5,
      title: "The Psychology of Fashion Choices",
      excerpt:
        "Understanding how your fashion choices reflect and affect your psychology...",
      category: "lifestyle",
      image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2",
      author: "Dr. Rebecca Lee",
      date: "May 7, 2024",
      readTime: "9 min read",
      likes: 203,
      comments: 37,
      fullContent:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    },
  ];

  const categories = [
    { id: "all", name: "All Posts", icon: <FaGlobeAmericas /> },
    { id: "fashion", name: "Fashion", icon: <FaTshirt /> },
    { id: "sustainability", name: "Sustainability", icon: <FaLeaf /> },
    { id: "accessories", name: "Accessories", icon: <FaGem /> },
    { id: "lifestyle", name: "Lifestyle", icon: <FaFeatherAlt /> },
  ];

  const filteredPosts = blogPosts.filter(
    (post) =>
      (selectedCategory === "all" || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filtered featured posts based on search and category
  const filteredFeaturedPosts = featuredPosts.filter(
    (post) =>
      (selectedCategory === "all" || post.category === selectedCategory) &&
      (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.fullContent.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className={`blog-container ${fadeIn ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <div className="animated-heading">
            <span>F</span>
            <span>E</span>
            <span>A</span>
            <span>T</span>
            <span>U</span>
            <span>R</span>
            <span>E</span>
            <span>D</span>
            <span className="space"></span>
            <span className="space"></span>
            <span>S</span>
            <span>T</span>
            <span>O</span>
            <span>R</span>
            <span>I</span>
            <span>E</span>
            <span>S</span>

          
          </div>
          <div className="blog-hero-description">
            <p>Explore Our Articles on Fashion Trends, Styling Tips, and Sustainable Fashion</p>
            <p>Stay Informed with the Latest in Fashion from Fika</p>
          </div>
          <div className="search-container">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
                readOnly={false}
                disabled={false}
                style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.15)', color: 'white' }}
              />
            </div>
          </div>
          {/* Horizontal Category Bar */}
          <div className="blog-category-bar">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`blog-category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="featured-blog-section">
        <div className="section-header">
          <h2 className="section-title">FEATURED STORIES</h2>
          <div className="section-divider"></div>
        </div>
        <div className="featured-blog-grid">
          {filteredFeaturedPosts.map((post, index) => (
            <div
              key={post.id}
              className={`featured-blog-card ${index % 2 === 0 ? 'even' : 'odd'}`}
              onClick={() => handlePostClick(post.id)}
            >
              <div className="featured-blog-image">
                <img src={post.image} alt={post.title} />
                <div className="category-badge">{post.category}</div>
              </div>
              <div className="featured-blog-content">
                <h3>{post.title}</h3>
                <div className="blog-meta">
                  <span className="blog-author"><FaUserAlt /> {post.author}</span>
                  <span className="blog-date"><FaCalendarAlt /> {post.date}</span>
                  <span className="blog-time"><FaClock /> {post.readTime}</span>
                </div>
                <p className="blog-excerpt">
                  {expandedPost === post.id ? post.fullContent : post.excerpt}
                </p>
                <div className="blog-stats">
                  <span className="blog-likes"><FaHeart /> {post.likes}</span>
                  <span className="blog-comments"><FaComment /> {post.comments}</span>
                </div>
                <button className="read-more-btn">
                  Read {expandedPost === post.id ? 'Less' : 'More'} 
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="blog-grid-section">
        <div className="blog-grid">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className={`blog-card ${index % 3 === 0 ? 'large' : ''}`}
              onClick={() => handlePostClick(post.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="blog-card-image">
                <img src={post.image} alt={post.title} />
                <div className="blog-card-overlay">
                  <div className="category-tag">{post.category}</div>
                </div>
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-card-date"><FaCalendarAlt /> {post.date}</span>
                  <span className="blog-card-time"><FaClock /> {post.readTime}</span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">
                  {expandedPost === post.id ? post.fullContent : post.excerpt}
                </p>
                <div className="blog-card-stats">
                  <span className="blog-card-likes"><FaHeart /> {post.likes}</span>
                  <span className="blog-card-comments"><FaComment /> {post.comments}</span>
                </div>
                <div className="blog-card-author">
                  <span className="author-name">By {post.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="blog-newsletter">
        <div className="newsletter-container">
          <h2 className="newsletter-title">SUBSCRIBE FOR UPDATES</h2>
          <div className="newsletter-divider"></div>
          <p className="newsletter-description">
            Get the latest fashion articles, styling tips, and exclusive updates delivered to your inbox
          </p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="subscribe-btn">
              SUBSCRIBE <span className="arrow">→</span>
            </button>
          </form>
          {showSuccess && (
            <div className="subscription-success">
              <span className="success-message">Subscription successful! Thank you for joining.</span>
            </div>
          )}
        </div>
      </section>
      
      {/* Trending Topics */}
      <section className="trending-topics">
        <div className="trending-container">
          <h3 className="trending-title">TRENDING TOPICS</h3>
          <div className="trending-tags">
            <span className="trending-tag">#SummerFashion</span>
            <span className="trending-tag">#SustainableStyle</span>
            <span className="trending-tag">#FashionTips</span>
            <span className="trending-tag">#Accessories</span>
            <span className="trending-tag">#MinimalistFashion</span>
            <span className="trending-tag">#ColorTrends</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedStories;
