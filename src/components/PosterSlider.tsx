'use client';

import { useState, useEffect, useRef } from 'react';

const slides = [
  {
    src: '/female-universalism-poster.jpg',
    alt: 'Female Universalism — Book Launch Seminar Poster',
  },
  {
    src: '/brill-cfp-2026.jpg',
    alt: 'Call for Papers — Hallyu: The Korean Wave, Vol. 1 No. 2 (2026), Published by Brill',
  },
];

export default function PosterSlider() {
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

  return (
    <section
      className="poster-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="poster-slider-inner">
        {/* Current slide */}
        <div className="poster-slide">
          <img
            src={slides[current].src}
            alt={slides[current].alt}
            className="poster-image"
          />
        </div>

        {/* Dots */}
        <div className="poster-slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`poster-slider-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}