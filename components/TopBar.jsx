'use client';

import React from 'react';
import Link from 'next/link';

export default function TopBar() {
  return (
    <aside className="top-bar" aria-label="Quick contact and branch lines">
      <div className="container top-bar-content">
        <div className="top-bar-left">
          <div className="top-bar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <span>Central Dispatch: No. 157Y, Kebellaovita, Weniwelkola, Polgasovita</span>
          </div>
          <div className="top-bar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <Link href="/contact-us">info@pngexpress.lk</Link>
          </div>
        </div>
        <div className="top-bar-right">
          <div className="top-bar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <a href="tel:0767148292">076 714 8292 (24/7 Operations Desk)</a>
          </div>
          <div className="top-bar-item">
            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
              🚌 Independent Transport Portal
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
