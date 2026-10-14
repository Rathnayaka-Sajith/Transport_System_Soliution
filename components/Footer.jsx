import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-overlay-bg"></div>
      <div className="container footer-main">
        <div className="footer-grid">
          {/* About Col */}
          <div className="footer-about">
            <BrandLogo light />
            <p className="footer-desc" style={{ marginTop: '1rem' }}>
              PNG Express is your trusted partner in bus transportation services. With a commitment to comfort, safety, and reliability, we connect communities and provide convenient travel options for all your needs across Sri Lanka.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '6px', color: '#94a3b8' }}>
                ✓ GPS Monitored Fleet
              </span>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '6px', color: '#94a3b8' }}>
                ✓ 24/7 Operations
              </span>
            </div>
          </div>

          {/* PNG Related Divisions */}
          <div>
            <h4 className="footer-heading">PNG Group Divisions</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><Link href="/about-us">PNG Spares</Link></li>
              <li className="footer-link-item"><Link href="/about-us">PNG Holdings</Link></li>
              <li className="footer-link-item"><Link href="/about-us">PNG Build</Link></li>
              <li className="footer-link-item"><Link href="/about-us">PNG Fleet Management</Link></li>
              <li className="footer-link-item"><Link href="/about-us">PNG Automotive</Link></li>
              <li className="footer-link-item"><Link href="/about-us">PNG Speed</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Navigation</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><Link href="/">Home</Link></li>
              <li className="footer-link-item"><Link href="/about-us">About us</Link></li>
              <li className="footer-link-item"><Link href="/services">Services</Link></li>
              <li className="footer-link-item"><Link href="/contact-us">Contact us</Link></li>
              <li className="footer-link-item"><Link href="/bus-timetables">Bus Timetables</Link></li>
              <li className="footer-link-item"><Link href="/gallery">Gallery Slots</Link></li>
              <li className="footer-link-item"><Link href="/destinations">Destinations</Link></li>
            </ul>
          </div>

          {/* Contact & Hotlines */}
          <div>
            <h4 className="footer-heading">Contact &amp; Hotlines</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                <span>No. 157Y, Kebellaovita, Weniwelkola, Polgasovita</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <Link href="/contact-us">info@pngexpress.lk</Link>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span><a href="tel:0767148292">076 714 8292</a> | Deputy GM</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span><a href="tel:0742893612">074 289 3612</a> / <a href="tel:0743819631">074 381 9631</a> | Special Hires</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span><a href="tel:0771075555">077 1 075 555</a> | Colombo → Jaffna</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span><a href="tel:0761382300">076 1 382 300</a> | Makumbura ⇌ Badulla</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-bottom-content">
          <div>
            &copy; 2026 PNG Express Private Limited. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/about-us" style={{ color: '#64748b' }}>Privacy Policy</Link>
            <Link href="/about-us" style={{ color: '#64748b' }}>Terms &amp; Conditions</Link>
            <Link href="/#booking" style={{ color: '#38bdf8' }}>
              Online Bus Ticketing System
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
