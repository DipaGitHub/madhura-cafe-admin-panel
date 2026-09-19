import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Check, X, Sparkles, Heart } from 'lucide-react';

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    healthBenefits: '',
    ingredients: '',
    dietary: 'Sattvic, Ayurvedic',
    image: '',
    isAvailable: true,
    isPopular: false
  });

  const loadData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        api.getMenuItems(selectedCategory),
        api.getCategories()
      ]);
      if (menuRes.success) setItems(menuRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        if (!formData.category && catRes.data.length > 0) {
          setFormData(prev => ({ ...prev, category: catRes.data[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: categories[0]?.id || '',
      price: '',
      description: '',
      healthBenefits: '',
      ingredients: '',
      dietary: 'Sattvic, Ayurvedic',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isPopular: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      healthBenefits: item.healthBenefits ? item.healthBenefits.join(', ') : '',
      ingredients: item.ingredients ? item.ingredients.join(', ') : '',
      dietary: item.dietary ? item.dietary.join(', ') : '',
      image: item.image || '',
      isAvailable: item.isAvailable,
      isPopular: item.isPopular
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await api.updateMenuItem(editingItem.id, formData);
    } else {
      await api.createMenuItem(formData);
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this healthy Indian dish from the menu?')) {
      await api.deleteMenuItem(id);
      loadData();
    }
  };

  const getCategoryName = (catId) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : catId;
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Healthy Ayurvedic Dishes & Drinks</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
            Manage wholesome traditional recipes, ingredients, and health benefits
          </p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <Plus size={18} />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedCategory('')}
          style={{
            background: selectedCategory === '' ? 'var(--admin-gold)' : 'rgba(255, 210, 141, 0.08)',
            color: selectedCategory === '' ? '#000000' : 'var(--admin-gold)',
            border: '1px solid var(--admin-border)',
            borderRadius: '20px',
            padding: '6px 16px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500
          }}
        >
          All Items ({items.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              background: selectedCategory === cat.id ? 'var(--admin-gold)' : 'rgba(255, 210, 141, 0.08)',
              color: selectedCategory === cat.id ? '#000000' : 'var(--admin-gold)',
              border: '1px solid var(--admin-border)',
              borderRadius: '20px',
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Items Table */}
      <div className="admin-card-section" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Price</th>
              <th>Ayurvedic Health Benefits</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=120&q=80'}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <strong style={{ color: '#FFFFFF', display: 'block' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                        {item.description ? item.description.slice(0, 45) + '...' : ''}
                      </span>
                    </div>
                  </div>
                </td>
                <td><span className="badge-tag" style={{ background: 'rgba(255, 210, 141, 0.1)', color: 'var(--admin-gold)' }}>{getCategoryName(item.category)}</span></td>
                <td><strong style={{ color: 'var(--admin-gold)', fontSize: '1.05rem' }}>₹{item.price}</strong></td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {item.healthBenefits && item.healthBenefits.map((hb, i) => (
                      <span key={i} className="badge-tag sattvic" style={{ fontSize: '0.72rem' }}>
                        🌱 {hb}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge-tag ${item.isAvailable ? 'status-confirmed' : 'status-cancelled'}`}>
                    {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{ background: 'rgba(255, 210, 141, 0.12)', border: 'none', color: 'var(--admin-gold)', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#F87171', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="section-header" style={{ marginBottom: 20 }}>
              <h3 className="section-title">
                {editingItem ? 'Edit Healthy Dish' : 'Add New Indian Traditional Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Dish Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ragi & Moringa Crisp Ghee Dosa"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Health Benefits (Comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.healthBenefits}
                  onChange={(e) => setFormData({ ...formData, healthBenefits: e.target.value })}
                  placeholder="e.g. Boosts Immunity, Rich in Iron & Calcium, Low Glycemic"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Key Traditional Ingredients (Comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="e.g. Sprouted Ragi, Fresh Moringa, A2 Cow Ghee, Rock Salt"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the authentic taste and preparation..."
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                  <span>Available for Orders</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  />
                  <span>Chef's Special Recommendation</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold">
                  {editingItem ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
