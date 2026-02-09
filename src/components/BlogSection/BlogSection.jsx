import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";
import './BlogSection.css';

const BlogSection = () => {
    const blogs = [
        {
            id: 1,
            title: "Elevate Your Home with Thoughtfully Designed Home Décor from Fika India",
            excerpt: "A home is more than just a space—it's a reflection of your personality, taste, and lifestyle. At Fika India, we believe that the right home décor can transform everyday living into something warm, inviting, and meaningful.",
            content: `A home is more than just a space—it's a reflection of your personality, taste, and lifestyle. At Fika India, we believe that the right home décor can transform everyday living into something warm, inviting, and meaningful. Our curated collection of décor and lifestyle products is designed to help you create spaces that feel calm, stylish, and effortlessly elegant.

**The Philosophy Behind Fika India**

Inspired by the idea of slowing down and appreciating everyday moments, Fika India brings a mindful approach to home styling. Our designs focus on simplicity, comfort, and timeless aesthetics—perfect for modern Indian homes. Every product is thoughtfully selected to blend functionality with visual appeal, ensuring your space feels both beautiful and livable.

**Thoughtfully Curated Home Décor Products**

At Fika India, our all products collection showcases a range of décor and lifestyle essentials crafted to elevate different corners of your home. Whether you are refreshing your living room, bedroom, or cozy reading nook, our products add warmth and character without overwhelming the space.

From soft furnishings to decorative accents, our collection is ideal for those who love:
• Minimal yet elegant home décor
• Neutral tones with modern appeal
• Products that complement contemporary and Scandinavian inspired interiors
• Décor that feels calm, cozy, and inviting

Each product is designed to fit seamlessly into your home while enhancing its overall aesthetic.

**Why Choose Fika India for Home Décor?**

Choosing the right home décor brand makes all the difference. Fika India stands out because we focus on quality, design consistency, and customer experience.

What makes Fika India special:
• Premium-quality home décor products
• Clean, modern, and timeless designs
• Perfect for everyday living and gifting
• Suitable for modern Indian homes
• Carefully curated collections rather than mass produced items

Our goal is to help you style your home in a way that feels personal, comfortable, and enduring.

**Styling Your Home the Fika Way**

Decorating your home doesn't have to be complicated. With Fika India, you can create a cohesive look by choosing décor pieces that complement each other in color, texture, and design. Whether you prefer a minimalist setup or a warm, layered look, our products allow you to express your style with ease.

Small décor changes—like adding the right accessories or soft furnishings—can make a big impact on how your space looks and feels.

**Shop Home Décor Online in India**

Fika India makes it easy to shop home décor online in India with a seamless browsing and shopping experience. Our website is designed to help you explore all products effortlessly, discover new décor ideas, and choose items that suit your home perfectly.

With detailed product listings and carefully curated collections, finding the right décor pieces has never been easier.

**Conclusion**

If you're looking to upgrade your living space with stylish, modern, and thoughtfully designed décor, Fika India is your go-to destination. Explore our all products collection and discover home décor that turns everyday spaces into places you truly love.

Create a home that feels calm, stylish, and welcoming with Fika India.`,
            image: "/FK-BS-001 Full.webp",
            date: "February 2026",
            category: "Home Décor"
        },
        {
            id: 2,
            title: "Modern & Minimalist Home Decor Items by Fika India",
            excerpt: "Buy home decor online in India at Fika India. Explore modern and minimalist home decor items, premium cushions, candles and home accessories online.",
            content: `**Home Decor Online in India: Modern & Minimalist Home Decor Items**

Choosing the right home decor online is essential for creating interiors that feel stylish, comfortable, and timeless. At Fika India, home décor is thoughtfully designed to suit modern Indian homes where aesthetics, quality, and functionality come together.

From elegant cushions to refined décor accessories, Fika India offers curated home decor items that seamlessly blend modern design with everyday living.

**Why Buy Home Decor Online from Fika India**

When you buy home decor online, quality and design matter. Fika India focuses on:
• Carefully curated décor collections
• Premium materials and craftsmanship
• Designs that complement modern and minimalist interiors

Shopping home accessories online at Fika India ensures access to décor pieces that are stylish, functional, and easy to pair with existing interiors.

**Modern Home Decor Items Designed for Everyday Living**

Modern home decor items from Fika India are created to enhance living spaces without overwhelming them. Each product is designed keeping balance and versatility in mind.

Popular modern décor offerings include:
• Decorative cushions that add texture and warmth
• Minimal décor accessories for shelves and side tables
• Elegant candles that enhance ambience

These pieces work well across living rooms, bedrooms, and cozy corners of the home.

**Minimalist Home Decor with a Premium Touch**

Minimalist home decor is at the heart of Fika India's design philosophy. The focus is on:
• Clean designs
• Neutral and calming colour palettes
• Décor that feels intentional rather than excessive

By choosing a few well designed décor elements, minimalist interiors remain timeless and clutter free.

**Living Room Decor Items That Define Your Space**

The living room reflects your personal style. Selecting the right living room decor items can transform the space instantly.

Fika India's décor collections help create a balanced living room with:
• Stylish cushion combinations
• Subtle décor accents
• Candles and accessories that add warmth

Each item is designed to blend effortlessly with modern Indian interiors.

**Choosing the Right Home Accessories Online**

When browsing home accessories online, Fika India encourages a thoughtful approach:
• Select versatile décor items
• Focus on quality over quantity
• Choose designs that suit multiple spaces

This ensures your décor remains functional, stylish, and long lasting.

**Buy Home Decor Online That Matches Modern Indian Homes**

Fika India offers décor pieces crafted for homes that value simplicity, comfort, and refined aesthetics. Whether you are updating a single corner or refreshing an entire room, Fika India's home decor online collections make styling effortless.`,
            image: "/FK-CC-001.webp",
            date: "February 2026",
            category: "Home Décor"
        },
        {
            id: 3,
            title: "Buy Home Decor Online in India: Thoughtfully Designed Spaces with FIKA",
            excerpt: "In recent years, the way people style their homes has evolved significantly. Today, homeowners are not just looking for decor items—they are looking for meaning, comfort, and design that reflects their lifestyle.",
            content: `In recent years, the way people style their homes has evolved significantly. FIKA, a modern Indian home decor brand, brings together carefully curated collections that balance aesthetics, quality, and everyday usability.`,
            image: "/FK-CC-020.webp",
            date: "February 2026",
            category: "Home Décor"
        },
        {
            id: 4,
            title: "Premium Home Decor Accessories Online: Elevate Every Corner of Your Home with FIKA",
            excerpt: "A well designed home is created through details—the textures you touch, the colours you see, and the atmosphere you feel. Today, with the growth of home decor online, homeowners can easily curate spaces that reflect both comfort and personality.",
            content: `A well designed home is created through details. FIKA, a modern Indian home decor brand, brings together thoughtfully designed pieces that enhance everyday living.`,
            image: "/FK-BS-003 Full.webp",
            date: "February 2026",
            category: "Home Décor"
        }
    ];

    console.log('BlogSection rendering with', blogs.length, 'blogs');

    return (
        <section className="blog-section">
            <div className="blog-container">
                <div className="blog-header">
                    <h2 className="blog-title">From Our Blog</h2>
                    <p className="blog-subtitle">Discover inspiration and tips for creating your dream home</p>
                </div>

                <div className="blog-grid">
                    {blogs.map((blog) => (
                        <article key={blog.id} className="blog-card">
                            <div className="blog-image-wrapper">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="blog-image"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-blog.jpg';
                                    }}
                                />
                                <div className="blog-category-badge">{blog.category}</div>
                            </div>

                            <div className="blog-content">
                                <div className="blog-meta">
                                    <span className="blog-date">{blog.date}</span>
                                </div>

                                <h3 className="blog-card-title">{blog.title}</h3>
                                <p className="blog-excerpt">{blog.excerpt}</p>

                                <Link to={`/blog/${blog.id}`} className="blog-read-more">
                                    Read More
                                    <FaChevronRight className="blog-arrow-icon" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
