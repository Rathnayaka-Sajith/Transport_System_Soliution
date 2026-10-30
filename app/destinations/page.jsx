import React from 'react';
import DestinationsBanner from '@/components/DestinationsBanner';
import SeatSearchSection from '@/components/SeatSearchSection';
import DestinationsList from '@/components/DestinationsList';
import HolidayDestinations from '@/components/HolidayDestinations';
import CharterBookingEngine from '@/components/CharterBookingEngine';
import Link from 'next/link';

export const metadata = {
  title: "Destinations & Trip Planning Hub | PNG Express Sri Lanka",
  description: "Official PNG Express travel hub: reserve bus seats online, explore top scheduled express routes across Sri Lanka, plan holidays, and charter entire buses for private group tours.",
};

export default function DestinationsPage() {
  return (
    <>
      {/* 1. Large Hero Banner with Quick Jump Navigator */}
      <DestinationsBanner />

      {/* 2. Seat Booking Section (/seat-booking integrated) */}
      <section id="seat-booking" className="section" style={{ background: '#f8fafc', padding: '4.5rem 0', scrollMarginTop: '80px' }}>
        <div className="container" style={{ maxWidth: '1140px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-subtitle" style={{ color: '#046bd2' }}>Official In-House Reservation System</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '0.75rem' }}>
              Book Bus Seats Online
            </h2>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <SeatSearchSection />
          </div>

          {/* Guarantees & Features Row (Centered with Hover Animations) */}
          <div className="dest-features-grid">
            <div className="dest-feature-card">
              <div className="dest-feature-icon-wrap dest-feature-icon-blue">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18v3h2v-3h12v3h2v-3a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1V5a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v4H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2zm3-13a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4H7V5zm-3 7h16v4H4v-4z"/>
                </svg>
              </div>
              <h3 className="dest-feature-title">Interactive Seat Selection</h3>
              <p className="dest-feature-desc">
                View real-time seating layouts with available window and aisle seats clearly marked. Pick your exact seat for maximum comfort.
              </p>
            </div>

            <div className="dest-feature-card">
              <div className="dest-feature-icon-wrap dest-feature-icon-green">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h7v8l10-12h-7l1-8z" />
                </svg>
              </div>
              <h3 className="dest-feature-title">Instant Digital E-Ticket</h3>
              <p className="dest-feature-desc">
                Your unique ticket reference number is generated instantly upon reservation. Print it out or simply show it from your smartphone upon boarding.
              </p>
            </div>

            <div className="dest-feature-card">
              <div className="dest-feature-icon-wrap dest-feature-icon-amber">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                </svg>
              </div>
              <h3 className="dest-feature-title">Guaranteed Boarding</h3>
              <p className="dest-feature-desc">
                Directly synchronized with our fleet dispatch terminal at Bastian Mawatha Pettah and Makumbura MMC for 100% seat confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Most Popular Routes (Existing 8 Full-Fill Dual-Hover Destination Cards) */}
      <section id="popular-routes" className="section" style={{ padding: '4.5rem 0', scrollMarginTop: '80px' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '0.75rem' }}>
              Most Popular Routes
            </h2>
          </div>

          <DestinationsList />
        </div>
      </section>

      {/* 4. Plan Your Holiday (Sri Lanka Popular Destinations for Trips) */}
      <section id="plan-holiday" className="section" style={{ background: '#f1f5f9', padding: '5.5rem 0', scrollMarginTop: '80px' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-subtitle" style={{ color: '#046bd2' }}>Explore Paradise Island Sri Lanka</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '0.75rem' }}>
              Plan Your Holiday &amp; Excursions
            </h2>
            <p className="section-description" style={{ maxWidth: '860px', margin: '0 auto', fontSize: '1.05rem', color: '#64748b' }}>
              From misty highland tea trails and roaring waterfalls to sacred UNESCO kingdoms and sun-drenched coastal beaches, discover Sri Lanka’s top holiday destinations. Travel via daily express routes or reserve an entire bus for your private group holiday.
            </p>
          </div>

          <HolidayDestinations />
        </div>
      </section>

      {/* 5. Bus Charter Booking Section (/bus-booking integrated) */}
      <section id="bus-booking" className="section" style={{ background: '#ffffff', padding: '5.5rem 0', scrollMarginTop: '80px', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '1160px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-subtitle" style={{ color: '#059669' }}>PNG Express Special Hires &amp; Charters</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '0.75rem' }}>
              Book an Entire Bus for Your Trip
            </h2>
            <p className="section-description" style={{ maxWidth: '840px', margin: '0 auto', fontSize: '1.05rem', color: '#64748b' }}>
              Exclusive private bus rentals for corporate getaways, family tours, school trips, pilgrimages, and weddings across Sri Lanka. Pick your route, dates, and coach category for an instant package quote.
            </p>
          </div>

          <CharterBookingEngine />

          {/* Fleet Charter Information & Guarantees */}
          <div style={{ marginTop: '4rem', textAlign: 'center' }}>
            <span className="section-subtitle" style={{ color: '#046bd2' }}>Why Choose PNG Express Charters</span>
            <h3 style={{ fontSize: '1.85rem', color: '#0f172a', marginBottom: '2.5rem' }}>
              The Safest &amp; Most Reliable Tour Transport in Sri Lanka
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', textAlign: 'left' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>🛡️</div>
                <h4 style={{ color: '#0f172a', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Certified Tour Captains</h4>
                <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                  Experienced, defensive-driving certified captains trained specifically for expressway speed limits, hill-country hairpin bends, and night routes.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>📡</div>
                <h4 style={{ color: '#0f172a', fontSize: '1.15rem', marginBottom: '0.5rem' }}>24/7 Live GPS Telematics</h4>
                <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                  Every coach in our 142+ bus fleet is tracked live from our central operations center in Colombo with continuous speed and safety monitoring.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>❄️</div>
                <h4 style={{ color: '#0f172a', fontSize: '1.15rem', marginBottom: '0.5rem' }}>First-Class Passenger Comfort</h4>
                <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                  High-capacity dual climate cooling, deep recline plush seating, individual USB ports, and massive underfloor luggage compartments.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>⚡</div>
                <h4 style={{ color: '#0f172a', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Instant Quotations &amp; Fast Booking</h4>
                <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                  Transparent distance-based fare calculations with zero hidden fees. Instant confirmation vouchers and flexible payment options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
