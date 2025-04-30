import React from "react";
import { FaBed, FaCouch } from "react-icons/fa";
import "./AllProductsStyles.css";

const AllProducts = () => {
  const categories = [
    { id: "bedsets", name: "Bedsets", icon: <FaBed /> },
    { id: "cushion covers", name: "Cushion Covers", icon: <FaCouch /> },
    { id: "dohar and quilts", name: "Dohar and Quilts", icon: <FaBed /> }
  ];

  return (
    <div className="all-products-container">
      <div className="categories-section">
        <h2>Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
