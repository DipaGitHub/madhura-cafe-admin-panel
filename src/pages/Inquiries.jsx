import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Mail, Clock, MessageSquare, User } from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const loadInquiries = async () => {
      const res = await api.getInquiries();
      if (res.success) setInquiries(res.data);
    };
    loadInquiries();
  }, []);

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Customer Inquiries & Feedback</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
            Messages, catering queries, and Ayurvedic food consultations from website visitors
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {inquiries.length > 0 ? (
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
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-gold)', fontSize: '0.8rem' }}>
                  <Clock size={14} />
                  <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
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
