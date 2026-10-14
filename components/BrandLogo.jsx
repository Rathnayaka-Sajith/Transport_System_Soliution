'use client';

import React, { useState } from 'react';

const CANDIDATE_SOURCES = ['/logo.png', '/images/logo.png', '/logo.PNG', '/images/logo.PNG'];

export default function BrandLogo({ light = false, compact = false, src }) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const sources = src ? [src, ...CANDIDATE_SOURCES] : CANDIDATE_SOURCES;
  const currentSrc = sources[candidateIndex];
  const textColor = light ? '#ffffff' : '#0b1329';
  const subColor = light ? '#94a3b8' : '#046bd2';

  const handleError = () => {
    if (candidateIndex < sources.length - 1) {
      setCandidateIndex(candidateIndex + 1);
    } else {
      setCandidateIndex(sources.length); // triggers SVG fallback
    }
  };

  // If a custom PNG logo exists at any candidate location, render it prominently alongside typography
  if (candidateIndex < sources.length) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: compact ? '0.65rem' : '0.9rem', textDecoration: 'none' }}>
        {/* Large prominent bus logo graphic */}
        <div
          style={{
            height: compact ? '48px' : '65px',
            width: compact ? '56px' : '78px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img
            src={currentSrc}
            alt="PNG Express"
            style={{
              height: compact ? '60px' : '84px',
              width: 'auto',
              maxWidth: 'none',
              objectFit: 'contain',
              display: 'block',
              transform: 'scale(1.32)',
              filter: light ? 'brightness(0) invert(1)' : 'none',
              transition: 'transform 0.25s ease',
            }}
            onError={handleError}
          />
        </div>

        {/* Brand Typography */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: compact ? '1.25rem' : '1.6rem', fontWeight: 900, color: textColor, letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
              PNG
            </span>
            <span style={{ fontSize: compact ? '1.25rem' : '1.6rem', fontWeight: 800, color: '#046bd2', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
              EXPRESS
            </span>
          </div>
          <span style={{ fontSize: compact ? '0.65rem' : '0.76rem', fontWeight: 700, color: subColor, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Transport System
          </span>
        </div>
      </div>
    );
  }

  // Fallback to styled SVG Emblem + Typography if no PNG logo file is found
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
      {/* SVG Icon Emblem */}
      <div
        style={{
          width: compact ? '40px' : '48px',
          height: compact ? '40px' : '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #046bd2 0%, #03468a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 10px rgba(4, 107, 210, 0.3)',
          flexShrink: 0,
        }}
      >
        <svg width={compact ? "22" : "26"} height={compact ? "22" : "26"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <path d="M9 17h6"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      </div>

      {/* Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ fontSize: compact ? '1.25rem' : '1.5rem', fontWeight: 900, color: textColor, letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            PNG
          </span>
          <span style={{ fontSize: compact ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#046bd2', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            EXPRESS
          </span>
        </div>
        <span style={{ fontSize: compact ? '0.64rem' : '0.74rem', fontWeight: 700, color: subColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Transport System
        </span>
      </div>
    </div>
  );
}
