'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HeroSlider() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className={`hero-video-section ${isHovered ? 'hero-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 100vh Full Screen MP4 Video Banner */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hero-video-bg"
      >
        <source src="/banner/banner.mp4" type="video/mp4" />
        <source src="/banner/banne.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Subtle Cinematic Vignette Overlay */}
      <div className="hero-video-overlay" />

      {/* Video Banner Interactive Stage with Two Redirection Buttons */}
      <div className={`container hero-video-booking-container ${isHovered ? 'stage-hovered' : ''}`}>
        {/* Dual Liquid Glass Redirection Buttons at the base */}
        <div className={`hero-liquid-btn-wrapper ${isHovered ? 'btn-revealed' : ''}`}>
          {/* Button 1: Redirect to Seat Booking Page */}
          <Link
            href="/seat-booking"
            className="hero-liquid-glass-btn"
            aria-label="Redirect to seat booking page"
          >
            <div className="btn-liquid-shimmer" />
            <div className="btn-bus-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <div className="btn-text-content">
              <span className="btn-primary-text">BOOK SEATS ONLINE</span>
              <span className="btn-sub-text">In-House Ticket Reservation</span>
            </div>
            <div className="btn-action-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </Link>

          {/* Button 2: Redirect to Bus Booking Page (Entire Bus for Trip) */}
          <Link
            href="/bus-booking"
            className="hero-liquid-glass-btn hero-charter-btn"
            aria-label="Redirect to entire bus trip booking page"
          >
            <div className="btn-liquid-shimmer" />
            <div className="btn-bus-icon-wrap btn-charter-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 18v2" />
                <path d="M18 18v2" />
                <circle cx="7" cy="18" r="1.5" />
                <circle cx="17" cy="18" r="1.5" />
                <path d="M2 11h20" />
                <path d="M7 6v5" />
                <path d="M12 6v5" />
              </svg>
            </div>
            <div className="btn-text-content">
              <span className="btn-primary-text">BOOK ENTIRE BUS FOR TRIP</span>
              <span className="btn-sub-text">Private Tours & Special Hire</span>
            </div>
            <div className="btn-action-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
