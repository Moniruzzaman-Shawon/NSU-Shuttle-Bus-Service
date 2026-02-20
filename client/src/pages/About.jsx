import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import './About.css';

const values = [
  {
    icon: '\uD83D\uDEE1\uFE0F',
    title: 'Safety First',
    desc: 'GPS-tracked buses, licensed drivers, and regular maintenance ensure every ride is safe and secure.',
  },
  {
    icon: '\u23F1\uFE0F',
    title: 'Punctuality',
    desc: 'We value your time. Our shuttles run on schedule with multiple time slots to fit your academic routine.',
  },
  {
    icon: '\uD83E\uDD1D',
    title: 'Student-Centric',
    desc: 'Built by NSU, for NSU students. Every decision we make puts student convenience first.',
  },
];

const facts = [
  { number: '10+', label: 'Pickup Stops' },
  { number: '15', label: 'Daily Slots' },
  { number: '7AM-7PM', label: 'Operating Hours' },
  { number: 'NSU', label: 'Exclusive Access' },
];

export default function About() {
  return (
    <>
      <HeroHeader variant="dark-heavy" short>
        <Navbar variant="dark" />
        <div className="hero-content">
          <h1>About <span>Us</span></h1>
          <p>Dedicated to providing safe, reliable transportation for NSU students across Dhaka.</p>
        </div>
      </HeroHeader>

      {/* Mission & Values */}
      <section className="about-values">
        <div className="section">
          <h2 className="section-title">Our <span>Values</span></h2>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="about-facts">
        <div className="section">
          <h2 className="section-title">Key <span>Facts</span></h2>
          <div className="facts-grid">
            {facts.map((f, i) => (
              <div className="fact-item" key={i}>
                <div className="fact-number">{f.number}</div>
                <div className="fact-label">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="about-story">
        <div className="section">
          <div className="about-story-grid">
            <div className="about-image">
              <img src="/img/nsu-1.jpg" alt="NSU Campus" />
            </div>
            <div className="about-text">
              <h2>What We Do</h2>
              <p>
                The NSU Shuttle Bus Service connects students from major areas across Dhaka
                to the North South University campus in Bashundhara. With predefined stops in
                Mirpur, Dhanmondi, Gulshan, Uttara, Banani, Mohakhali, Farmgate, Motijheel,
                and Bashundhara Gate, our fleet of buses ensures that every student can find a
                convenient pickup point near their home.
              </p>
              <p>
                We also offer custom pickup locations for added flexibility. Our service runs
                throughout the academic year with multiple time slots from early morning to evening.
                Students can book their rides through our online dashboard, track their bookings,
                and manage their shuttle schedule with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
