import React, { useState } from "react";
import "./Blog.css";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setEmail("");
  };

  const handlePostClick = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const featuredPosts = [
    {
      id: 1,
      title: "Summer Fashion Trends 2024",
      excerpt:
        "Discover the latest summer fashion trends that will dominate this season...",
      category: "fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
      author: "Sarah Johnson",
      date: "May 15, 2024",
      readTime: "5 min read",
      likes: 245,
      comments: 32,
      fullContent:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: 2,
      title: "Sustainable Fashion Guide",
      excerpt:
        "Learn how to build a sustainable wardrobe that's both stylish and eco-friendly...",
      category: "sustainability",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      author: "Michael Chen",
      date: "May 12, 2024",
      readTime: "7 min read",
      likes: 189,
      comments: 28,
      fullContent:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
  ];

  const categories = [
    "all",
    "fashion",
    "sustainability",
    "accessories",
    "lifestyle",
  ];

  return (
    <div className="blog-container">
      {/* Featured Posts Section */}
      <section className="featured-posts">
        <h2>Featured Posts</h2>
        <div className="featured-grid">
          {featuredPosts.map((post) => (
            <div
              key={post.id}
              className={`featured-post-card ${
                expandedPost === post.id ? "expanded" : ""
              }`}
              onClick={() => handlePostClick(post.id)}
            >
              <img src={post.image} alt={post.title} />
              <div className="featured-overlay">
                <h3>{post.title}</h3>
                <p>
                  {expandedPost === post.id ? post.fullContent : post.excerpt}
                </p>
                <div className="post-meta">
                  <span className="category">{post.category}</span>
                  <span className="date">{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Controls */}
      <section className="blog-categories">
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </section>

      {/* Blog Posts Grid */}
      <section className="posts-grid">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className={`post-card ${
              expandedPost === post.id ? "expanded" : ""
            }`}
            onClick={() => handlePostClick(post.id)}
          >
            <div className="post-image">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="post-content">
              <span className="category">{post.category}</span>
              <h3>{post.title}</h3>
              <p>
                {expandedPost === post.id ? post.fullContent : post.excerpt}
              </p>
              <div className="post-meta">
                <span className="author">{post.author}</span>
                <span className="date">{post.date}</span>
                <span className="read-time">{post.readTime}</span>
              </div>
              <div className="post-stats">
                <span className="likes">❤️ {post.likes}</span>
                <span className="comments">💬 {post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>
            Stay updated with the latest fashion trends and exclusive offers
          </p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {showSuccess && (
            <div className="newsletter-success">
              <span className="success-icon">✓</span>
              <span className="success-message">Successfully subscribed!</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
