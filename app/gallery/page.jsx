import React from 'react';
import GalleryLightbox from '@/components/GalleryLightbox';

export const metadata = {
  title: "Gallery | PNG Express Sri Lanka",
  description: "Explore our photo gallery highlighting the comfort, modern amenities, and fleet of PNG Express across Sri Lanka.",
};

export default function GalleryPage() {
  return (
    <>
      {/* Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0b1329, #1e293b)', color: '#ffffff', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-subtitle" style={{ color: '#38bdf8' }}>Visual Experience</span>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 3.8vw, 3.25rem)', marginBottom: '0.75rem' }}>PNG Express Fleet Gallery</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '780px', margin: '0 auto' }}>
            Our gallery highlights the excellence and comfort of our transportation services with vivid images. Explore the modern amenities, spacious interiors, and scenic routes of our coaches across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <div className="container">
          <GalleryLightbox />
        </div>
      </section>
    </>
  );
}
