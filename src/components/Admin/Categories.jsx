import React, { useState } from 'react';
import './Categories.css';
import { FaList, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Coffee', description: 'Hot and cold coffee drinks', status: 'active' },
    { id: 2, name: 'Tea', description: 'Various tea selections', status: 'active' },
    { id: 3, name: 'Pastries', description: 'Fresh baked goods', status: 'active' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', status: 'active' });
  const [editId, setEditId] = useState(null);

  const openModal = () => {
    setForm({ name: '', description: '', status: 'active' });
    setEditId(null);
    setShowModal(true);
  };
  const openEditModal = (category) => {
    setForm({ name: category.name, description: category.description, status: category.status });
    setEditId(category.id);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setCategories(categories.map(cat => cat.id === editId ? { ...cat, ...form } : cat));
    } else {
      setCategories([
        ...categories,
        { ...form, id: Date.now() }
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="categories-admin-page">
      <div className="categories-header">
        <h2><FaList /> Categories Management</h2>
        <button className="add-category-btn" onClick={openModal}>
          <FaPlus /> Add New Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <h3>{category.name}</h3>
              <div className="category-actions">
                <button className="edit-btn" title="Edit Category" onClick={() => openEditModal(category)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" title="Delete Category" onClick={() => handleDelete(category.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="category-description">{category.description}</p>
            <span className={`status-badge ${category.status}`}>
              {category.status}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 style={{ color: '#6c47ff', fontWeight: 700, fontSize: '1.35rem', marginBottom: 8, letterSpacing: '0.2px' }}>{editId ? 'Edit Category' : 'Add New Category'}</h3>
            <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, #6c47ff 30%, #a084ff 100%)', borderRadius: 2, marginBottom: 18, opacity: 0.13 }} />
            <form className="category-form" onSubmit={handleSubmit}>
              <label>Name:
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>Description:
                <input name="description" value={form.description} onChange={handleChange} required />
              </label>
              <label>Status:
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={{
                    padding: '10px 12px',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: 7,
                    fontSize: '1rem',
                    background: '#f7f8fa',
                    transition: 'border 0.18s',
                    marginTop: 4,
                    color: '#222',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #6c47ff'}
                  onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit" style={{
                  background: 'linear-gradient(90deg, #6c47ff 60%, #a084ff 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  padding: '8px 24px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(108,71,255,0.08)',
                  marginRight: 8
                }}>{editId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={closeModal} style={{
                  background: '#f7f8fa',
                  color: '#6c47ff',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  padding: '8px 24px',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border 0.2s'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories; 