import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@context/AppContext';

export function LoginPage() {
  const { refreshUser } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // Static credential check: must be subasree8606@gmail.com and password 12345678
    if (email.toLowerCase().trim() !== 'subasree8606@gmail.com' || password !== '12345678') {
      setErrorMsg('Invalid email or password. Access denied.');
      return;
    }

    // On success, enable demo mode to create a mock session
    setIsLoading(true);
    try {
      localStorage.setItem('demo_mode', 'true');
      localStorage.setItem('demo_user_email', email.toLowerCase().trim());
      await refreshUser();
    } catch (err) {
      setErrorMsg('Failed to initialize session.');
    } finally {
      setIsLoading(false);
      navigate('/');
    }
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="bg-glow bg-glow--1"></div>
        <div className="bg-glow bg-glow--2"></div>
      </div>

      <div className="login-container glass animate-fade-in">
        <div className="login-header">
          <div className="login-logo animate-float">⬡</div>
          <h1 className="login-title gradient-text">CEO AI</h1>
          <p className="login-subtitle">Executive Decision & Intelligence Suite</p>
        </div>

        {errorMsg && (
          <div className={`login-alert ${errorMsg.includes('successful') ? 'success' : 'error'}`}>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label>Executive Email</label>
            <input
              type="email"
              placeholder="name@ceo.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          
        </div>
      </div>
    </div>
  )
}

export default LoginPage
