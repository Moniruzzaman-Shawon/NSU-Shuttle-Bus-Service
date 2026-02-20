import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupStudentId, setSignupStudentId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPassword);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(signupName, signupEmail, signupStudentId, signupPassword);
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeroHeader variant="dark">
      <Navbar variant="dark" />
      <div className="login-wrapper">
        <div className="login-card glass">
          <div className="login-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to your NSU account' : 'Join the NSU Shuttle community'}</p>
          </div>

          <div className="button-box">
            <div className="btn-slider" style={{ left: isLogin ? '0' : '50%' }} />
            <button type="button" className="toggle-btn" onClick={() => { setIsLogin(true); setError(''); }}>Login</button>
            <button type="button" className="toggle-btn" onClick={() => { setIsLogin(false); setError(''); }}>Sign Up</button>
          </div>

          {error && <div className="form-error">{error}</div>}

          {isLogin ? (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="your.email@northsouth.edu" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '\u25C9' : '\u25CE'}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary login-submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleSignup}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>NSU Email</label>
                <input type="email" placeholder="your.email@northsouth.edu" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" placeholder="7-digit Student ID (optional)" value={signupStudentId} onChange={(e) => setSignupStudentId(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '\u25C9' : '\u25CE'}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary login-submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </HeroHeader>
  );
}
