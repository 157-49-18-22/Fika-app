import React, { useState, useEffect, useRef } from 'react';
import './Products.css';
import { FaBox, FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const initialProducts = [
  { id: 1, name: 'Cappuccino', category: 'Coffee', price: 4.99, stock: 100, status: 'active' },
  { id: 2, name: 'Green Tea', category: 'Tea', price: 3.99, stock: 150, status: 'active' },
  { id: 3, name: 'Croissant', category: 'Pastries', price: 2.99, stock: 50, status: 'active' },
];

const emptyProduct = { name: '', category: '', price: '', stock: '', status: 'active' };

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", watchlist: [1, 3] },
  { id: 2, name: "Jane Smith", email: "jane@example.com", watchlist: [2, 1] },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", watchlist: [1, 2, 3] },
  { id: 4, name: "User 4", email: "user4@example.com", watchlist: [1] },
  { id: 5, name: "User 5", email: "user5@example.com", watchlist: [1] },
  { id: 6, name: "User 6", email: "user6@example.com", watchlist: [1] },
  { id: 7, name: "User 7", email: "user7@example.com", watchlist: [1] },
  { id: 8, name: "User 8", email: "user8@example.com", watchlist: [1] },
  { id: 9, name: "User 9", email: "user9@example.com", watchlist: [1] },
  { id: 10, name: "User 10", email: "user10@example.com", watchlist: [1] },
];

const getUsersForProduct = (productId) => {
  return users.filter(user => user.watchlist.includes(productId));
};

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const btnRefs = useRef({});

  const openAddModal = () => {
    setEditProduct(null);
    setForm(emptyProduct);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setForm(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyProduct);
    setEditProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };
    if (editProduct) {
      setProducts(products.map((p) => (p.id === editProduct.id ? { ...editProduct, ...productData } : p)));
    } else {
      setProducts([...products, { ...productData, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const toggleDropdown = (productId) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
  };

  useEffect(() => {
    if (openDropdown === null) return;
    function handleClickOutside(event) {
      const ref = dropdownRefs.current[openDropdown];
      const btn = btnRefs.current[openDropdown];
      if (
        ref && !ref.contains(event.target) &&
        btn && !btn.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="products-admin-page">
      <div className="products-header">
        <h2><FaBox /> Products Management</h2>
        <button className="add-product-btn" onClick={openAddModal}>
          <FaPlus /> Add New Product
        </button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Wishlisted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const wishlistedUsers = getUsersForProduct(product.id);
              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td style={{ position: 'relative' }}>
                    <button
                      ref={el => (btnRefs.current[product.id] = el)}
                      className="wishlist-dropdown-btn"
                      onClick={() => toggleDropdown(product.id)}
                      style={{
                        cursor: 'pointer',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        background: openDropdown === product.id ? '#ececff' : '#f7f7f7',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 500,
                        transition: 'background 0.2s',
                        minWidth: '70px',
                      }}
                    >
                      {wishlistedUsers.length} user{wishlistedUsers.length !== 1 ? 's' : ''}
                      {openDropdown === product.id ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
                    </button>
                    {openDropdown === product.id && wishlistedUsers.length > 0 && (
                      <div
                        ref={el => (dropdownRefs.current[product.id] = el)}
                        className="wishlist-dropdown"
                        onClick={e => e.stopPropagation()}
                      >
                        {wishlistedUsers.map(user => (
                          <div key={user.id} className="wishlist-dropdown-user">
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="actions">
                    <button className="edit-btn" title="Edit Product" onClick={() => openEditModal(product)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" title="Delete Product" onClick={() => handleDelete(product.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="product-form">
              <label>Name:
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>Category:
                <input name="category" value={form.category} onChange={handleChange} required />
              </label>
              <label>Price:
                <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" min="0" />
              </label>
              <label>Stock:
                <input name="stock" value={form.stock} onChange={handleChange} required type="number" min="0" />
              </label>
              <label>Status:
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit">{editProduct ? 'Update' : 'Add'}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 