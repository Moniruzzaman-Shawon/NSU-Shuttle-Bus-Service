import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './Services.css';

const services = [
  {
    icon: '\u23F0',
    title: 'Responsive Scheduling',
    desc: 'Our shuttle service operates on a flexible schedule with 15 daily time slots from 7 AM to 7 PM, adapting to student needs with real-time booking.',
  },
  {
    icon: '\uD83D\uDEE1\uFE0F',
    title: 'Safe Journey',
    desc: 'All buses are GPS-tracked, regularly maintained, and driven by experienced, licensed drivers. Student safety is our top priority.',
  },
  {
    icon: '\uD83C\uDFE0',
    title: 'Wide Coverage',
    desc: 'With 10+ predefined stops covering Mirpur, Dhanmondi, Gulshan, Uttara, Banani, and more, getting to NSU has never been easier.',
  },
  {
    icon: '\uD83D\uDDFA\uFE0F',
    title: 'Custom Pickup',
    desc: 'Can\'t find a stop near you? Pick any custom location on the interactive map as your pickup point.',
  },
  {
    icon: '\uD83D\uDCF1',
    title: 'Online Dashboard',
    desc: 'Manage your bookings, view ride history, and track booking status — all from your personal dashboard.',
  },
  {
    icon: '\u2705',
    title: 'Instant Confirmation',
    desc: 'Receive real-time booking confirmation and status updates. Admin reviews ensure every ride is accounted for.',
  },
];

export default function Services() {
  return (
    <>
      <HeroHeader variant="dark" short>
        <Navbar variant="dark" />
        <div className="hero-content">
          <h1>Our <span>Services</span></h1>
          <p>Reliable, safe, and convenient transportation tailored for NSU students.</p>
        </div>
      </HeroHeader>

      <section className="services-section">
        <div className="section">
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card" key={i}>
                <div className="service-icon">{s.icon}</div>
                <div className="service-info">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-cta">
        <div className="section" style={{ textAlign: 'center' }}>
          <h2>Start Booking Today</h2>
          <p>Create your account and book your first shuttle ride in minutes.</p>
          <Link to="/login" className="btn-primary">Get Started</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
