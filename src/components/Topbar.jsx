import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ title }) {
  const { admin } = useAuth();

  return (
    <header className="admin-topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="admin-badge">
        <ShieldCheck size={16} color="var(--admin-gold)" />
        <span>Ayurvedic Kitchen Operations</span>
      </div>
    </header>
  );
}
