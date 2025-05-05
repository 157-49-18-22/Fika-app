import React, { useEffect } from "react";
import "./GenieLoader.css";
import genieImg from "/src/assets/genie.png";

const GenieLoader = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1500); // 1.5 seconds animation

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="genie-loader-overlay">
      <div className="genie-img-anim">
        <div className="genie-smog-bg"></div>
        <div className="genie-smoke"></div>
        <img src={genieImg} alt="Genie" className="genie-img" />
      </div>
    </div>
  );
};

export default GenieLoader; 