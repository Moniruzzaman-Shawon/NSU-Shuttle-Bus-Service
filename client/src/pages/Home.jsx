import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import ImageSlider from '../components/ImageSlider';
import Footer from '../components/Footer';
import './Home.css';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroHeader variant="dark">
        <Navbar variant="dark" />
        <div className="welcome-text">
          <h1>Welcome to NSU <span>shuttle bus</span></h1>
          <p className="welcome-sub">Safe, reliable transportation for NSU students across Dhaka</p>
          <div className="welcome-actions">
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/login" className="btn-outline">Get Started</Link>
          </div>
        </div>
      </HeroHeader>

      {/* Image Slider */}
      <section className="home-slider">
        <div className="section">
          <h2 className="section-title">Our <span>Shuttle Fleet</span></h2>
          <ImageSlider />
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features">
        <div className="section">
          <h2 className="section-title">Why Choose <span>NSU Shuttle?</span></h2>
          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">&#128652;</div>
              <h3>Real-Time Booking</h3>
              <p>Book your shuttle ride instantly through our online dashboard with flexible time slots throughout the day.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">&#128274;</div>
              <h3>Safe & Secure</h3>
              <p>GPS-tracked buses, experienced drivers, and maintained vehicles ensure a safe journey every time.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">&#127759;</div>
              <h3>Wide Coverage</h3>
              <p>10 predefined stops across Dhaka — Mirpur, Gulshan, Uttara, Dhanmondi, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="home-how-it-works">
        <div className="section">
          <h2 className="section-title">How It <span>Works</span></h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up with your NSU email to access the shuttle booking system.</p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Choose Your Stop</h3>
              <p>Select from predefined stops or pick a custom location on the map.</p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Book & Ride</h3>
              <p>Pick your date and time slot, confirm your booking, and ride to campus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats">
        <div className="section">
          <div className="stats-row">
            <div className="home-stat">
              <div className="home-stat-number">10+</div>
              <div className="home-stat-label">Stops Across Dhaka</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-number">15</div>
              <div className="home-stat-label">Daily Time Slots</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-number">12h</div>
              <div className="home-stat-label">Operating Hours</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-number">24/7</div>
              <div className="home-stat-label">Online Booking</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="section" style={{ textAlign: 'center' }}>
          <h2>Ready to Ride?</h2>
          <p>Join hundreds of NSU students who use our shuttle service daily.</p>
          <Link to="/login" className="btn-primary">Book Your Shuttle Now</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
