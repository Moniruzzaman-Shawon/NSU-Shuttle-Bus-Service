import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import ImageSlider from '../components/ImageSlider';
import Footer from '../components/Footer';
import './Home.css';

function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return [count, ref];
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

const ROUTES = [
  { name: 'Uttara', area: 'Sector 10', time: '7:00 AM' },
  { name: 'Mirpur 10', area: 'Mirpur', time: '7:15 AM' },
  { name: 'Farmgate', area: 'Tejgaon', time: '7:30 AM' },
  { name: 'Gulshan 2', area: 'Gulshan', time: '7:45 AM' },
  { name: 'Banani', area: 'Banani', time: '8:00 AM' },
  { name: 'Mohakhali', area: 'Mohakhali', time: '8:10 AM' },
];

const TESTIMONIALS = [
  {
    name: 'Rafiq Ahmed',
    id: '2110456',
    text: 'The shuttle service has completely changed my daily commute. No more stress about traffic — I just book and ride.',
    dept: 'CSE',
  },
  {
    name: 'Nusrat Jahan',
    id: '2220891',
    text: 'Being able to pick my own stop on the map is incredibly convenient. The booking system is smooth and reliable.',
    dept: 'BBA',
  },
  {
    name: 'Tanvir Hasan',
    id: '2011234',
    text: 'I used to spend hours commuting from Mirpur. Now I book a seat in seconds and reach campus comfortably.',
    dept: 'EEE',
  },
];

export default function Home() {
  const [stopsCount, stopsRef] = useCountUp(10);
  const [slotsCount, slotsRef] = useCountUp(15);
  const [hoursCount, hoursRef] = useCountUp(12);
  const [ridesCount, ridesRef] = useCountUp(850);

  const [featRef, featVisible] = useReveal();
  const [stepsRef, stepsVisible] = useReveal();
  const [routeRef, routeVisible] = useReveal();
  const [testRef, testVisible] = useReveal();

  return (
    <>
      {/* ═══ Hero ═══ */}
      <HeroHeader variant="dark">
        <Navbar variant="dark" />
        <div className="welcome-text">
          <div className="welcome-text-inner">
            <div className="hero-badge">NSU Transportation</div>
            <h1>
              Your Campus
              <br />
              <span>Commute, Simplified</span>
            </h1>
            <p className="welcome-sub">
              Book your shuttle in seconds. Travel safely across Dhaka with
              GPS-tracked buses, flexible time slots, and 10+ pickup points.
            </p>
            <div className="welcome-actions">
              <Link to="/login" className="btn-primary btn-hero">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Book a Shuttle
              </Link>
              <Link to="/services" className="btn-outline btn-hero">
                View Routes
              </Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                GPS Tracked
              </div>
              <div className="hero-trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                7 AM - 7 PM
              </div>
              <div className="hero-trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                NSU Students Only
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-cue">
          <span>Scroll to explore</span>
          <div className="scroll-arrow" />
        </div>
      </HeroHeader>

      {/* ═══ Stats Banner ═══ */}
      <section className="home-stats-banner">
        <div className="section stats-banner-inner">
          <div className="stat-item" ref={stopsRef}>
            <div className="stat-num">{stopsCount}+</div>
            <div className="stat-desc">Pickup Stops</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item" ref={slotsRef}>
            <div className="stat-num">{slotsCount}</div>
            <div className="stat-desc">Time Slots</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item" ref={hoursRef}>
            <div className="stat-num">{hoursCount}h</div>
            <div className="stat-desc">Daily Operation</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item" ref={ridesRef}>
            <div className="stat-num">{ridesCount}+</div>
            <div className="stat-desc">Monthly Rides</div>
          </div>
        </div>
      </section>

      {/* ═══ Features ═══ */}
      <section className="home-features" ref={featRef}>
        <div className="section">
          <div className="section-header">
            <div className="section-label">Why NSU Shuttle</div>
            <h2 className="section-title">Built for the <span>NSU Community</span></h2>
            <p className="section-subtitle">
              A transportation system designed around your academic schedule, safety, and convenience.
            </p>
          </div>
          <div className={`features-grid ${featVisible ? 'revealed' : ''}`}>
            <div className="feature-card" style={{ '--delay': '0s' }}>
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>
              </div>
              <h3>Instant Booking</h3>
              <p>Select date, time slot, and pickup point. Your seat is confirmed in seconds — no queues, no phone calls.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.1s' }}>
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3>Interactive Map</h3>
              <p>Choose from 10+ predefined stops or drop a pin anywhere on the map for a custom pickup location.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.2s' }}>
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Safe & Tracked</h3>
              <p>Every bus is GPS-tracked with experienced drivers. Your family can know you're traveling safely.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.3s' }}>
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <h3>Smart Dashboard</h3>
              <p>Track all your bookings, view ride history, manage your profile, and cancel rides — all in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="home-how-it-works" ref={stepsRef}>
        <div className="section">
          <div className="section-header">
            <div className="section-label">Getting Started</div>
            <h2 className="section-title">Three Steps to <span>Your Ride</span></h2>
          </div>
          <div className={`steps-grid ${stepsVisible ? 'revealed' : ''}`}>
            <div className="step-card" style={{ '--delay': '0s' }}>
              <div className="step-num-ring">
                <span>01</span>
              </div>
              <div className="step-body">
                <h3>Create Your Account</h3>
                <p>Register with your <strong>@northsouth.edu</strong> email. Only verified NSU students can access the system.</p>
              </div>
            </div>
            <div className="step-line" />
            <div className="step-card" style={{ '--delay': '0.15s' }}>
              <div className="step-num-ring">
                <span>02</span>
              </div>
              <div className="step-body">
                <h3>Pick Your Stop</h3>
                <p>Browse predefined stops on an interactive map — Uttara, Mirpur, Gulshan, Dhanmondi — or set a custom pin.</p>
              </div>
            </div>
            <div className="step-line" />
            <div className="step-card" style={{ '--delay': '0.3s' }}>
              <div className="step-num-ring">
                <span>03</span>
              </div>
              <div className="step-body">
                <h3>Book & Ride</h3>
                <p>Choose your date and time slot, confirm the booking, and board your shuttle to campus. That's it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Route Preview ═══ */}
      <section className="home-routes" ref={routeRef}>
        <div className="section">
          <div className="routes-layout">
            <div className="routes-info">
              <div className="section-label">Live Routes</div>
              <h2 className="section-title left-align">Popular <span>Morning Routes</span></h2>
              <p className="routes-desc">
                Our shuttles cover major areas of Dhaka with morning and evening schedules synced to class timings.
              </p>
              <Link to="/services" className="btn-primary" style={{ marginTop: 24 }}>
                See All Routes
              </Link>
            </div>
            <div className={`routes-list ${routeVisible ? 'revealed' : ''}`}>
              {ROUTES.map((r, i) => (
                <div
                  className="route-item"
                  key={r.name}
                  style={{ '--delay': `${i * 0.07}s` }}
                >
                  <div className="route-dot-col">
                    <div className="route-dot" />
                    {i < ROUTES.length - 1 && <div className="route-connector" />}
                  </div>
                  <div className="route-info">
                    <div className="route-name">{r.name}</div>
                    <div className="route-area">{r.area}</div>
                  </div>
                  <div className="route-time">{r.time}</div>
                </div>
              ))}
              <div className="route-destination">
                <div className="route-dot-col">
                  <div className="route-dot destination-dot" />
                </div>
                <div className="route-info">
                  <div className="route-name">NSU Campus</div>
                  <div className="route-area">Bashundhara, Dhaka</div>
                </div>
                <div className="route-time route-arrival">8:30 AM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Fleet Gallery ═══ */}
      <section className="home-slider">
        <div className="section">
          <div className="section-header">
            <div className="section-label">Our Fleet</div>
            <h2 className="section-title">Modern <span>Shuttle Buses</span></h2>
          </div>
          <ImageSlider />
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section className="home-testimonials" ref={testRef}>
        <div className="section">
          <div className="section-header">
            <div className="section-label">Student Voices</div>
            <h2 className="section-title">What Students <span>Say</span></h2>
          </div>
          <div className={`testimonials-grid ${testVisible ? 'revealed' : ''}`}>
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i} style={{ '--delay': `${i * 0.12}s` }}>
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-meta">{t.dept} &middot; ID: {t.id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="home-cta">
        <div className="section">
          <div className="cta-inner">
            <div className="cta-bg-pattern" />
            <div className="cta-content">
              <h2>Ready to ride with us?</h2>
              <p>Join hundreds of NSU students who rely on our shuttle service every day. Your first booking is just a click away.</p>
              <div className="cta-actions">
                <Link to="/login" className="btn-primary btn-hero">
                  Start Booking Now
                </Link>
                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
