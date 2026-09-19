import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { UtensilsCrossed, CalendarCheck, Layers, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    totalCategories: 0,
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    totalInquiries: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, resRes] = await Promise.all([
          api.getStats(),
          api.getReservations()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (resRes.success) setRecentBookings(resRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Stats Counter Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <UtensilsCrossed size={26} />
          </div>
          <div>
            <div className="stat-val">{stats.totalMenuItems}</div>
            <div className="stat-label">Healthy Menu Dishes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#4ADE80' }}>
            <CalendarCheck size={26} />
          </div>
          <div>
            <div className="stat-val">{stats.totalReservations}</div>
            <div className="stat-label">Total Bookings ({stats.pendingReservations} Pending)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(212, 175, 55, 0.12)', color: 'var(--admin-gold)' }}>
            <Layers size={26} />
          </div>
          <div>
            <div className="stat-val">{stats.totalCategories}</div>
            <div className="stat-label">Cuisine Categories</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA' }}>
            <MessageSquare size={26} />
          </div>
          <div>
            <div className="stat-val">{stats.totalInquiries}</div>
            <div className="stat-label">Customer Queries</div>
          </div>
        </div>
      </div>

      {/* Recent Reservations Quick View */}
      <div className="admin-card-section">
        <div className="section-header">
          <h2 className="section-title">Latest Table Reservations</h2>
          <Link to="/reservations" className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            <span>Manage All Bookings</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Contact</th>
                <th>Date & Time</th>
                <th>Party Size</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? (
                recentBookings.map((res) => (
                  <tr key={res.id}>
                    <td><strong style={{ color: 'var(--admin-gold)' }}>#{res.id}</strong></td>
                    <td>{res.name}</td>
                    <td>{res.phone}</td>
                    <td>{res.date} at {res.time}</td>
                    <td>{res.guests} Guests</td>
                    <td>
                      <span className={`badge-tag status-${res.status.toLowerCase()}`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                    No reservations recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
