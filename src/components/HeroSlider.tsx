'use client';

import { useState, useEffect, useRef } from 'react';

const slides = [
  {
    src: '/brill-cfp-2026.jpg',
    alt: 'Call for Papers — Hallyu: The Korean Wave, Vol. 1 No. 2 (2026), Published by Brill',
  },
  {
    src: '/female-universalism-poster.jpg',
    alt: 'Female Universalism — Book Launch Seminar Poster',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <section
      className="main-hero hero-slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background images — crossfade */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="hero-slide-bg"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={slide.src} alt={slide.alt} />
        </div>
      ))}

      {/* Dots indicator */}
      <div className="hero-slider-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-slider-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Overlay text */}
      <div className="main-hero-content">
        <div className="main-hero-korean">세계한류학회</div>
        <h1 className="main-hero-title">
          World Association for<br />
          <em>Hallyu Studies</em>
        </h1>
        <p className="main-hero-subtitle">
          Advancing the academic study of the Korean Wave through international collaboration,
          research excellence, and scholarly discourse across diverse disciplines.
        </p>
      </div>
    </section>
  );
}