import React, { useState } from 'react';
import './Users.css';
import { FaUser, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' },
];

const emptyUser = { name: '', email: '', role: 'user', status: 'active' };

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(emptyUser);

  const openAddModal = () => {
    setEditUser(null);
    setForm(emptyUser);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setForm(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyUser);
    setEditUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      setUsers(users.map((u) => (u.id === editUser.id ? { ...editUser, ...form } : u)));
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="users-admin-page">
      <div className="users-header">
        <h2><FaUser /> Users Management</h2>
        <button className="add-user-btn" onClick={openAddModal}>
          <FaUserPlus /> Add New User
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td className="actions">
                  <button className="edit-btn" title="Edit User" onClick={() => openEditModal(user)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" title="Delete User" onClick={() => handleDelete(user.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editUser ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit} className="user-form">
              <label>Name:
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>Email:
                <input name="email" value={form.email} onChange={handleChange} required type="email" />
              </label>
              <label>Role:
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              </label>
              <label>Status:
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit">{editUser ? 'Update' : 'Add'}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 