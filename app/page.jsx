import React from 'react';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import BookingWidget from '@/components/BookingWidget';
import ImageSlot from '@/components/ImageSlot';
import VisionCardDeck from '@/components/VisionCardDeck';
import VisionMissionContent from '@/components/VisionMissionContent';

export const metadata = {
  title: "Sri Lanka's Best Public Transport | PNG Express",
  description: "PNG Express has emerged as a leading people mobility company in Sri Lanka, boasting a comprehensive fleet ranging from Super luxury to Normal.",
};

export default function HomePage() {
  return (
    <>
      {/* Full-Screen Video Banner with Integrated Liquid Glass Booking Widget */}
      <HeroSlider />

      {/* Vision and Mission Section */}
      <section className="section" style={{ overflow: 'hidden' }}>
        <div className="container">
          <div className="vision-mission-grid">
            <div className="vision-mission-img-wrap">
              <VisionCardDeck />
            </div>
            <VisionMissionContent />
          </div>
        </div>
      </section>

      {/* Company Profile Section */}
      <section className="section section-subtle">
        <div className="container">
          <div className="company-profile-grid">
            <div>
              <span className="section-subtitle">About Our Growth</span>
              <h2 className="section-title">Company Profile</h2>
              <p style={{ color: '#475569', fontSize: '1.05rem' }}>
                PNG Express Private Limited is one of the largest and most trusted transport providers in Sri Lanka. With a fleet strength of <strong>142* buses</strong>, categorized into Super luxury, Semi-luxury, and normal buses, we have been serving the transportation needs of our customers since our establishment.
              </p>

              <div className="profile-features-list">
                <div className="profile-feature-item">
                  <div className="feature-check-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div><strong>Secure payment options</strong> for your peace of mind through credit cards, debit cards, and in-house ticketing.</div>
                </div>
                <div className="profile-feature-item">
                  <div className="feature-check-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div><strong>Highly trained drivers</strong> with spotless safety records and continuous defensive driving training.</div>
                </div>
                <div className="profile-feature-item">
                  <div className="feature-check-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div><strong>Timely departures and arrivals</strong> strictly managed to ensure you reach your destination on schedule.</div>
                </div>
                <div className="profile-feature-item">
                  <div className="feature-check-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div><strong>Comprehensive route network</strong> connecting Colombo, Makumbura, Jaffna, Badulla, Passara, and Kandy.</div>
                </div>
                <div className="profile-feature-item">
                  <div className="feature-check-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div><strong>Passenger safety first</strong> with CCTV onboard, GPS real-time tracking, and emergency response protocols.</div>
                </div>
              </div>

              <Link href="/about-us" className="btn btn-primary">
                Read Full Company Profile ➔
              </Link>
            </div>

            <div className="profile-collage">
              <div className="collage-item collage-item-large">
                <ImageSlot
                  title="Jaffna Route Coach Slot"
                  subtitle="Northern Heritage Corridor [600x600]"
                  aspectRatio="1/1"
                  category="Fleet Showcase Slot"
                  dimensions="600 x 600 px"
                  icon="landmark"
                />
              </div>
              <div className="collage-item collage-item-small">
                <ImageSlot
                  title="Route 99 Coach Slot"
                  subtitle="Colombo - Passara [400x300]"
                  aspectRatio="4/3"
                  category="Route Slot"
                  dimensions="400 x 300 px"
                  icon="bus"
                />
              </div>
              <div className="collage-item collage-item-small">
                <ImageSlot
                  title="EX 01 Coach Slot"
                  subtitle="Badulla Expressway [400x300]"
                  aspectRatio="4/3"
                  category="Expressway Slot"
                  dimensions="400 x 300 px"
                  icon="bus"
                />
              </div>
              <div className="profile-stat-badge">
                <div className="stat-number">142+</div>
                <div className="stat-text">Active Fleet Strength</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Destinations Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', textAlign: 'left', maxWidth: '100%' }}>
            <div>
              <span className="section-subtitle">Popular Routes</span>
              <h2 className="section-title">Our Destinations</h2>
              <p className="section-description">Scheduled daily long-distance services connecting major cities with premier comfort.</p>
            </div>
            <Link href="/destinations" className="btn btn-outline">
              All Destinations ➤
            </Link>
          </div>

          <div className="destinations-grid">
            {/* Route 1: Passara */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Colombo ⇌ Passara"
                  subtitle="Route 99 Super Luxury Coach Slot"
                  aspectRatio="16/10"
                  category="Route Slot"
                  dimensions="600 x 375 px"
                  icon="bus"
                />
                <div className="route-badge-overlay">
                  <span className="badge badge-super-luxury">Super Luxury</span>
                </div>
                <div className="route-destination-tag">Route 99</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Colombo ⇌ Passara</h3>
                <div className="route-stops-path">
                  <span>Colombo</span> ➔ <span>Homagama</span> ➔ <span>Bandarawela</span> ➔ <span>Badulla</span> ➔ <span>Passara</span>
                </div>
                <div className="route-card-meta">
                  <div className="meta-item">
                    <span className="meta-item-label">Departure</span>
                    <span className="meta-item-value">12:45 AM / 12:30 AM</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-item-label">Frequency</span>
                    <span className="meta-item-value">Daily Scheduled</span>
                  </div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-99" className="btn btn-outline btn-sm">More Details</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">RESERVE SEAT</Link>
                </div>
              </div>
            </article>

            {/* Route 2: Kankesanthurai */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Panadura ⇌ Kankesanthurai"
                  subtitle="Route 15 Super Luxury Coach Slot"
                  aspectRatio="16/10"
                  category="Route Slot"
                  dimensions="600 x 375 px"
                  icon="bus"
                />
                <div className="route-badge-overlay">
                  <span className="badge badge-super-luxury">Super Luxury</span>
                </div>
                <div className="route-destination-tag">Route 15</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Panadura ⇌ Kankesanthurai</h3>
                <div className="route-stops-path">
                  <span>Panadura</span> ➔ <span>Pettah</span> ➔ <span>Kurunegala</span> ➔ <span>Jaffna</span> ➔ <span>KKS</span>
                </div>
                <div className="route-card-meta">
                  <div className="meta-item">
                    <span className="meta-item-label">Departure</span>
                    <span className="meta-item-value">08:30 PM (via Dambulla)</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-item-label">Frequency</span>
                    <span className="meta-item-value">Daily Scheduled</span>
                  </div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-15" className="btn btn-outline btn-sm">More Details</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">RESERVE SEAT</Link>
                </div>
              </div>
            </article>

            {/* Route 3: Jaffna */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Moratuwa ⇌ Jaffna / Point Pedro"
                  subtitle="Route 87 Super Luxury Express Slot"
                  aspectRatio="16/10"
                  category="Route Slot"
                  dimensions="600 x 375 px"
                  icon="bus"
                />
                <div className="route-badge-overlay">
                  <span className="badge badge-super-luxury">Super Luxury</span>
                </div>
                <div className="route-destination-tag">Route 87</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Moratuwa ⇌ Jaffna / Point Pedro</h3>
                <div className="route-stops-path">
                  <span>Soysapura</span> ➔ <span>Wellawatta</span> ➔ <span>Pettah</span> ➔ <span>Jaffna</span> ➔ <span>Point Pedro</span>
                </div>
                <div className="route-card-meta">
                  <div className="meta-item">
                    <span className="meta-item-label">Departure</span>
                    <span className="meta-item-value">07:30 PM &amp; 08:30 PM</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-item-label">Services</span>
                    <span className="meta-item-value">via Palaly &amp; Kopay</span>
                  </div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-87" className="btn btn-outline btn-sm">More Details</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">RESERVE SEAT</Link>
                </div>
              </div>
            </article>

            {/* Route 4: Kandy */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Panadura ⇌ Kandy"
                  subtitle="Route 17 Daily Service Slot"
                  aspectRatio="16/10"
                  category="Route Slot"
                  dimensions="600 x 375 px"
                  icon="bus"
                />
                <div className="route-badge-overlay">
                  <span className="badge badge-normal">Normal Service</span>
                </div>
                <div className="route-destination-tag">Route 17</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Panadura ⇌ Kandy</h3>
                <div className="route-stops-path">
                  <span>Panadura</span> ➔ <span>Moratuwa</span> ➔ <span>Colombo</span> ➔ <span>Kadawatha</span> ➔ <span>Kandy</span>
                </div>
                <div className="route-card-meta">
                  <div className="meta-item">
                    <span className="meta-item-label">Departures</span>
                    <span className="meta-item-value">12+ Trips Daily</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-item-label">Starts At</span>
                    <span className="meta-item-value">03:30 AM Daily</span>
                  </div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-17" className="btn btn-outline btn-sm">More Details</Link>
                  <Link href="/contact-us" className="btn btn-primary btn-sm">Contact Hotline</Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Group Ecosystem Grid */}
      <section className="partners-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', fontWeight: 700 }}>
              Transport Ecosystem &amp; Group Affiliations
            </span>
          </div>
          <div className="partners-grid">
            <div className="partner-logo-item">
              <ImageSlot title="PNG Ticketing Desk" subtitle="Direct In-House Booking" aspectRatio="3/1" category="System Slot" icon="partner" />
            </div>
            <div className="partner-logo-item">
              <ImageSlot title="PNG Holdings" subtitle="Corporate Governance" aspectRatio="3/1" category="Division Slot" icon="partner" />
            </div>
            <div className="partner-logo-item">
              <ImageSlot title="Lyceum Global Holdings" subtitle="Education Mobility" aspectRatio="3/1" category="Division Slot" icon="partner" />
            </div>
            <div className="partner-logo-item">
              <ImageSlot title="PNG Automotive" subtitle="Coach Engineering" aspectRatio="3/1" category="Division Slot" icon="partner" />
            </div>
            <div className="partner-logo-item">
              <ImageSlot title="PNG Fleet Management" subtitle="IoT Telematics" aspectRatio="3/1" category="Division Slot" icon="partner" />
            </div>
            <div className="partner-logo-item">
              <ImageSlot title="PNG Spares" subtitle="Commercial Parts" aspectRatio="3/1" category="Division Slot" icon="partner" />
            </div>
            <div className="partner-logo-item">
              <ImageSlot title="PNG Maxload" subtitle="Cargo Logistics" aspectRatio="3/1" category="Division Slot" icon="partner" />
            </div>
          </div>
        </div>
      </section>

      {/* Commitment to Safety and Comfort Section */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Comfort &amp; Reliability</span>
            <h2 className="section-title">Commitment to Safety and Comfort</h2>
            <p className="section-description">
              At PNG Express Pvt Ltd, safety and comfort are our top priorities. We take stringent measures to ensure the safety of our passengers, including regular maintenance and inspections of our buses, adherence to traffic rules and regulations, and continuous training of our drivers.
            </p>
          </div>

          <div className="amenities-grid">
            <div className="amenity-card">
              <div className="amenity-icon-wrap">❄️</div>
              <h3 className="amenity-title">Fully Air-Conditioned</h3>
              <p className="amenity-desc">Individual climate vents to keep you cool and refreshed throughout your long-distance trip.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">🧳</div>
              <h3 className="amenity-title">Undercarriage Storage</h3>
              <p className="amenity-desc">Generous, clean, secure luggage holds for large suitcases, parcels, and heavy travel bags.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">📺</div>
              <h3 className="amenity-title">TV &amp; Entertainment</h3>
              <p className="amenity-desc">High-definition LED screens with curated movies and music for an engaging travel experience.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">📶</div>
              <h3 className="amenity-title">High Speed Internet</h3>
              <p className="amenity-desc">Complimentary Wi-Fi facility onboard to keep you connected with family, friends, and work.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">🧊</div>
              <h3 className="amenity-title">Cool Box Facility</h3>
              <p className="amenity-desc">Onboard chilling compartment keeping drinking water and refreshments cool throughout your route.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">⚡</div>
              <h3 className="amenity-title">Reclining Seats &amp; USB</h3>
              <p className="amenity-desc">Ergonomic deep recline seats with personal USB phone charging points at every passenger seat.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">📹</div>
              <h3 className="amenity-title">CCTV Surveillance</h3>
              <p className="amenity-desc">24/7 security camera recording ensuring maximum safety for women, children, and elderly travelers.</p>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon-wrap">👨‍✈️</div>
              <h3 className="amenity-title">Professional Drivers</h3>
              <p className="amenity-desc">Licensed, highly skilled transport captains with stellar road safety and punctuality records.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/services" className="btn btn-primary btn-lg">
              Discover All Services &amp; Special Hires ➔
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Steps To Booking Our Bus */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">How It Works</span>
            <h2 className="section-title">4 Steps To Booking Our Bus</h2>
            <p className="section-description">
              It’s never been easier to book your journey online! Experience seamless travel with our direct reservation platform.
            </p>
          </div>

          <div className="booking-steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <h3 className="step-title">Search Your Transit</h3>
              <p className="step-desc">Choose your pickup, destination, and journey date to see all available luxury schedules in real time.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
              </div>
              <h3 className="step-title">Reserve Your Seat</h3>
              <p className="step-desc">Select your exact preferred seat from our visual layout from the comfort of your home or mobile.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
              <h3 className="step-title">Complete The Payment</h3>
              <p className="step-desc">Pay for your tickets using Visa, Mastercard, or select pay at boarding, and receive an instant e-ticket confirmation.</p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
              <h3 className="step-title">Embark on Your Journey</h3>
              <p className="step-desc">Show your confirmed reference code or printed ticket at boarding and enjoy a smooth, luxury ride.</p>
            </div>
          </div>

          {/* In-House Ticketing Callout */}
          <div style={{ marginTop: '3.5rem', background: 'linear-gradient(135deg, #0b1329, #1e293b)', borderRadius: '16px', padding: '2.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '600px' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>In-House Ticketing Engine</span>
              <h3 style={{ color: '#ffffff', fontSize: '1.8rem', margin: '0.5rem 0' }}>Book Smart, Travel Smart with PNG Express</h3>
              <p style={{ color: '#cbd5e1', marginBottom: 0 }}>Instant seat reservation, interactive coach floor plans, guaranteed bookings, and 24/7 passenger assistance.</p>
            </div>
            <Link href="/#booking" className="btn btn-accent btn-lg">
              Reserve Your Seats Now ➔
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Highlights Showcase (Blog) */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', textAlign: 'left', maxWidth: '100%' }}>
            <div>
              <span className="section-subtitle">News &amp; Updates</span>
              <h2 className="section-title">Recent Highlights Showcase</h2>
              <p className="section-description">Stay updated with our latest fleet expansions, passenger safety milestones, and community news.</p>
            </div>
            <Link href="/about-us" className="btn btn-outline">
              Explore Our History ➤
            </Link>
          </div>

          <div className="blog-grid">
            <article className="blog-card">
              <div className="blog-img-wrap">
                <ImageSlot
                  title="Makumbura to Ella & Badulla Route Update"
                  subtitle="Highway Corridor Slot [600x400]"
                  aspectRatio="16/10"
                  category="Update Slot"
                  dimensions="600 x 375 px"
                  icon="bus"
                />
                <div className="blog-date-badge">29 May 2024</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-title">
                  <Link href="/bus-timetables">In our buses traveling from Makumbura to Ella/Badulla and Colombo to Passara</Link>
                </h3>
                <p className="blog-excerpt">
                  In our buses traveling from Makumbura to Ella/Badulla and Colombo to Passara, all seats available for long distance routes are now open for instant online booking...
                </p>
                <Link href="/#booking" className="blog-link">Book Route Seats ➔</Link>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-img-wrap">
                <ImageSlot
                  title="Direct Passenger Ticketing System Launch"
                  subtitle="Self-Service Portal Slot [600x400]"
                  aspectRatio="16/10"
                  category="Launch Slot"
                  dimensions="600 x 375 px"
                  icon="route"
                />
                <div className="blog-date-badge">29 May 2024</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-title">
                  <Link href="/#booking">Prepare yourselves for smart travel! Self-service ticketing launch</Link>
                </h3>
                <p className="blog-excerpt">
                  Dear Passengers from all corners of Sri Lanka! We proudly announce our new integrated passenger self-service ticketing system with visual seat layouts...
                </p>
                <Link href="/#booking" className="blog-link">Select Seats ➔</Link>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-img-wrap">
                <ImageSlot
                  title="Passenger Safety Training & Protocols"
                  subtitle="Staff Certification Slot [600x400]"
                  aspectRatio="16/10"
                  category="Safety Slot"
                  dimensions="600 x 375 px"
                  icon="landmark"
                />
                <div className="blog-date-badge">29 May 2024</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-title">
                  <Link href="/contact-us">Tackling safety and passenger comfort in public transport services</Link>
                </h3>
                <p className="blog-excerpt">
                  As a dedicated step taken towards protecting children and women in public transport services, PNG Express has conducted certified staff training with strict hotline protocols...
                </p>
                <Link href="/contact-us" className="blog-link">Safety Guidelines ➔</Link>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-img-wrap">
                <ImageSlot
                  title="Caring About Safety of Every Traveler"
                  subtitle="Defensive Highway Navigation Slot [600x400]"
                  aspectRatio="16/10"
                  category="Training Slot"
                  dimensions="600 x 375 px"
                  icon="bus"
                />
                <div className="blog-date-badge">29 May 2024</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-title">
                  <Link href="/about-us">We who always care about the safety of passengers!</Link>
                </h3>
                <p className="blog-excerpt">
                  Our driver gentlemen and conductors were trained on how to operate in emergency situations, fire drills, first-aid response, and defensive highway night navigation...
                </p>
                <Link href="/about-us" className="blog-link">Read More ➔</Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
