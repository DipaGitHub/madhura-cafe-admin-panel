import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuManager from './pages/MenuManager';
import Categories from './pages/Categories';
import Reservations from './pages/Reservations';
import Inquiries from './pages/Inquiries';
import './styles/admin.css';

function ProtectedLayout({ children, title }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090C0D', color: 'var(--admin-gold)' }}>
        Loading Madhura's Cafe Admin...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title={title} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { admin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedLayout title="Executive Overview"><Dashboard /></ProtectedLayout>} />
      <Route path="/menu" element={<ProtectedLayout title="Healthy Ayurvedic Menu Manager"><MenuManager /></ProtectedLayout>} />
      <Route path="/categories" element={<ProtectedLayout title="Traditional Cuisine Categories"><Categories /></ProtectedLayout>} />
      <Route path="/reservations" element={<ProtectedLayout title="Table Dining Reservations"><Reservations /></ProtectedLayout>} />
      <Route path="/inquiries" element={<ProtectedLayout title="Customer Inquiries & Feedback"><Inquiries /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
