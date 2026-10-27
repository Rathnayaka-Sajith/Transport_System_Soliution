'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function VisionMissionContent() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger only on first scroll into view
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect(); // Never triggers again after the first scroll
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`vm-slide-container ${hasAnimated ? 'vm-slide-in' : 'vm-slide-start'}`}
    >
      <div className="vm-slide-item vm-slide-header">
        <span className="section-subtitle">Welcome to PNG EXPRESS</span>
        <h2 className="section-title">Our Vision and Mission</h2>
        <p className="section-description" style={{ marginBottom: '2rem' }}>
          Driving towards excellence with a profound commitment to comfort, passenger safety, and punctuality across Sri Lanka.
        </p>
      </div>

      <div className="vm-slide-item vision-card">
        <div className="card-label">Our Vision</div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>
          Connecting People, Transforming Journeys.
        </h3>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
          To be Sri Lanka's leading, most trusted mobility network, revolutionizing inter-city and regional public transit with sustainable, modern coaches.
        </p>
      </div>

      <div className="vm-slide-item mission-card">
        <div className="card-label">Our Mission</div>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
          At PNG Express, our mission is to provide exceptional passenger service, focusing on luxury long-distance travel, safe school bus services, and versatile vehicle rentals, all with a commitment to enhancing lives and fostering thriving communities. We are dedicated to revolutionising the transportation experience for our passengers, emphasising safety, comfort, and sustainability.
        </p>
      </div>
    </div>
  );
}
