import React from 'react';
import Link from 'next/link';
import SpecialHireForm from '@/components/SpecialHireForm';

export const metadata = {
  title: "Services | PNG Express Sri Lanka",
  description: "PNG Express services are designed to meet the diverse needs of daily commuters, offering a comprehensive and efficient network of bus routes.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Page Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0b1329, #1e293b)', color: '#ffffff', padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-subtitle" style={{ color: '#38bdf8' }}>Comprehensive Mobility Solutions</span>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>Our Premium Services</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
            Be comfortable while you travel with our reliable bus rental, scheduled long-distance transport, and corporate charter services across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">What We Offer</span>
            <h2 className="section-title">Designed for Everyday &amp; Long-Distance Travelers</h2>
            <p className="section-description">
              We offer a comprehensive range of mobility services to cater to the diverse transportation needs of our valued passengers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Service 1 */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#e0f2fe', color: '#046bd2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
                🚌
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#0f172a' }}>Public Transport Network</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem', flexGrow: 1 }}>
                Our public transport services are meticulously designed to meet the diverse needs of daily commuters, offering a comprehensive, efficient, and user-friendly network of bus routes. We are committed to providing a seamless experience with strong emphasis on punctuality, safety, and affordability connecting major residential, commercial, and industrial centers.
              </p>
              <Link href="/bus-timetables" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>View Timetables ➔</Link>
            </div>

            {/* Service 2 */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
                ⭐
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#0f172a' }}>Bus Special Hire &amp; Charter</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem', flexGrow: 1 }}>
                Our bus special hire services offer a variety of options to suit corporate events, group outings, pilgrimages, family tours, and weddings. We provide Semi-luxury, Luxury, and Super luxury coaches with seating capacities tailored to your group size, equipped with top-of-the-line amenities and experienced tour captains.
              </p>
              <a href="#special-hire-form" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Request A Quote ➔</a>
            </div>

            {/* Service 3 */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
                🧳
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#0f172a' }}>Luggage &amp; Parcel Logistics</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem', flexGrow: 1 }}>
                We offer specialized luggage services for passengers and express parcel transfer along our scheduled routes. With generous, clean, lockable undercarriage storage compartments, we assure safe, fast, and secure transit of your belongings between cities.
              </p>
              <Link href="/contact-us" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Inquire Rates ➔</Link>
            </div>

            {/* Service 4 */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fae8ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
                🏫
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#0f172a' }}>School Transport Solutions</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem', flexGrow: 1 }}>
                Dedicated, safe, and punctual school transport services backed by Lyceum Global Holdings standards. Equipped with onboard safety assistants, GPS tracking, and vetted drivers for complete peace of mind for parents and educators.
              </p>
              <Link href="/contact-us" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Learn More ➔</Link>
            </div>

            {/* Service 5 */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
                📱
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#0f172a' }}>In-House Online Bus Ticketing</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem', flexGrow: 1 }}>
                Our proprietary user-friendly platform allows passengers to reserve specific bus seats from mobile or desktop in seconds. Pay with debit card, credit card, or pay at boarding, with instant interactive seat selection and digital e-tickets.
              </p>
              <Link href="/#booking" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Reserve Seats Online ➔</Link>
            </div>

            {/* Service 6 */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
                🎧
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#0f172a' }}>24/7 Operations Support</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem', flexGrow: 1 }}>
                Dedicated branch operations teams and helpline dispatchers assisting passengers with ticket inquiries, schedule updates, route boarding locations, and emergency support across every destination.
              </p>
              <Link href="/contact-us" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Contact Dispatch ➔</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Amenities */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">State-of-the-art Fleet</span>
            <h2 className="section-title">Bus Equipment &amp; Features</h2>
            <p className="section-description">
              Our buses are equipped with state-of-the-art features to ensure a safe, peaceful, and comfortable traveling experience for all our passengers.
            </p>
          </div>

          <div className="amenities-grid">
            <div className="amenity-card">
              <div className="amenity-icon-wrap">❄️</div>
              <h3 className="amenity-title">Fully Air-Conditioned</h3>
              <p className="amenity-desc">Even cooling throughout all compartments with adjustable individual airflow nozzles.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">🧳</div>
              <h3 className="amenity-title">Significant Undercarriage Storage</h3>
              <p className="amenity-desc">High capacity underfloor compartments for secure luggage, cartons, and bulky items.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">📺</div>
              <h3 className="amenity-title">TV &amp; Audio System</h3>
              <p className="amenity-desc">Crystal clear audio and widescreen video entertainment systems for scenic journeys.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">📶</div>
              <h3 className="amenity-title">High Speed Internet Facility</h3>
              <p className="amenity-desc">Seamless Wi-Fi connectivity throughout the duration of expressway and highway trips.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">🧊</div>
              <h3 className="amenity-title">Cool Box</h3>
              <p className="amenity-desc">Dedicated cooling storage ensuring fresh refreshments and cold drinking water.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">⚡</div>
              <h3 className="amenity-title">Reclining Seats &amp; USB Points</h3>
              <p className="amenity-desc">Plush high-back seats with armrests, deep tilt, and individual USB mobile device chargers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Hire Quote Form */}
      <section id="special-hire-form" className="section">
        <div className="container">
          <SpecialHireForm />
        </div>
      </section>
    </>
  );
}
