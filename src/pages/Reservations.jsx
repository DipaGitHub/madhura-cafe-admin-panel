import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckCircle2, Clock, XCircle, Trash2, Phone, Mail, Users, Calendar } from 'lucide-react';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('All');

  const loadReservations = async () => {
    const res = await api.getReservations();
    if (res.success) setReservations(res.data);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await api.updateReservationStatus(id, newStatus);
    loadReservations();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this reservation record?')) {
      await api.deleteReservation(id);
      loadReservations();
    }
  };

  const filtered = filter === 'All'
    ? reservations
    : reservations.filter(r => r.status.toLowerCase() === filter.toLowerCase());

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Table Reservations & Dining Bookings</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
            Manage customer table bookings, party sizes, and dietary notes
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            style={{
              background: filter === st ? 'var(--admin-gold)' : 'rgba(255, 210, 141, 0.08)',
              color: filter === st ? '#000000' : 'var(--admin-gold)',
              border: '1px solid var(--admin-border)',
              borderRadius: '20px',
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            {st} ({st === 'All' ? reservations.length : reservations.filter(r => r.status.toLowerCase() === st.toLowerCase()).length})
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="admin-card-section" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID & Guest</th>
              <th>Date & Time</th>
              <th>Guests</th>
              <th>Special Dietary Notes</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div>
                      <strong style={{ color: '#FFFFFF', display: 'block' }}>{r.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        📞 {r.phone} {r.email ? `• ✉️ ${r.email}` : ''}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--admin-gold)" />
                      <span>{r.date}</span>
                      <strong style={{ color: 'var(--admin-gold)' }}>{r.time}</strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} /> {r.guests} People
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                      {r.specialRequests || r.seatingPreference || 'Standard Indian Dining'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-tag status-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {r.status !== 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(r.id, 'Confirmed')}
                          title="Confirm Table"
                          style={{ background: 'rgba(34, 197, 94, 0.15)', border: 'none', color: '#4ADE80', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                      {r.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(r.id, 'Cancelled')}
                          title="Cancel Booking"
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#F87171', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r.id)}
                        title="Delete Record"
                        style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: 'var(--admin-text-muted)', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '32px' }}>
                  No reservations found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
