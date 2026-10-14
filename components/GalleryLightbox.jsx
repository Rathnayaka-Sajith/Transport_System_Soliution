'use client';

import React, { useState, useEffect } from 'react';
import ImageSlot from '@/components/ImageSlot';

const gallerySlots = [
  {
    category: 'coaches',
    title: 'PNG Express Night Expressway Coach Slot',
    subtitle: 'Super Luxury Express Bus [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'bus',
  },
  {
    category: 'routes',
    title: 'Panadura - Kandy Service Route Slot',
    subtitle: 'Route 17 Daily Schedule [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'route',
  },
  {
    category: 'routes',
    title: 'Jaffna Heritage Route Visual Slot',
    subtitle: 'Historic Jaffna Peninsula Route [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'landmark',
  },
  {
    category: 'coaches',
    title: 'Makumbura ⇌ Badulla Coach Slot',
    subtitle: 'EX 01 Expressway Route [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'bus',
  },
  {
    category: 'coaches',
    title: 'Central Fleet Depot Station Slot',
    subtitle: 'Maintenance & Dispatch Facility [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'bus',
  },
  {
    category: 'coaches',
    title: 'Jaffna ➔ Colombo 87 Coach Slot',
    subtitle: 'Super Luxury Night Coach [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'bus',
  },
  {
    category: 'interior',
    title: 'Plush Reclining Seats Interior Slot',
    subtitle: 'Spacious legroom & neck support [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'interior',
  },
  {
    category: 'interior',
    title: 'Clean Luxury Interior Cabin Slot',
    subtitle: 'Climate controlled air-conditioning [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'interior',
  },
  {
    category: 'interior',
    title: 'Individual USB Charging Station Slot',
    subtitle: 'Fast charging at every passenger seat [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'interior',
  },
  {
    category: 'routes',
    title: 'Moratuwa ➔ Point Pedro Route Slot',
    subtitle: 'via Palaly Route 87 [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'route',
  },
  {
    category: 'routes',
    title: 'Trincomalee ⇌ Colombo Route Slot',
    subtitle: 'Direct Luxury Transport Corridor [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'route',
  },
  {
    category: 'routes',
    title: 'Point Pedro ➔ Moratuwa Route Slot',
    subtitle: 'via Kopay Route 87 [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'route',
  },
  {
    category: 'coaches',
    title: 'Moratuwa ➔ Kankesanthurai Coach Slot',
    subtitle: 'Route 15 via Kurunegala [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'bus',
  },
  {
    category: 'coaches',
    title: 'Moratuwa ➔ Karainagar Coach Slot',
    subtitle: 'Route 87 Super Luxury Coach [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'bus',
  },
  {
    category: 'routes',
    title: 'Maharagama ➔ Thanthirimale Pilgrimage Slot',
    subtitle: 'Special Pilgrimage Charter Service [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'landmark',
  },
  {
    category: 'routes',
    title: 'Nittambuwa ⇌ Panadura Transit Slot',
    subtitle: 'Western Province Transit Corridor [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'route',
  },
  {
    category: 'routes',
    title: 'Badulla ➔ Makumbura Highway Slot',
    subtitle: 'Uva Province to Western MMC [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'route',
  },
  {
    category: 'routes',
    title: 'Makumbura ➔ Ravana Ella Tour Slot',
    subtitle: 'Ella Tourism Special Service [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'landmark',
  },
  {
    category: 'coaches',
    title: 'Super Luxury Fleet Lineup Slot',
    subtitle: 'Modern aerodynamic long-distance coaches [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'bus',
  },
  {
    category: 'coaches',
    title: 'Sleek Exterior Design View Slot',
    subtitle: 'Full-length tint & air suspension [1200x800]',
    dimensions: '1200 x 800 px',
    aspectRatio: '4/3',
    icon: 'bus',
  },
];

export default function GalleryLightbox() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = gallerySlots.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  const showPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filtered.length]);

  return (
    <>
      <div className="gallery-filter-tabs">
        <button
          className={`booking-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All Slots (20)
        </button>
        <button
          className={`booking-tab-btn ${activeCategory === 'coaches' ? 'active' : ''}`}
          onClick={() => setActiveCategory('coaches')}
        >
          Super Luxury Coaches
        </button>
        <button
          className={`booking-tab-btn ${activeCategory === 'interior' ? 'active' : ''}`}
          onClick={() => setActiveCategory('interior')}
        >
          Interior &amp; Comfort
        </button>
        <button
          className={`booking-tab-btn ${activeCategory === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveCategory('routes')}
        >
          Scenic Destinations
        </button>
      </div>

      <div className="gallery-grid">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="gallery-item-slot-wrapper"
            onClick={() => openLightbox(idx)}
            style={{ cursor: 'pointer' }}
          >
            <ImageSlot
              title={item.title}
              subtitle={item.subtitle}
              aspectRatio="4/3"
              category={item.category.toUpperCase()}
              dimensions={item.dimensions}
              icon={item.icon}
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox-modal open" onClick={closeLightbox}>
          <button
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            &times;
          </button>
          <button
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
          >
            &#10094;
          </button>
          <button
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            &#10095;
          </button>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '750px', background: '#0b1329', padding: '2rem', borderRadius: '16px', border: '1px solid #1e293b' }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <ImageSlot
                title={filtered[lightboxIndex]?.title}
                subtitle={filtered[lightboxIndex]?.subtitle}
                aspectRatio="16/9"
                category={filtered[lightboxIndex]?.category.toUpperCase()}
                dimensions={filtered[lightboxIndex]?.dimensions}
                icon={filtered[lightboxIndex]?.icon}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                }}
              />
            </div>
            <div style={{ textAlign: 'center', color: '#ffffff' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#38bdf8' }}>
                {filtered[lightboxIndex]?.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                Slot Target: {filtered[lightboxIndex]?.subtitle} • Standard Resolution: {filtered[lightboxIndex]?.dimensions}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
