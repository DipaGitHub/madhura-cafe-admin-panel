import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, Layers, Sparkles } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    const res = await api.getCategories();
    if (res.success) setCategories(res.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    await api.createCategory({ name, description });
    setName('');
    setDescription('');
    setLoading(false);
    loadCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this cuisine category?')) {
      await api.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Menu Categories</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
            Organize traditional Indian food and Ayurvedic beverage sections
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '28px' }}>
        {/* Add Category Form */}
        <div className="admin-card-section">
          <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            Create New Category
          </h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ayurvedic Kashayam & Decoctions"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                rows="3"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of this traditional cuisine category..."
              ></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={18} />
              <span>{loading ? 'Adding...' : 'Create Category'}</span>
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="admin-card-section" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Layers size={18} color="var(--admin-gold)" />
                      <strong style={{ color: '#FFFFFF' }}>{cat.name}</strong>
                    </div>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                    {cat.description || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#F87171', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
