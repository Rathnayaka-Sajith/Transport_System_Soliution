import React from 'react';
import Link from 'next/link';
import ImageSlot from '@/components/ImageSlot';

export const metadata = {
  title: "About us | PNG Express - Your Trusted Travel Partner",
  description: "PNG Express has emerged as a leading people mobility company in Sri Lanka, founded in 2005 by Mr. Nikitha Grero.",
};

export default function AboutUsPage() {
  return (
    <>
      {/* Page Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0b1329, #1e293b)', color: '#ffffff', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-subtitle" style={{ color: '#38bdf8' }}>Our Heritage &amp; Leadership</span>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 3.8vw, 3.25rem)', marginBottom: '0.75rem' }}>About PNG Express</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
            Founded in 2005 by Mr. Nikitha Grero, providing safe, reliable, and comfortable people mobility across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section">
        <div className="container">
          <div className="company-profile-grid">
            <div>
              <span className="section-subtitle">Since 2005</span>
              <h2 className="section-title">Who We Are</h2>
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Founded in 2005 by <strong>Mr. Nikitha Grero</strong>, PNG Express has emerged as a leading people mobility company in Sri Lanka, initially starting with a single bus on the <strong>Colombo – Passara route</strong>. Over the years, the company has evolved into a trailblazer within the travel industry, now boasting a comprehensive fleet that includes Super luxury coaches, luxury coaches, and non-AC passenger buses.
              </p>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Under Mr. Grero’s visionary leadership, PNG Express is committed to delivering top-notch Public Bus Services, setting new standards for reliability and innovation in the transportation sector. From its humble beginnings, the company has transformed into a symbol of excellence, consistently prioritizing customer satisfaction and providing a diverse range of high-quality mobility solutions to the people of Sri Lanka.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#046bd2' }}>2005</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Year Founded</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#046bd2' }}>142+</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Active Coaches</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#046bd2' }}>100%</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Islandwide Reach</div>
                </div>
              </div>

              <Link href="/services" className="btn btn-primary">Discover Our Fleet &amp; Services ➔</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ImageSlot
                title="Super Luxury Fleet Lineup Slot"
                subtitle="Aerodynamic Long-Distance Coaches [800x500]"
                aspectRatio="16/10"
                category="Fleet Slot"
                dimensions="800 x 500 px"
                icon="bus"
              />
              <ImageSlot
                title="Night Expressway Coach Service Slot"
                subtitle="Southern & Northern Highway Fleet [800x500]"
                aspectRatio="16/10"
                category="Expressway Slot"
                dimensions="800 x 500 px"
                icon="bus"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Riding With Us: Satisfaction Guaranteed */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Excellence in Service</span>
            <h2 className="section-title">Riding with Us, Your Satisfaction is Guaranteed!</h2>
            <p className="section-description">
              Here are some compelling reasons to choose PNG Express for your bus transportation needs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>Safety Above All</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                Our safety is our top priority. We maintain a fleet of meticulously maintained buses and employ highly skilled drivers with excellent safety records.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏝️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>Islandwide Flexibility</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                Whether you are a group of vacationers needing airport transfers or planning to explore the beauty of Sri Lanka, our luxury buses are capable of taking you anywhere.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👨‍✈️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>Qualified Professionals</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                Our drivers are highly qualified professionals proficient in long-distance tours, allowing passengers to relax and enjoy a safe and peaceful journey.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>Fine Interiors &amp; Comfort</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                All our coaches are well-maintained with fine interiors, individual USB ports, and comfortable recliners to ensure long drives are smooth and free of complications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Affiliated Companies */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Group Synergy</span>
            <h2 className="section-title">The PNG Group of Companies</h2>
            <p className="section-description">
              PNG Express operates in strong synergy with the PNG Group, ensuring fleet engineering, automotive parts, and logistics excellence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div style={{ padding: '1.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <h4 style={{ color: '#046bd2', marginBottom: '0.5rem' }}>PNG Spares</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Genuine commercial vehicle spare parts &amp; maintenance components.</p>
            </div>
            <div style={{ padding: '1.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <h4 style={{ color: '#046bd2', marginBottom: '0.5rem' }}>PNG Holdings</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Corporate governance, investment, and strategic leadership.</p>
            </div>
            <div style={{ padding: '1.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <h4 style={{ color: '#046bd2', marginBottom: '0.5rem' }}>PNG Fleet Management</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>IoT telematics, GPS vehicle monitoring, and route analytics.</p>
            </div>
            <div style={{ padding: '1.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <h4 style={{ color: '#046bd2', marginBottom: '0.5rem' }}>PNG Automotive</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Coach building, mechanical engineering, and safety inspections.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
