import React from 'react';
import styled from 'styled-components';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const TestimonialsContainer = styled.div`
  width: 100%;
  padding: 0;
  position: relative;
`;

const TestimonialTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Playfair Display', serif;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #ff4d4d;
    border-radius: 2px;
  }
`;

const TestimonialGrid = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem 0.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ff4d4d;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ff3333;
  }
`;

const TestimonialCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #f0f0f0;
  min-width: 350px;
  scroll-snap-align: start;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #ff4d4d;
    border-radius: 10px 10px 0 0;
  }
`;

const QuoteIcon = styled(FaQuoteLeft)`
  font-size: 2rem;
  color: #ff4d4d;
  margin-bottom: 1rem;
  opacity: 0.2;
  transition: all 0.3s ease;

  ${TestimonialCard}:hover & {
    opacity: 0.4;
    transform: scale(1.1);
  }
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-style: italic;
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

const CustomerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  ${TestimonialCard}:hover & {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  font-weight: 600;
`;

const CustomerRole = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0.2rem 0;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.3rem;
`;

const StarIcon = styled(FaStar)`
  color: #ff4d4d;
  font-size: 0.9rem;
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
  return (
    <TestimonialsContainer>
      <TestimonialTitle>What Our Customers Say</TestimonialTitle>
      <TestimonialGrid>
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id}>
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
        ))}
      </TestimonialGrid>
    </TestimonialsContainer>
  );
};

export default Testimonials; 