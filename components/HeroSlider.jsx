'use client';

import React, { useState, useRef } from 'react';
import BookingWidget from '@/components/BookingWidget';

export default function HeroSlider() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const closingTimerRef = useRef(null);

  const handleOpen = () => {
    if (closingTimerRef.current) clearTimeout(closingTimerRef.current);
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    closingTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 180);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  // When unhovering banner video: hide transparent tab and hide all things!
  const handleSectionMouseLeave = (e) => {
    if (e?.currentTarget && e?.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsHovered(false);
    if (isOpen && !isClosing) {
      handleClose();
    }
  };

  const handleSectionMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <section
      className={`hero-video-section ${isHovered ? 'hero-hovered' : ''}`}
      onMouseEnter={handleSectionMouseEnter}
      onMouseLeave={handleSectionMouseLeave}
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

      {/* Video Banner Interactive Stage */}
      <div className={`container hero-video-booking-container ${isHovered ? 'stage-hovered' : ''}`}>
        {/* Transparent Booking Tab (Launches UPSIDE from button with Genie Effect) */}
        {(isOpen || isClosing) && (
          <div className={`genie-window-wrapper ${isClosing ? 'genie-minimizing' : 'genie-expanding'}`}>
            <BookingWidget onClose={handleClose} />
          </div>
        )}

        {/* Liquid Glass Launch Button at the base */}
        <div className={`hero-liquid-btn-wrapper ${isHovered ? 'btn-revealed' : ''}`}>
          <button
            type="button"
            onClick={handleToggle}
            className={`hero-liquid-glass-btn ${isOpen ? 'btn-dock-active' : ''}`}
            aria-label={isOpen ? 'Minimize booking tab' : 'Open bus ticket reservation system'}
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
              <span className="btn-primary-text">{isOpen ? 'MINIMIZE BOOKING TAB' : 'BOOK SEATS ONLINE'}</span>
              <span className="btn-sub-text">{isOpen ? 'Click to minimize to video' : 'In-House Ticket Reservation'}</span>
            </div>
            <div className="btn-action-badge">
              {isOpen ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
