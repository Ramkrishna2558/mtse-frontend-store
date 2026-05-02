import React, { useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useConfig } from '../../context/ConfigContext';
import { useSnackbar } from '../../components/common/Snackbar';
import { useNavigate } from 'react-router-dom';

export const CustomerLogin: React.FC = () => {
  const { login } = useCustomerAuth();
  const { platformConfig } = useConfig();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email);
      showSnackbar('Welcome back! Login successful.', 'success');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showSnackbar(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f7', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ padding: '1.5rem 5%', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'white' }}>
        <h2 style={{ margin: 0, color: '#ff6b35', cursor: 'pointer', fontWeight: 800 }} onClick={() => navigate('/')}>
          ← {platformConfig.platformName}
        </h2>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', textAlign: 'center', color: '#1a1a2e' }}>
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ margin: '0 0 2rem 0', color: '#999', fontSize: '0.9rem', textAlign: 'center' }}>
            {isRegistering ? 'Join the marketplace for exclusive deals' : 'Sign in to track your orders'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#ff6b35'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#eee'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#ff6b35'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#eee'; }}
              />
            </div>

            {isRegistering && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#ff6b35'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#eee'; }}
                />
              </div>
            )}

            <button type="submit" style={{ padding: '14px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem' }}>
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#999' }}>
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button onClick={() => setIsRegistering(!isRegistering)} style={{ background: 'none', border: 'none', color: '#ff6b35', cursor: 'pointer', fontWeight: 700, padding: 0, fontSize: '0.85rem' }}>
              {isRegistering ? 'Sign In' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
