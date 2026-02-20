import './HeroHeader.css';

export default function HeroHeader({ variant = 'dark', short = false, children, className = '' }) {
  return (
    <header className={`hero-header hero-${variant} ${short ? 'hero-short' : ''} ${className}`}>
      {children}
    </header>
  );
}
