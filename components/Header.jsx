'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on page navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Bus Timetables', href: '/bus-timetables' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About us', href: '/about-us' },
    { label: 'Contact us', href: '/contact-us' },
  ];

  const mobileNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Seat Booking', href: '/destinations#seat-booking' },
    { label: 'Book Entire Bus for Trip', href: '/destinations#bus-booking' },
    { label: 'Services', href: '/services' },
    { label: 'Bus Timetables', href: '/bus-timetables' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About us', href: '/about-us' },
    { label: 'Contact us', href: '/contact-us' },
  ];

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar">
          <Link href="/" className="logo-link">
            <BrandLogo />
          </Link>

          <nav className="nav-menu">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="nav-actions">
            <Link
              href="/seat-booking"
              className="btn btn-book-nav"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              BOOK TICKETS ONLINE
            </Link>
            <button
              className="mobile-menu-toggle"
              aria-label="Open Mobile Menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`mobile-drawer ${mobileOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div>
          <div className="mobile-drawer-header">
            <BrandLogo compact />
            <button
              className="mobile-drawer-close"
              onClick={() => setMobileOpen(false)}
            >
              &times;
            </button>
          </div>
          <nav className="mobile-nav-list">
            {mobileNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mobile-drawer-footer">
          <Link
            href="/seat-booking"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
            onClick={() => setMobileOpen(false)}
          >
            BOOK BUS TICKETS ONLINE
          </Link>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Hotline: <a href="tel:0767148292" style={{ fontWeight: 700, color: '#046bd2' }}>076 714 8292</a>
          </div>
        </div>
      </aside>
    </>
  );
}
