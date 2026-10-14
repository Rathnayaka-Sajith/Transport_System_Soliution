import React from 'react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import ImageSlot from '@/components/ImageSlot';

export const metadata = {
  title: "Contact us | PNG Express Bus Booking",
  description: "Get in touch with PNG Express for bus bookings, special hires, timetables, and passenger customer support across Sri Lanka.",
};

export default function ContactUsPage() {
  return (
    <>
      {/* Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0b1329, #1e293b)', color: '#ffffff', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-subtitle" style={{ color: '#38bdf8' }}>24/7 Passenger Assistance</span>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 3.8vw, 3.25rem)', marginBottom: '0.75rem' }}>Contact PNG Express</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
            We’re here to assist you! Reach out to our dedicated route supervisors, booking desks, or customer care team anytime.
          </p>
        </div>
      </section>

      {/* Direct Route Hotline Cards Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Direct Lines</span>
            <h2 className="section-title">Route &amp; Department Hotlines</h2>
            <p className="section-description">Click any number below for direct phone connection to that specific service station.</p>
          </div>

          <div className="contact-helplines-grid">
            <div className="helpline-card">
              <a href="tel:0771075555" className="helpline-number">077 107 5555</a>
              <span className="helpline-route">Colombo ➜ Jaffna Service</span>
              <span className="badge badge-super-luxury" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Route 87 Super Luxury</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0775551533" className="helpline-number">077 555 1533</a>
              <span className="helpline-route">Jaffna ➜ Colombo Service</span>
              <span className="badge badge-super-luxury" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Route 87 Super Luxury</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0777798600" className="helpline-number">077 779 8600</a>
              <span className="helpline-route">Panadura ⇌ Kandy (Super Luxury)</span>
              <span className="badge badge-super-luxury" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Luxury Service</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0765574444" className="helpline-number">076 5 574 444</a>
              <span className="helpline-route">Panadura ⇌ Kandy (Normal)</span>
              <span className="badge badge-normal" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Route 17 Daily</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0761382300" className="helpline-number">076 138 2300</a>
              <span className="helpline-route">Makumbura ⇌ Badulla / Colombo ⇌ Passara</span>
              <span className="badge badge-super-luxury" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>EX 01 &amp; Route 99</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0742893612" className="helpline-number">074 289 3612</a>
              <span className="helpline-route">Special Hires &amp; Charters (Desk 1)</span>
              <span className="badge badge-semi-luxury" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Events &amp; Tours</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0743819631" className="helpline-number">074 381 9631</a>
              <span className="helpline-route">Special Hires &amp; Charters (Desk 2)</span>
              <span className="badge badge-semi-luxury" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Corporate &amp; Schools</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0767148292" className="helpline-number">076 714 8292</a>
              <span className="helpline-route">Deputy General Manager</span>
              <span className="badge badge-normal" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Management Office</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0764042314" className="helpline-number">076 404 2314</a>
              <span className="helpline-route">Head of Operations</span>
              <span className="badge badge-normal" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Operations Desk</span>
            </div>

            <div className="helpline-card">
              <a href="tel:0112572572" className="helpline-number">011 257 2572</a>
              <span className="helpline-route">Head Office General Line</span>
              <span className="badge badge-normal" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Polgasovita HQ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Station Visualizer Section */}
      <section className="section section-subtle">
        <div className="container">
          <div className="contact-form-grid">
            {/* Form */}
            <ContactForm />

            {/* Headquarters Details & Location */}
            <div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '1rem' }}>Head Office Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#475569', fontSize: '0.95rem' }}>
                  <div>
                    <strong>Address:</strong><br />
                    No. 157Y, Kebellaovita, Weniwelkola, Polgasovita, Sri Lanka
                  </div>
                  <div>
                    <strong>General Hotline:</strong><br />
                    <a href="tel:0112572572" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#046bd2' }}>011 257 2572</a>
                  </div>
                  <div>
                    <strong>Email Address:</strong><br />
                    <span style={{ color: '#046bd2', fontWeight: 600 }}>info@pngexpress.lk</span>
                  </div>
                  <div>
                    <strong>Online Booking:</strong><br />
                    Available 24/7 via <Link href="/#booking" style={{ color: '#046bd2', fontWeight: 700 }}>In-House Reservation Desk</Link>
                  </div>
                </div>
              </div>

              {/* In-House Operations & Terminal Depot Map Slot */}
              <ImageSlot
                title="Central Operations & Depot Terminal Slot"
                subtitle="Polgasovita Fleet Operations Yard [6.8048° N, 79.9116° E]"
                aspectRatio="16/10"
                category="Terminal Location Slot"
                dimensions="800 x 500 px"
                icon="map"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
