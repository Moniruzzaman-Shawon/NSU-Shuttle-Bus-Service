import { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';

const slides = [
  {
    src: '/img/shuttle-1.jpg',
    caption: 'Modern Fleet for Daily Commute',
  },
  {
    src: '/img/shuttle-2.jpg',
    caption: 'Comfortable & Air-Conditioned Rides',
  },
  {
    src: '/img/shuttle-3.jpg',
    caption: 'Connecting Students Across Dhaka',
  },
  {
    src: '/img/shuttle-4.jpg',
    caption: 'Safe & Reliable Transportation',
  },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div
      className="slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, i) => (
          <div className="slider-slide" key={i}>
            <img src={slide.src} alt={slide.caption} />
            <div className="slider-overlay" />
            <div className="slider-caption">{slide.caption}</div>
          </div>
        ))}
      </div>

      <button className="slider-btn slider-prev" onClick={prev} aria-label="Previous slide">
        &#8249;
      </button>
      <button className="slider-btn slider-next" onClick={next} aria-label="Next slide">
        &#8250;
      </button>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
