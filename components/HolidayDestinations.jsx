'use client';

import React, { useState } from 'react';

const HOLIDAY_PLACES = [
  {
    id: 'ella',
    title: 'Ella & Little Adam\'s Peak',
    region: 'Uva Province • Badulla District',
    category: 'hill-country',
    categoryLabel: 'Hill Country & Nature',
    badge: 'Trending Holiday',
    badgeColor: '#10b981',
    image: '/images/makumbura-to-ravana-ella-ncg-express.webp',
    fallback: '/images/destination/badulla-2.jpg',
    duration: '2-3 Days Weekend',
    highlights: [
      'Famous Nine Arch Bridge & Demodara Loop',
      'Ravana Falls & Secret Cave Trails',
      'Little Adam\'s Peak Scenic Viewpoint',
      'Flying Ravana Mega Zipline Adventure',
    ],
    recommendedRoute: 'Route 99 Express or Private Charter',
  },
  {
    id: 'kandy',
    title: 'Kandy & Cultural Triangle',
    region: 'Central Province • Hill Capital',
    category: 'heritage',
    categoryLabel: 'UNESCO World Heritage',
    badge: 'Cultural Gem',
    badgeColor: '#f59e0b',
    image: '/images/panadura-to-kandy-ncg-express-bus.webp',
    fallback: '/images/destination/route-17-2.jpg',
    duration: '1-2 Days Excursion',
    highlights: [
      'Sacred Temple of the Tooth Relic (Sri Dalada Maligawa)',
      'Royal Botanical Gardens Peradeniya',
      'Scenic Kandy Lake & Udawatta Kele Sanctuary',
      'Annual Esala Perahera Pageant & Dance Shows',
    ],
    recommendedRoute: 'Route 17 Express (12+ Daily Trips)',
  },
  {
    id: 'jaffna',
    title: 'Jaffna & Casuarina Beach',
    region: 'Northern Province • Peninsula',
    category: 'coastal',
    categoryLabel: 'Heritage & Coastline',
    badge: 'Historic North',
    badgeColor: '#3b82f6',
    image: '/images/nallur-kovil-ncg-express.webp',
    fallback: '/images/destination/route-87-2.jpg',
    duration: '3-4 Days Holiday',
    highlights: [
      'Architectural Wonder Nallur Kandaswamy Kovil',
      'Pristine White Sands of Casuarina Beach Karainagar',
      'Historic Jaffna Dutch Fort & Clock Tower',
      'Delft Island Wild Horses & Baobab Tree Excursion',
    ],
    recommendedRoute: 'Route 87 Super Luxury Overnight Express',
  },
  {
    id: 'trincomalee',
    title: 'Trincomalee & Nilaveli Beach',
    region: 'Eastern Province • Sun & Surf',
    category: 'coastal',
    categoryLabel: 'Marine & Snorkeling',
    badge: 'Marine Paradise',
    badgeColor: '#06b6d4',
    image: '/images/trincomalee-to-colombo-99-ncg-express.webp',
    fallback: '/images/destination/trincomalee-2.jpg',
    duration: '3-4 Days Coastal',
    highlights: [
      'Pigeon Island National Park Snorkeling & Coral Reefs',
      'Nilaveli Beach Golden Sands & Whale Watching',
      'Historic Koneswaram Cliff-Top Kovil & Fort Frederick',
      'Natural Deep-Water Harbor Panoramic Viewpoints',
    ],
    recommendedRoute: 'Special Express or Private Charter Bus',
  },
  {
    id: 'badulla-dunhinda',
    title: 'Badulla & Dunhinda Falls',
    region: 'Uva Province • Valley Gateway',
    category: 'hill-country',
    categoryLabel: 'Misty Mountains',
    badge: 'Waterfalls Tour',
    badgeColor: '#10b981',
    image: '/images/badulla-makumbura-ncg-express.webp',
    fallback: '/images/destination/badulla-1.jpg',
    duration: '2 Days Tour',
    highlights: [
      'Roaring 64-meter Dunhinda Waterfall Plunge',
      'Historic Muthiyangana Raja Maha Viharaya',
      'Tea Factory Visits & Fresh Ceylon Tea Tasting',
      'Southern Expressway High-Speed Corridor Access',
    ],
    recommendedRoute: 'EX 01 Southern Expressway Corridor',
  },
  {
    id: 'kankesanthurai',
    title: 'Kankesanthurai & Keerimalai',
    region: 'Northern Coast • Sacred Springs',
    category: 'heritage',
    categoryLabel: 'Pilgrimage & Coast',
    badge: 'Sacred Haven',
    badgeColor: '#8b5cf6',
    image: '/images/keerimalai-springs-ncg-express.webp',
    fallback: '/images/destination/route-15-2.jpg',
    duration: '2-3 Days Tour',
    highlights: [
      'Natural Healing Mineral Pools of Keerimalai Springs',
      'Naguleswaram Ancient Shiva Temple',
      'Historic KKS Harbor & Oceanfront Lighthouse',
      'Coastal Breeze Sunset Dining & Seafood',
    ],
    recommendedRoute: 'Route 15 Overnight Super Luxury Express',
  },
  {
    id: 'passara-namunukula',
    title: 'Passara & Namunukula Ridge',
    region: 'Uva Highlands • Tea Corridors',
    category: 'hill-country',
    categoryLabel: 'Hiking & Tea Country',
    badge: 'Off the Beaten Path',
    badgeColor: '#d97706',
    image: '/images/colombo-passara-99-ncg-express.webp',
    fallback: '/images/destination/route-99-2.jpg',
    duration: '2 Days Getaway',
    highlights: [
      'Hike to the 2,036m Summit of Namunukula Peak',
      'Millabedda Lush Tea Plantations & Estate Bungalows',
      'Panoramic 360° Views of the Southern Plains',
      'Cool Mountain Climate & Serene Pine Forests',
    ],
    recommendedRoute: 'Route 99 Super Luxury Highway Coach',
  },
  {
    id: 'point-pedro',
    title: 'Point Pedro & Northern Frontier',
    region: 'Northern Coast • Northernmost Tip',
    category: 'coastal',
    categoryLabel: 'Frontier Coastal Tour',
    badge: 'Northernmost Point',
    badgeColor: '#3b82f6',
    image: '/images/point-pedro-to-moratuwa-via-kopay.webp',
    fallback: '/images/destination/point-pedro-2.jpg',
    duration: '3 Days Journey',
    highlights: [
      'Sakkotai Cape - The Absolute Northernmost Tip of Sri Lanka',
      'Historic Point Pedro Concrete Lighthouse',
      'Manalkadu Sand Dunes & St. Anthony\'s Church Ruins',
      'Traditional Palmyra Groves & Northern Fishing Villages',
    ],
    recommendedRoute: 'Route 87 via Kopay & Palaly',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Destinations' },
  { id: 'hill-country', label: '⛰️ Hill Country & Waterfalls' },
  { id: 'heritage', label: '🏛️ Heritage & Cultural' },
  { id: 'coastal', label: '🏖️ Beaches & Islands' },
];

export default function HolidayDestinations() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPlaces = activeCategory === 'all'
    ? HOLIDAY_PLACES
    : HOLIDAY_PLACES.filter((p) => p.category === activeCategory);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImageError = (e, fallback) => {
    if (e.target.src !== fallback) {
      e.target.src = fallback;
    }
  };

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="holiday-filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`holiday-filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Holiday Cards Grid */}
      <div className="holiday-destinations-grid">
        {filteredPlaces.map((place) => (
          <article key={place.id} className="holiday-card">
            {/* Image Header with Scrim */}
            <div className="holiday-card-img-wrap">
              <img
                src={place.image}
                alt={place.title}
                className="holiday-card-img"
                onError={(e) => handleImageError(e, place.fallback)}
              />
              <div className="holiday-card-scrim"></div>

              {/* Floating Badges */}
              <div className="holiday-card-top-tags">
                <span className="holiday-badge" style={{ backgroundColor: place.badgeColor }}>
                  {place.badge}
                </span>
                <span className="holiday-duration-tag">
                  ⏱️ {place.duration}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="holiday-card-overlay-header">
                <span className="holiday-card-region">{place.region}</span>
                <h3 className="holiday-card-title">{place.title}</h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="holiday-card-body">
              <div className="holiday-highlights-box">
                <span className="highlights-title">Top Trip Highlights:</span>
                <ul className="highlights-list">
                  {place.highlights.map((item, idx) => (
                    <li key={idx}>
                      <span className="highlight-bullet">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="holiday-route-hint">
                <span className="route-hint-label">Recommended PNG Service:</span>
                <span className="route-hint-val">{place.recommendedRoute}</span>
              </div>

              {/* Card Actions */}
              <div className="holiday-card-actions">
                <a
                  href="#seat-booking"
                  onClick={(e) => scrollToSection(e, 'seat-booking')}
                  className="btn-holiday-outline"
                >
                  💺 Book Seats
                </a>
                <a
                  href="#bus-booking"
                  onClick={(e) => scrollToSection(e, 'bus-booking')}
                  className="btn-holiday-primary"
                >
                  🚌 Charter Bus
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
