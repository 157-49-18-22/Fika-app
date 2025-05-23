import React, { useState, useEffect } from 'react';
import { 
  getWishGenieProducts, 
  createWishGenieProduct, 
  updateWishGenieProduct, 
  deleteWishGenieProduct 
} from '../../firebase/firestore';
import { uploadFile } from '../../firebase/storage';
import './WishGenieProducts.css';

const WishGenieProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [formData, setFormData] = useState({
    'Sticker Content Main': '',
    'Sticker Content Sub': '',
    'Category': '',
    'MRP': '',
    'Product code': '',
    'Burn Time': '',
    'Burning Instructions': '',
    'Diameter': '',
    'Fragrances': '',
    'Height Dimensions': '',
    'Jar type': '',
    'Product Description': '',
    'Storage': '',
    'Type of wax': '',
    'Wax color': '',
    'Weight': '',
    'warning': '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getWishGenieProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      'Sticker Content Main': product['Sticker Content Main'] || '',
      'Sticker Content Sub': product['Sticker Content Sub'] || '',
      'Category': product['Category'] || '',
      'MRP': product['MRP'] || '',
      'Product code': product['Product code'] || '',
      'Burn Time': product['Burn Time'] || '',
      'Burning Instructions': product['Burning Instructions'] || '',
      'Diameter': product['Diameter'] || '',
      'Fragrances': product['Fragrances'] || '',
      'Height Dimensions': product['Height Dimensions'] || '',
      'Jar type': product['Jar type'] || '',
      'Product Description': product['Product Description'] || '',
      'Storage': product['Storage'] || '',
      'Type of wax': product['Type of wax'] || '',
      'Wax color': product['Wax color'] || '',
      'Weight': product['Weight'] || '',
      'warning': product['warning'] || '',
      image: product.image || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = formData.image;

      if (formData.image && formData.image instanceof File) {
        const timestamp = new Date().getTime();
        const path = `wish_genie/${formData['Product code']}/${timestamp}`;
        imageUrl = await uploadFile(formData.image, path);
      }

      const productData = {
        ...formData,
        image: imageUrl,
        updatedAt: new Date()
      };

      if (editingProduct) {
        await updateWishGenieProduct(editingProduct.id, productData);
      } else {
        await createWishGenieProduct(productData);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        'Sticker Content Main': '',
        'Sticker Content Sub': '',
        'Category': '',
        'MRP': '',
        'Product code': '',
        'Burn Time': '',
        'Burning Instructions': '',
        'Diameter': '',
        'Fragrances': '',
        'Height Dimensions': '',
        'Jar type': '',
        'Product Description': '',
        'Storage': '',
        'Type of wax': '',
        'Wax color': '',
        'Weight': '',
        'warning': '',
        image: null
      });
      fetchProducts();
    } catch (err) {
      if (err.message.includes('product code already exists')) {
        setError(`Product with code ${formData['Product code']} already exists`);
      } else {
        setError('Failed to save product');
      }
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await deleteWishGenieProduct(productId);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkAdd = async () => {
    try {
      setLoading(true);
      let productsToAdd;
      try {
        productsToAdd = JSON.parse(bulkJson);
        if (!Array.isArray(productsToAdd)) {
          throw new Error('Input must be an array of products');
        }
      } catch (err) {
        setError('Invalid JSON format. Please check your input.');
        return;
      }

      const results = {
        added: [],
        skipped: []
      };

      // Add each product to the database
      for (const product of productsToAdd) {
        try {
          const productData = {
            ...product,
            updatedAt: new Date()
          };
          await createWishGenieProduct(productData);
          results.added.push(product['Product code']);
        } catch (err) {
          if (err.message.includes('product code already exists')) {
            results.skipped.push(product['Product code']);
          } else {
            throw err;
          }
        }
      }

      // Show summary message
      let message = '';
      if (results.added.length > 0) {
        message += `Successfully added ${results.added.length} products. `;
      }
      if (results.skipped.length > 0) {
        message += `Skipped ${results.skipped.length} duplicate products (codes: ${results.skipped.join(', ')}).`;
      }
      setSuccessMessage(message);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      setShowBulkForm(false);
      setBulkJson('');
      fetchProducts();
    } catch (err) {
      setError('Failed to add products');
      console.error('Error adding products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="wish-genie-admin">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      <div className="admin-header">
        <h2>Wish Genie Products Management</h2>
        <div className="header-buttons">
          <button 
            className="add-product-btn"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingProduct(null);
              } else {
                setEditingProduct(null);
                setFormData({
                  'Sticker Content Main': '',
                  'Sticker Content Sub': '',
                  'Category': '',
                  'MRP': '',
                  'Product code': '',
                  'Burn Time': '',
                  'Burning Instructions': '',
                  'Diameter': '',
                  'Fragrances': '',
                  'Height Dimensions': '',
                  'Jar type': '',
                  'Product Description': '',
                  'Storage': '',
                  'Type of wax': '',
                  'Wax color': '',
                  'Weight': '',
                  'warning': '',
                  image: null
                });
                setShowForm(true);
              }
            }}
          >
            {showForm ? 'Hide Form' : 'Add New Product'}
          </button>
          <button 
            className="bulk-add-btn"
            onClick={() => setShowBulkForm(!showBulkForm)}
          >
            Bulk Add Products
          </button>
        </div>
      </div>

      {showBulkForm && (
        <div className="bulk-form">
          <h3>Bulk Add Products</h3>
          <div className="form-group">
            <label>Enter Products JSON:</label>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder="Enter products in JSON format. Example: [{'Sticker Content Main': 'Product 1', 'Category': 'Luxury/Crystal Candles', ...}, ...]"
              rows="10"
            />
          </div>
          <div className="form-actions">
            <button 
              className="save-btn"
              onClick={handleBulkAdd}
            >
              Add Products
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowBulkForm(false);
                setBulkJson('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="product-form">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Sticker Content Main:</label>
              <input
                type="text"
                name="Sticker Content Main"
                value={formData['Sticker Content Main']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subtitle:</label>
              <input
                type="text"
                name="Sticker Content Sub"
                value={formData['Sticker Content Sub']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category:</label>
              <select
                name="Category"
                value={formData['Category']}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Luxury/Crystal Candles">Luxury/Crystal Candles</option>
                <option value="Crystal Jewellery">Crystal Jewellery</option>
                <option value="Journals">Journals</option>
              </select>
            </div>

            <div className="form-group">
              <label>MRP:</label>
              <input
                type="number"
                name="MRP"
                value={formData['MRP']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Product Code:</label>
              <input
                type="text"
                name="Product code"
                value={formData['Product code']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Burn Time:</label>
              <input
                type="text"
                name="Burn Time"
                value={formData['Burn Time']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Burning Instructions:</label>
              <textarea
                name="Burning Instructions"
                value={formData['Burning Instructions']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Diameter:</label>
              <input
                type="text"
                name="Diameter"
                value={formData['Diameter']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fragrances:</label>
              <input
                type="text"
                name="Fragrances"
                value={formData['Fragrances']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Height Dimensions:</label>
              <input
                type="text"
                name="Height Dimensions"
                value={formData['Height Dimensions']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Jar Type:</label>
              <input
                type="text"
                name="Jar type"
                value={formData['Jar type']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Product Description:</label>
              <textarea
                name="Product Description"
                value={formData['Product Description']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Storage Instructions:</label>
              <textarea
                name="Storage"
                value={formData['Storage']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Type of Wax:</label>
              <input
                type="text"
                name="Type of wax"
                value={formData['Type of wax']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Wax Color:</label>
              <input
                type="text"
                name="Wax color"
                value={formData['Wax color']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Weight:</label>
              <input
                type="text"
                name="Weight"
                value={formData['Weight']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Warning:</label>
              <textarea
                name="warning"
                value={formData['warning']}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Product Image:</label>
              <input
                type="text"
                name="image"
                value={formData.image || ''}
                onChange={handleInputChange}
                placeholder="Enter image filename"
                required={!editingProduct}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-list">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Sticker Content Main</th>
              <th>Category</th>
              <th>MRP</th>
              <th>Product Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img 
                    src={product.image || '/placeholder-image.jpg'} 
                    alt={product['Sticker Content Main']}
                    className="product-thumbnail"
                  />
                </td>
                <td>{product['Sticker Content Main']}</td>
                <td>{product['Category']}</td>
                <td>₹{product['MRP']}</td>
                <td>{product['Product code']}</td>
                <td style={{display: 'flex', gap: '10px'}}>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishGenieProducts; 