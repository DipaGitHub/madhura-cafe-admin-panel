import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@madhuracafe.com');
  const [password, setPassword] = useState('madhura123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at center, #141A1D 0%, #07090A 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'var(--admin-card)',
        border: '1px solid var(--admin-border)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        textAlign: 'center'
      }}>
        <img
          src="/madhura-cafe-logo.png"
          alt="Madhura's Cafe"
          style={{
            height: '70px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 16px rgba(255, 210, 141, 0.6))',
            marginBottom: '16px'
          }}
        />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#FFFFFF', letterSpacing: '0.1em' }}>
          MADHURA'S CAFE
        </h2>
        <p style={{ color: 'var(--admin-gold)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '28px' }}>
          Admin Portal Login
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@madhuracafe.com"
              />
              <Mail size={18} color="var(--admin-gold)" style={{ position: 'absolute', left: 14, top: 14 }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Lock size={18} color="var(--admin-gold)" style={{ position: 'absolute', left: 14, top: 14 }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
          Default Credentials: <strong style={{ color: 'var(--admin-gold)' }}>admin@madhuracafe.com</strong> / <strong style={{ color: 'var(--admin-gold)' }}>madhura123</strong>
        </div>
      </div>
    </div>
  );
}
