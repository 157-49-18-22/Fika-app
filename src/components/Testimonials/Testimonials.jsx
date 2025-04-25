import React from 'react';
import styled from 'styled-components';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import Slider from "react-slick";

// Import slick carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const TestimonialsContainer = styled.div`
  width: 100%;
  padding: 3rem 1rem;
  margin-top: 2rem;
  position: relative;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
`;

const TestimonialTitle = styled.h2`
  font-size: 1.6rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.2rem;
  font-family: 'Playfair Display', serif;
  position: relative;
  padding-bottom: 1rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
  }
`;

const TestimonialCard = styled.div`
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 10px;
  background: rgba(255, 255, 255, 0.02);
`;

const QuoteIcon = styled(FaQuoteLeft)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.6rem;
  opacity: 0.15;
`;

const TestimonialText = styled.p`
  font-size: 0.95rem;
  color: #d0d0d0;
  line-height: 1.5;
  margin-bottom: 0.8rem;
  font-style: italic;
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const CustomerImage = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.h4`
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0;
  font-weight: 600;
`;

const CustomerRole = styled.p`
  font-size: 0.7rem;
  color: #a0a0a0;
  margin: 0.1rem 0;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.1rem;
  margin-top: 0.15rem;
`;

const StarIcon = styled(FaStar)`
  color: #ffd700;
  font-size: 0.7rem;
`;

const testimonials = [
  {
    id: 1,
    text: "I absolutely love shopping here! The quality of products and customer service is exceptional. Every purchase has been a delightful experience.",
    name: "Sarah Johnson",
    role: "Regular Customer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 5
  },
  {
    id: 2,
    text: "The selection of products is amazing, and the website is so easy to navigate. I've recommended this store to all my friends!",
    name: "Michael Chen",
    role: "Fashion Enthusiast",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 5
  },
  {
    id: 3,
    text: "Outstanding experience from browsing to delivery. The attention to detail and product quality exceeded my expectations.",
    name: "Emma Davis",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 5
  },
  {
    id: 4,
    text: "The customer service team went above and beyond to help me find the perfect outfit. I couldn't be happier with my purchase!",
    name: "David Wilson",
    role: "Style Enthusiast",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    rating: 5
  }
];

const Testimonials = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };

  return (
    <TestimonialsContainer>
      <TestimonialTitle>What Our Customers Say</TestimonialTitle>
      <Slider {...settings}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id}>
            <TestimonialCard>
              <QuoteIcon />
              <TestimonialText>{testimonial.text}</TestimonialText>
              <CustomerInfo>
                <CustomerImage src={testimonial.image} alt={testimonial.name} />
                <CustomerDetails>
                  <CustomerName>{testimonial.name}</CustomerName>
                  <CustomerRole>{testimonial.role}</CustomerRole>
                  <RatingContainer>
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <StarIcon key={index} />
                    ))}
                  </RatingContainer>
                </CustomerDetails>
              </CustomerInfo>
            </TestimonialCard>
          </div>
        ))}
      </Slider>
    </TestimonialsContainer>
  );
};

export default Testimonials; 