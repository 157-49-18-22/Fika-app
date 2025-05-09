import React, { useEffect } from "react";
import "./GenieLoader.css";
import genieImg from "/src/assets/genie.png";
import lampImg from "/src/assets/lamp.png";

const GenieLoader = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000); // 10 seconds animation

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="genie-loader-overlay">
      <div className="lamp-container">
        <img src={lampImg} alt="Lamp" className="lamp-img" />
        <div className="genie-container">
          <img src={genieImg} alt="Genie" className="genie-img" />
        </div>
      </div>
    </div>
  );
};

export default GenieLoader; 