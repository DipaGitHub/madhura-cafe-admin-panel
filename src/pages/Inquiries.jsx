import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config/api';
import { Mail, Clock, User, Phone, Trash2 } from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/inquiries'));
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(apiUrl(`/api/inquiries/${id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Customer Inquiries & Feedback</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
            Messages, catering queries, and customer consultations from website visitors
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div className="admin-card-section" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '36px' }}>
            Loading inquiries...
          </div>
        ) : inquiries.length > 0 ? (
          inquiries.map((inq) => (
            <div key={inq.id} className="admin-card-section" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255, 210, 141, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-gold)' }}>
                    <User size={18} />
                  </div>
                  <div>
                    <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>{inq.name}</strong>
                    <span style={{ marginLeft: 12, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>✉️ {inq.email}</span>
                    {inq.phone && (
                      <span style={{ marginLeft: 12, color: 'var(--admin-gold)', fontSize: '0.85rem' }}>📞 {inq.phone}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-gold)', fontSize: '0.8rem' }}>
                    <Clock size={14} />
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(inq.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '4px' }}
                    title="Delete inquiry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {inq.subject && (
                <div style={{ color: 'var(--admin-gold)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
                  Subject: {inq.subject}
                </div>
              )}
              <p style={{ color: '#D1D5DB', fontSize: '0.92rem', lineHeight: 1.6, background: '#090C0D', padding: '16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                "{inq.message}"
              </p>
            </div>
          ))
        ) : (
          <div className="admin-card-section" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '36px' }}>
            No customer inquiries yet.
          </div>
        )}
      </div>
    </div>
  );
}
