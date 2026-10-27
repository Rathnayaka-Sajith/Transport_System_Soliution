'use client';

import React, { useState, useEffect, useRef } from 'react';

const makeCandidates = (name) => [
  `/images/${name}.jpg`,
  `/images/${name}.jpeg`,
  `/images/${name}.png`,
  `/images/${name}.webp`,
  `/images/${name}.JPG`,
  `/images/${name}.JPEG`,
  `/images/${name}.PNG`,
];

const VISION_CARDS_DATA = [
  {
    id: 1,
    title: 'Modern Luxury Highway Fleet',
    category: 'Express Fleet',
    fileName: 'vision-1.jpg',
    candidates: makeCandidates('vision-1'),
    desc: 'High-speed luxury coaches for expressway & inter-city routes.',
    icon: 'bus',
  },
  {
    id: 2,
    title: 'First-Class Passenger Comfort',
    category: 'Cabin Interior',
    fileName: 'vision-2.jpg',
    candidates: makeCandidates('vision-2'),
    desc: 'Ergonomic reclining seats, climate control & fast USB charging.',
    icon: 'interior',
  },
  {
    id: 3,
    title: '24/7 Smart Telematics & Safety',
    category: 'Safety Systems',
    fileName: 'vision-3.jpg',
    candidates: makeCandidates('vision-3'),
    desc: 'Continuous GPS telematics, speed limiters & certified captains.',
    icon: 'safety',
  },
];

function CardItem({ card, index, isThrown, activeIndex, setActiveIndex }) {
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [hasError, setHasError] = useState(false);

  const currentSrc = card.candidates[candidateIdx];

  const handleImageError = () => {
    if (candidateIdx < card.candidates.length - 1) {
      setCandidateIdx((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const isActive = activeIndex === index;

  return (
    <div
      className={`vision-deck-card card-${index + 1} ${isThrown ? 'card-thrown' : 'card-stacked'} ${isActive ? 'card-active-focus' : ''}`}
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
      tabIndex={0}
      aria-label={`Vision Showcase Photo: ${card.title}`}
    >
      {/* Full-bleed real photo OR high-tech fallback */}
      {!hasError ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={currentSrc}
          alt={card.title}
          className="deck-card-real-img"
          onError={handleImageError}
        />
      ) : (
        <div className="deck-card-slot-placeholder">
          <div className="slot-pulse-ring" />
          <div className="slot-icon-box">
            {card.icon === 'bus' && (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
              </svg>
            )}
            {card.icon === 'interior' && (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 9h-4V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v13a4 4 0 0 0 4 4h7a4 4 0 0 0 4-4v-7a1 1 0 0 0-1-1z"/>
                <path d="M5 14h14"/>
              </svg>
            )}
            {card.icon === 'safety' && (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            )}
          </div>
          <span className="slot-instruction-text">
            Add <strong>{card.fileName}</strong>
          </span>
          <span className="slot-sub-text">in public/images/</span>
        </div>
      )}

      {/* Modern Translucent Bottom Info Overlay */}
      <div className="deck-card-caption">
        <span className="deck-card-cat">{card.category}</span>
        <h4 className="deck-card-title">{card.title}</h4>
        <p className="deck-card-desc">{card.desc}</p>
      </div>
    </div>
  );
}

export default function VisionCardDeck() {
  const [isThrown, setIsThrown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsThrown(true);
        }
      },
      {
        threshold: 0.25,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="vision-deck-stage" ref={containerRef}>
      {/* Decorative Stage Mat Glow */}
      <div className="deck-stage-glow" />

      {/* Three Full-Bleed Image Cards with Deck Throwing Transition */}
      <div className="vision-deck-cards-wrapper">
        {VISION_CARDS_DATA.map((card, idx) => (
          <CardItem
            key={card.id}
            card={card}
            index={idx}
            isThrown={isThrown}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </div>
    </div>
  );
}
