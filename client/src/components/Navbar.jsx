import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ variant = 'dark' }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar navbar-${variant}`}>
      <div className="nav-brand">
        <a href="http://www.northsouth.edu/" target="_blank" rel="noreferrer">
          <img src="/img/logo.png" alt="NSU Logo" />
        </a>
      </div>

      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}

        {!user && (
          <li>
            <Link
              to="/login"
              className={`nav-login-btn ${location.pathname === '/login' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </li>
        )}

        {user && (
          <>
            {user.role === 'student' && (
              <li>
                <Link
                  to="/dashboard"
                  className={location.pathname === '/dashboard' ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            {user.role === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  className={location.pathname === '/admin' ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}
            <li className="nav-user-section">
              <Link
                to="/profile"
                className="nav-avatar"
                onClick={() => setMenuOpen(false)}
                title="Profile"
              >
                {initial}
              </Link>
              <button className="nav-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
