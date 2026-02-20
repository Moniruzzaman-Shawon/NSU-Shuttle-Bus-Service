import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import './Contact.css';

export default function Contact() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', address: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeroHeader variant="dark" short>
        <Navbar variant="dark" />
        <div className="hero-content">
          <h1>Contact <span>Us</span></h1>
          <p>Have questions? We&apos;d love to hear from you.</p>
        </div>
      </HeroHeader>

      <section className="contact-section">
        <div className="section">
          <div className="contact-grid">
            <div className="contact-form-wrapper">
              <h2>Send a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label>Name</label>
                    <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="contact-field">
                    <label>Email</label>
                    <input type="email" name="email" placeholder="Your email" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label>Phone</label>
                    <input type="text" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="contact-field">
                    <label>Address</label>
                    <input type="text" name="address" placeholder="Your address" value={form.address} onChange={handleChange} />
                  </div>
                </div>
                <div className="contact-field">
                  <label>Message</label>
                  <textarea name="message" rows="5" placeholder="Type your message..." value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="contact-info-wrapper">
              <div className="contact-info-card glass">
                <h3>North South University</h3>
                <p className="contact-tagline">Center of Excellence in Higher Education</p>
                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <span className="contact-info-icon">&#128205;</span>
                    <div>
                      <strong>Address</strong>
                      <p>Bashundhara, Block B, Plot #15<br />Dhaka-1229, Bangladesh</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-icon">&#128222;</span>
                    <div>
                      <strong>Phone</strong>
                      <p>+880-2-55668200</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-icon">&#9993;</span>
                    <div>
                      <strong>Email</strong>
                      <p>registrar@northsouth.edu</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-map">
                <iframe
                  title="NSU Location"
                  width="100%"
                  height="250"
                  frameBorder="0"
                  scrolling="no"
                  style={{ borderRadius: 'var(--radius-md, 12px)' }}
                  src="https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q=north+south+university+Bashundhara,+Dhaka+1229+Bangladesh&aq=&sll=23.818956,90.427523&sspn=0.03447,0.055189&ie=UTF8&hq=north+south+university+Bashundhara,+Dhaka+1229+Bangladesh&t=m&ll=23.815422,90.426076&spn=0.006295,0.006295&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
