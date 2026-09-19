import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Layers, CalendarCheck, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout, admin } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Menu Items', path: '/menu', icon: UtensilsCrossed },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Banners', path: '/banners', icon: Image },
    { name: 'About Us', path: '/about-us', icon: Info },
    { name: 'Reservations', path: '/reservations', icon: CalendarCheck },
    { name: 'Inquiries', path: '/inquiries', icon: MessageSquare },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <img src="/madhura-cafe-logo.png" alt="Madhura's Cafe" className="sidebar-logo-img" />
        <div>
          <h2 className="sidebar-brand-title">MADHURA'S</h2>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--admin-gold)' }}>ADMIN PANEL</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: 12, fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
          Logged in as: <strong style={{ color: '#FFFFFF' }}>{admin?.email}</strong>
        </div>
        <button onClick={logout} className="logout-btn">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
