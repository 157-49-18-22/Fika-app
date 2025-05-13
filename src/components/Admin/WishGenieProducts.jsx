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
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = '';

      if (formData.image) {
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
        image: null
      });
      fetchProducts();
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
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
      image: null
    });
    setShowForm(true);
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="wish-genie-admin">
      <div className="admin-header">
        <h2>Wish Genie Products Management</h2>
        <button 
          className="add-product-btn"
          onClick={() => {
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
              image: null
            });
            setShowForm(true);
          }}
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="product-form">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name:</label>
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
              <label>Product Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
              <th>Product Name</th>
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