'use client';

import React from 'react';

export default function ImageSlot({
  title = 'Image Slot',
  subtitle = 'Placeholder Slot',
  aspectRatio = '16/9',
  category = 'Fleet Photo',
  dimensions = 'Auto',
  icon = 'bus',
  style = {},
  className = '',
}) {
  const getIcon = () => {
    switch (icon) {
      case 'route':
      case 'map':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
          </svg>
        );
      case 'interior':
      case 'seat':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M19 9h-4V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v13a4 4 0 0 0 4 4h7a4 4 0 0 0 4-4v-7a1 1 0 0 0-1-1z"/>
            <path d="M5 14h14"/>
          </svg>
        );
      case 'partner':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        );
      case 'dest':
      case 'landmark':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        );
      case 'bus':
      default:
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="15" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="17" cy="15" r="1.5" />
            <line x1="7" y1="19" x2="7" y2="21" />
            <line x1="17" y1="19" x2="17" y2="21" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`image-slot-container ${className}`}
      style={{
        aspectRatio: aspectRatio,
        ...style,
      }}
    >
      <div className="image-slot-inner">
        <div className="image-slot-badge">
          <span className="image-slot-pulse"></span>
          SLOT: {category}
        </div>
        <div className="image-slot-icon">{getIcon()}</div>
        <div className="image-slot-title">{title}</div>
        {subtitle && <div className="image-slot-sub">{subtitle}</div>}
        <div className="image-slot-meta">
          <span>Ratio: {aspectRatio}</span>
          {dimensions !== 'Auto' && <span> • {dimensions}</span>}
        </div>
      </div>
    </div>
  );
}
