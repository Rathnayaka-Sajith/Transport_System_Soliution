'use client';

import React, { useState, useEffect } from 'react';

const BANNER_SLIDES = [
  {
    id: 1,
    src: '/images/destination/destinations-banner-1.jpg',
    fallbacks: [
      '/images/destination/destinations-banner.jpg',
      '/images/destination/destinations-banner-1.png',
      '/images/destination/destinations-banner-1.webp',
      '/images/destination/destinations-banner-1.JPEG',
      '/images/ncg-express-home-bg-overlay.webp',
    ],
  },
  {
    id: 2,
    src: '/images/destination/destinations-banner-2.jpg',
    fallbacks: [
      '/images/destination/destinations-banner-2.png',
      '/images/destination/destinations-banner-2.webp',
      '/images/footer-overlay-ncg-express.webp',
    ],
  },
  {
    id: 3,
    src: '/images/destination/destinations-banner-3.jpg',
    fallbacks: [
      '/images/destination/destinations-banner-3.png',
      '/images/destination/destinations-banner-3.webp',
      '/images/vision-mission-ncg-express.webp',
    ],
  },
];

export default function DestinationsBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds: 1 -> 2 -> 3 -> 1 -> 2 ...
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleImageError = (e, fallbacks) => {
    const current = e.target.src;
    for (const fb of fallbacks) {
      if (!current.includes(fb)) {
        e.target.src = fb;
        return;
      }
    }
  };

  return (
    <section className="destinations-hero-banner">
      {/* Background 3-Image Slider Layer: Fills the entire banner (No side spaces) */}
      <div className="banner-bg-wrap">
        {BANNER_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <img
              key={slide.id}
              src={slide.src}
              alt={`Explore Your Journey - Slide ${slide.id}`}
              className={`banner-bg-slide ${isActive ? 'active' : ''}`}
              onError={(e) => handleImageError(e, slide.fallbacks)}
            />
          );
        })}

        {/* Subtle, soft text contrast gradient on the left edge only */}
        <div className="banner-soft-vignette"></div>
      </div>

      {/* Foreground Hero Content: Middle-Left with short space */}
      <div className="banner-content-wrapper">
        <div className="banner-left-content">
          <h1 className="banner-hero-title">
            Explore<br />Your Journey
          </h1>
        </div>
      </div>

      {/* Slide Navigation Indicator Dots */}
      <div className="banner-slide-dots">
        {BANNER_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`banner-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
