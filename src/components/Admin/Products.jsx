import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './Products.css';
import { db } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';

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
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProducts(productsData);
      setError(null);
      console.log('Fetched products from Firebase:', productsData);
    } catch (err) {
      console.error('Error fetching products from Firebase:', err);
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
      // Convert numeric fields to numbers
      const numericFormData = {
        ...formData,
        cost_price: Number(formData.cost_price),
        inventory: Number(formData.inventory),
        mrp: Number(formData.mrp),
        discount: formData.discount ? Number(formData.discount) : 0
      };

      if (selectedProduct) {
        // Update existing product
        console.log('Updating product with ID:', selectedProduct.id, typeof selectedProduct.id);
        
        if (typeof selectedProduct.id === 'number') {
          // If ID is a number, handle as a string or find the document by query
          const productsRef = collection(db, 'products');
          const q = query(productsRef, where('id', '==', selectedProduct.id));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
              ...numericFormData,
              updatedAt: serverTimestamp()
            });
            console.log('Product updated in Firebase by numeric ID:', selectedProduct.id);
          } else {
            throw new Error(`Product with numeric ID ${selectedProduct.id} not found`);
          }
        } else {
          // If ID is a string (document ID), update directly
          const productRef = doc(db, 'products', selectedProduct.id);
          await updateDoc(productRef, {
            ...numericFormData,
            updatedAt: serverTimestamp()
          });
          console.log('Product updated in Firebase by document ID:', selectedProduct.id);
        }
      } else {
        // Create new product with a unique ID
        const newProductRef = doc(collection(db, 'products'));
        // Generate a new numeric ID for the product
        const highestId = products.reduce((max, product) => 
          (product.id && typeof product.id === 'number' && product.id > max) ? product.id : max, 0);
        
        await setDoc(newProductRef, {
          ...numericFormData,
          id: highestId + 1, // Ensure a unique numeric ID for compatibility
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('New product added to Firebase:', newProductRef.id);
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
      
      // Refresh the products list
      fetchProducts();
    } catch (err) {
      console.error('Error saving product to Firebase:', err);
      setError('Failed to save product: ' + err.message);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name || '',
      category: product.category || '',
      sub_category: product.sub_category || '',
      product_code: product.product_code || '',
      color: product.color || '',
      product_description: product.product_description || '',
      material: product.material || '',
      product_details: product.product_details || '',
      dimension: product.dimension || '',
      care_instructions: product.care_instructions || '',
      cost_price: product.cost_price || '',
      inventory: product.inventory || '',
      mrp: product.mrp || '',
      discount: product.discount || '',
      image: product.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const productRef = doc(db, 'products', id);
        await deleteDoc(productRef);
        console.log('Product deleted from Firebase:', id);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product from Firebase:', err);
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