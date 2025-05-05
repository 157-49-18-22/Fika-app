import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Component/Hero/Hero.css';

export default function LoaderPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/new-arrivals');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="genie-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:9999}}>
      <span className="genie-loader">
        <span className="genie-smoke"></span>
        <span className="genie-body"></span>
        <span className="genie-sparkle"></span>
      </span>
    </div>
  );
} 