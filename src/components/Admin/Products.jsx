import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './Products.css';
import config from '../../config';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    sub_category: '',
    product_code: '',
    color: '',
    product_description: '',
    material: '',
    product_details: '',
    dimension: '',
    care_instructions: '',
    cost_price: '',
    inventory: '',
    mrp: '',
    discount: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/api/products`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        // Update existing product
        await axios.put(`${config.API_URL}/api/products/${selectedProduct.id}`, formData);
      } else {
        // Create new product
        await axios.post(`${config.API_URL}/api/products`, formData);
      }
      setShowModal(false);
      setSelectedProduct(null);
      setFormData({
        product_name: '',
        category: '',
        sub_category: '',
        product_code: '',
        color: '',
        product_description: '',
        material: '',
        product_details: '',
        dimension: '',
        care_instructions: '',
        cost_price: '',
        inventory: '',
        mrp: '',
        discount: '',
        image: ''
      });
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name,
      category: product.category,
      sub_category: product.sub_category,
      product_code: product.product_code,
      color: product.color,
      product_description: product.product_description,
      material: product.material,
      product_details: product.product_details,
      dimension: product.dimension,
      care_instructions: product.care_instructions,
      cost_price: product.cost_price,
      inventory: product.inventory,
      mrp: product.mrp,
      discount: product.discount || '',
      image: product.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${config.API_URL}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products Management</h2>
        <button className="add-product-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Add New Product
        </button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img 
                    src={product.image} 
                    alt={product.product_name} 
                    className="product-thumbnail"
                    onError={(e) => e.target.src = '/placeholder-image.jpg'}
                  />
                </td>
                <td>{product.product_name}</td>
                <td>{product.category}</td>
                <td>₹{product.mrp}</td>
                <td>{product.inventory}</td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sub Category</label>
                <input
                  type="text"
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Product Code</label>
                <input
                  type="text"
                  name="product_code"
                  value={formData.product_code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Product Details</label>
                <textarea
                  name="product_details"
                  value={formData.product_details}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Dimension</label>
                <input
                  type="text"
                  name="dimension"
                  value={formData.dimension}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Care Instructions</label>
                <textarea
                  name="care_instructions"
                  value={formData.care_instructions}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Cost Price</label>
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Inventory</label>
                <input
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>MRP</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {selectedProduct ? 'Update' : 'Save'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProduct(null);
                    setFormData({
                      product_name: '',
                      category: '',
                      sub_category: '',
                      product_code: '',
                      color: '',
                      product_description: '',
                      material: '',
                      product_details: '',
                      dimension: '',
                      care_instructions: '',
                      cost_price: '',
                      inventory: '',
                      mrp: '',
                      discount: '',
                      image: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 