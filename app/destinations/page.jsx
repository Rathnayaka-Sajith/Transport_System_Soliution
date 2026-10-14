import React from 'react';
import Link from 'next/link';
import ImageSlot from '@/components/ImageSlot';

export const metadata = {
  title: "Destinations | PNG Express Sri Lanka",
  description: "Discover all destinations served by PNG Express across Sri Lanka including Jaffna, Point Pedro, Badulla, Passara, Kandy, and Kankesanthurai.",
};

export default function DestinationsPage() {
  return (
    <>
      {/* Page Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0b1329, #1e293b)', color: '#ffffff', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-subtitle" style={{ color: '#38bdf8' }}>Islandwide Connectivity</span>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 3.8vw, 3.25rem)', marginBottom: '0.75rem' }}>Our Destinations</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '800px', margin: '0 auto' }}>
            Connecting major cities, cultural landmarks, economic hubs, and regional capitals across Sri Lanka with luxury and super-luxury coaches.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section">
        <div className="container">
          <div className="destinations-grid">
            {/* Jaffna */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Jaffna Peninsula Destination Slot"
                  subtitle="Northern Cultural Landmark [600x380]"
                  aspectRatio="16/10"
                  category="Destination Slot"
                  dimensions="600 x 380 px"
                  icon="landmark"
                />
                <div className="route-badge-overlay"><span className="badge badge-super-luxury">Super Luxury</span></div>
                <div className="route-destination-tag">Jaffna</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Colombo / Moratuwa ⇌ Jaffna</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  Daily super luxury overnight express linking Western Province and the northern capital with reclining seats, USB ports, and air conditioning.
                </p>
                <div className="route-card-meta">
                  <div className="meta-item"><span className="meta-item-label">Route</span><span className="meta-item-value">Route 87</span></div>
                  <div className="meta-item"><span className="meta-item-label">Departure</span><span className="meta-item-value">07:30 PM &amp; 08:30 PM</span></div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-87" className="btn btn-outline btn-sm">Timetable</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">Book Online</Link>
                </div>
              </div>
            </article>

            {/* Point Pedro */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Point Pedro Northern Tip Slot"
                  subtitle="Palaly & Kopay Express Corridor [600x380]"
                  aspectRatio="16/10"
                  category="Destination Slot"
                  dimensions="600 x 380 px"
                  icon="landmark"
                />
                <div className="route-badge-overlay"><span className="badge badge-super-luxury">Super Luxury</span></div>
                <div className="route-destination-tag">Point Pedro</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Moratuwa ⇌ Point Pedro</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  Direct routes via Palaly and via Kopay reaching the northernmost tip of the island smoothly and safely.
                </p>
                <div className="route-card-meta">
                  <div className="meta-item"><span className="meta-item-label">Route</span><span className="meta-item-value">Route 87</span></div>
                  <div className="meta-item"><span className="meta-item-label">Departures</span><span className="meta-item-value">08:00 PM &amp; 09:00 PM</span></div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-87" className="btn btn-outline btn-sm">Timetable</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">Book Online</Link>
                </div>
              </div>
            </article>

            {/* Kankesanthurai */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Kankesanthurai Coastal Slot"
                  subtitle="Keerimalai Springs Route 15 [600x380]"
                  aspectRatio="16/10"
                  category="Destination Slot"
                  dimensions="600 x 380 px"
                  icon="landmark"
                />
                <div className="route-badge-overlay"><span className="badge badge-super-luxury">Super Luxury</span></div>
                <div className="route-destination-tag">Kankesanthurai</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Panadura ⇌ Kankesanthurai</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  Scheduled service via Kurunegala and Dambulla, carrying commuters to Kankesanthurai and Keerimalai springs.
                </p>
                <div className="route-card-meta">
                  <div className="meta-item"><span className="meta-item-label">Route</span><span className="meta-item-value">Route 15</span></div>
                  <div className="meta-item"><span className="meta-item-label">Departure</span><span className="meta-item-value">08:30 PM Daily</span></div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-15" className="btn btn-outline btn-sm">Timetable</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">Book Online</Link>
                </div>
              </div>
            </article>

            {/* Badulla & Ella */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Badulla & Ella Tourism Corridor Slot"
                  subtitle="Ravana Ella & Highway Gateway [600x380]"
                  aspectRatio="16/10"
                  category="Destination Slot"
                  dimensions="600 x 380 px"
                  icon="dest"
                />
                <div className="route-badge-overlay"><span className="badge badge-super-luxury">Super Luxury</span></div>
                <div className="route-destination-tag">Badulla &amp; Ella</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Makumbura MMC ⇌ Badulla</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  Southern Expressway route via Mattala, Wellawaya, and Ravana Ella tourism corridor to Badulla city center.
                </p>
                <div className="route-card-meta">
                  <div className="meta-item"><span className="meta-item-label">Route</span><span className="meta-item-value">EX 01 74/31-2</span></div>
                  <div className="meta-item"><span className="meta-item-label">Departures</span><span className="meta-item-value">10:30 AM &amp; 05:30 PM</span></div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-ex01" className="btn btn-outline btn-sm">Timetable</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">Book Online</Link>
                </div>
              </div>
            </article>

            {/* Passara */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Passara Hill Country Terminal Slot"
                  subtitle="Founding Route 99 Station [600x380]"
                  aspectRatio="16/10"
                  category="Destination Slot"
                  dimensions="600 x 380 px"
                  icon="dest"
                />
                <div className="route-badge-overlay"><span className="badge badge-super-luxury">Super Luxury</span></div>
                <div className="route-destination-tag">Passara</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Colombo ⇌ Passara</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  The founding route of PNG Express connecting Colombo, Homagama, Bandarawela, Badulla, and Passara.
                </p>
                <div className="route-card-meta">
                  <div className="meta-item"><span className="meta-item-label">Route</span><span className="meta-item-value">Route 99</span></div>
                  <div className="meta-item"><span className="meta-item-label">Departure</span><span className="meta-item-value">12:45 AM Daily</span></div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-99" className="btn btn-outline btn-sm">Timetable</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">Book Online</Link>
                </div>
              </div>
            </article>

            {/* Kandy */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Kandy Cultural Capital Slot"
                  subtitle="High Frequency Route 17 Transit [600x380]"
                  aspectRatio="16/10"
                  category="Destination Slot"
                  dimensions="600 x 380 px"
                  icon="landmark"
                />
                <div className="route-badge-overlay"><span className="badge badge-normal">Normal Service</span></div>
                <div className="route-destination-tag">Kandy</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Panadura ⇌ Kandy</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  High frequency daily scheduled transit service connecting Western Province and the hill capital with 12+ daily round-trips.
                </p>
                <div className="route-card-meta">
                  <div className="meta-item"><span className="meta-item-label">Route</span><span className="meta-item-value">Route 17</span></div>
                  <div className="meta-item"><span className="meta-item-label">Departures</span><span className="meta-item-value">Every 30-45 mins</span></div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-17" className="btn btn-outline btn-sm">Timetable</Link>
                  <Link href="/contact-us" className="btn btn-primary btn-sm">Contact Hotline</Link>
                </div>
              </div>
            </article>

            {/* Karainagar */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Karainagar Island Route Slot"
                  subtitle="Casuarina Beach Causeway Link [600x380]"
                  aspectRatio="16/10"
                  category="Destination Slot"
                  dimensions="600 x 380 px"
                  icon="dest"
                />
                <div className="route-badge-overlay"><span className="badge badge-super-luxury">Super Luxury</span></div>
                <div className="route-destination-tag">Karainagar</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Moratuwa ⇌ Karainagar</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  Direct connection from Moratuwa and Colombo to the island of Karainagar via Casuarina beach causeway.
                </p>
                <div className="route-card-meta">
                  <div className="meta-item"><span className="meta-item-label">Route</span><span className="meta-item-value">Route 87</span></div>
                  <div className="meta-item"><span className="meta-item-label">Departure</span><span className="meta-item-value">07:30 PM Daily</span></div>
                </div>
                <div className="route-card-actions">
                  <Link href="/bus-timetables#route-87" className="btn btn-outline btn-sm">Timetable</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">Book Online</Link>
                </div>
              </div>
            </article>

            {/* Trincomalee */}
            <article className="route-card">
              <div className="route-card-image-wrap">
                <ImageSlot
                  title="Trincomalee Eastern Harbor Slot"
                  subtitle="Direct Luxury Transport Port [600x380]"
                  aspectRatio="16/10"
                  category="Destination Slot"
                  dimensions="600 x 380 px"
                  icon="dest"
                />
                <div className="route-badge-overlay"><span className="badge badge-super-luxury">Super Luxury</span></div>
                <div className="route-destination-tag">Trincomalee</div>
              </div>
              <div className="route-card-body">
                <h3 className="route-card-title">Colombo ⇌ Trincomalee</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  Connecting the Eastern seaboard port of Trincomalee with Colombo via comfortable luxury coach service.
                </p>
                <div className="route-card-meta">
                  <div className="meta-item"><span className="meta-item-label">Route</span><span className="meta-item-value">Special Express</span></div>
                  <div className="meta-item"><span className="meta-item-label">Booking</span><span className="meta-item-value">In-House Online</span></div>
                </div>
                <div className="route-card-actions">
                  <Link href="/contact-us" className="btn btn-outline btn-sm">Inquire Schedule</Link>
                  <Link href="/#booking" className="btn btn-primary btn-sm">Book Online</Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
