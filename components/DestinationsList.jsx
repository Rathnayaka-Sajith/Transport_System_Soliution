'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const ALL_DESTINATIONS = [
  {
    id: 'jaffna',
    number: 'Route 87',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Colombo ⇌ Jaffna',
    subtitle: 'Route 87 Super Luxury Overnight Express',
    description: 'Daily super luxury overnight express linking Western Province and the northern capital with reclining seats, USB ports, and air conditioning.',
    departure: '07:30 PM & 08:30 PM',
    frequency: 'Night Express Daily',
    timetableLink: '/bus-timetables#route-87',
    bookingLink: '/pay-for-booking?busId=b-87-1&from=Colombo&to=Jaffna',
    actionText: 'Book Online',
    themeColor: '#a855f7', // Purple
    themeGlow: 'rgba(168, 85, 247, 0.45)',
    primaryImage: '/images/destination/route-87-1.jpg',
    primaryFallback: '/images/colombo-jaffna-87-ncg-express.webp',
    primaryLabel: 'Route 87 Super Luxury Express Coach',
    hoverImage: '/images/destination/route-87-2.jpg',
    hoverFallback: '/images/nallur-kovil-ncg-express.webp',
    hoverLabel: 'Nallur Kandaswamy Kovil & Jaffna',
    stops: ['Colombo', 'Vavuniya', 'Kilinochchi', 'Jaffna'],
  },
  {
    id: 'point-pedro',
    number: 'Route 87',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Colombo ⇌ Point Pedro',
    subtitle: 'Route 87 Northern Tip Express Corridor',
    description: 'Direct routes via Palaly and via Kopay reaching the northernmost tip of the island smoothly and safely.',
    departure: '08:00 PM & 09:00 PM',
    frequency: 'via Palaly & Kopay',
    timetableLink: '/bus-timetables#route-87',
    bookingLink: '/pay-for-booking?busId=b-pt-1&from=Colombo&to=Point Pedro',
    actionText: 'Book Online',
    themeColor: '#3b82f6', // Blue
    themeGlow: 'rgba(59, 130, 246, 0.45)',
    primaryImage: '/images/destination/point-pedro-1.jpg',
    primaryFallback: '/images/point-pedro-to-moratuwa-via-kopay.webp',
    primaryLabel: 'Moratuwa - Point Pedro Super Luxury Coach',
    hoverImage: '/images/destination/point-pedro-2.jpg',
    hoverFallback: '/images/moratuwa-to-point-pedro-via-palaly.webp',
    hoverLabel: 'Point Pedro Lighthouse & Coast',
    stops: ['Colombo', 'Pettah', 'Vavuniya', 'Jaffna', 'Point Pedro'],
  },
  {
    id: 'kankesanthurai',
    number: 'Route 15',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Panadura ⇌ Kankesanthurai',
    subtitle: 'Route 15 Northern Coastal Service',
    description: 'Scheduled service via Kurunegala and Dambulla, carrying commuters to Kankesanthurai and Keerimalai springs.',
    departure: '08:30 PM Daily',
    frequency: 'via Kurunegala & Dambulla',
    timetableLink: '/bus-timetables#route-15',
    bookingLink: '/pay-for-booking?busId=b-15-1&from=Panadura&to=Kankesanthurai',
    actionText: 'Book Online',
    themeColor: '#06b6d4', // Cyan
    themeGlow: 'rgba(6, 182, 212, 0.45)',
    primaryImage: '/images/destination/route-15-1.jpg',
    primaryFallback: '/images/panadura-to-kankesanthurai-ncg-express-bus.webp',
    primaryLabel: 'Route 15 Super Luxury Coach',
    hoverImage: '/images/destination/route-15-2.jpg',
    hoverFallback: '/images/keerimalai-springs-ncg-express.webp',
    hoverLabel: 'Keerimalai Springs & KKS Beach',
    stops: ['Panadura', 'Pettah', 'Kurunegala', 'Jaffna', 'KKS'],
  },
  {
    id: 'badulla-ella',
    number: 'EX 01 74/31-2',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Makumbura ⇌ Badulla',
    subtitle: 'EX 01 Southern Expressway Corridor',
    description: 'Southern Expressway route via Mattala, Wellawaya, and Ravana Ella tourism corridor to Badulla city center.',
    departure: '10:30 AM & 05:30 PM',
    frequency: 'Southern Expressway Daily',
    timetableLink: '/bus-timetables#route-ex01',
    bookingLink: '/pay-for-booking?busId=b-ex01-1&from=Makumbura&to=Badulla',
    actionText: 'Book Online',
    themeColor: '#10b981', // Emerald
    themeGlow: 'rgba(16, 185, 129, 0.45)',
    primaryImage: '/images/destination/badulla-1.jpg',
    primaryFallback: '/images/makumbura-to-badulla-ncg-express.webp',
    primaryLabel: 'Makumbura Badulla Express Coach',
    hoverImage: '/images/destination/badulla-2.jpg',
    hoverFallback: '/images/makumbura-to-ravana-ella-ncg-express.webp',
    hoverLabel: 'Ravana Ella & Badulla Valley',
    stops: ['Makumbura', 'Mattala', 'Wellawaya', 'Ella', 'Badulla'],
  },
  {
    id: 'passara',
    number: 'Route 99',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Colombo ⇌ Passara',
    subtitle: 'Route 99 Super Luxury Mountain Route',
    description: 'The founding route of PNG Express connecting Colombo, Homagama, Bandarawela, Badulla, and Passara.',
    departure: '12:45 AM Daily',
    frequency: 'Night Express Daily',
    timetableLink: '/bus-timetables#route-99',
    bookingLink: '/pay-for-booking?busId=b-99-1&from=Colombo&to=Passara',
    actionText: 'Book Online',
    themeColor: '#f59e0b', // Amber
    themeGlow: 'rgba(245, 158, 11, 0.45)',
    primaryImage: '/images/destination/route-99-1.jpg',
    primaryFallback: '/images/colombo-passara-99-ncg-express.webp',
    primaryLabel: 'Route 99 Super Luxury Coach',
    hoverImage: '/images/destination/route-99-2.jpg',
    hoverFallback: '/images/badulla-makumbura-ncg-express.webp',
    hoverLabel: 'Passara Mountain Range & Tea Hills',
    stops: ['Colombo', 'Homagama', 'Bandarawela', 'Badulla', 'Passara'],
  },
  {
    id: 'kandy',
    number: 'Route 17',
    badge: 'Normal Service',
    badgeClass: 'badge-normal',
    title: 'Panadura ⇌ Kandy',
    subtitle: 'Route 17 High Frequency Interprovincial Service',
    description: 'High frequency daily scheduled transit service connecting Western Province and the hill capital with 12+ daily round-trips.',
    departure: 'Every 30-45 mins',
    frequency: '12+ Round-Trips Daily',
    timetableLink: '/bus-timetables#route-17',
    bookingLink: '/pay-for-booking?busId=b-17-1&from=Panadura&to=Kandy',
    actionText: 'Book Online',
    themeColor: '#14b8a6', // Teal
    themeGlow: 'rgba(20, 184, 166, 0.45)',
    primaryImage: '/images/destination/route-17-1.jpg',
    primaryFallback: '/images/panadura-to-kandy-ncg-express-bus.webp',
    primaryLabel: 'Route 17 Daily Service Coach',
    hoverImage: '/images/destination/route-17-2.jpg',
    hoverFallback: '/images/route-17-2.jpg',
    hoverLabel: 'Temple of the Tooth & Kandy Lake',
    stops: ['Panadura', 'Moratuwa', 'Colombo', 'Kadawatha', 'Kandy'],
  },
  {
    id: 'karainagar',
    number: 'Route 87',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Colombo ⇌ Karainagar',
    subtitle: 'Route 87 Island Connector Express',
    description: 'Direct connection from Moratuwa and Colombo to the island of Karainagar via Casuarina beach causeway.',
    departure: '07:30 PM Daily',
    frequency: 'Night Express Daily',
    timetableLink: '/bus-timetables#route-87',
    bookingLink: '/pay-for-booking?busId=b-karai-1&from=Colombo&to=Karainagar',
    actionText: 'Book Online',
    themeColor: '#8b5cf6', // Violet
    themeGlow: 'rgba(139, 92, 246, 0.45)',
    primaryImage: '/images/destination/karainagar-1.jpg',
    primaryFallback: '/images/moratuwa-to-karainagar-ncg-express.webp',
    primaryLabel: 'Moratuwa Karainagar Express Coach',
    hoverImage: '/images/destination/karainagar-2.jpg',
    hoverFallback: '/images/jaffna-to-colombo-87-ncg-express.webp',
    hoverLabel: 'Casuarina Beach & Causeway',
    stops: ['Colombo', 'Vavuniya', 'Jaffna', 'Karainagar'],
  },
  {
    id: 'trincomalee',
    number: 'Special Express',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Colombo ⇌ Trincomalee',
    subtitle: 'Special Luxury Express Corridor',
    description: 'Connecting the Eastern seaboard port of Trincomalee with Colombo via comfortable luxury coach service.',
    departure: 'Special Express',
    frequency: 'Online In-House Booking',
    timetableLink: '/contact-us',
    bookingLink: '/pay-for-booking?busId=b-trinco-1&from=Colombo&to=Trincomalee',
    actionText: 'Book Online',
    themeColor: '#f43f5e', // Rose
    themeGlow: 'rgba(244, 63, 94, 0.45)',
    primaryImage: '/images/destination/trincomalee-1.jpg',
    primaryFallback: '/images/trincomalee-to-colombo-99-ncg-express.webp',
    primaryLabel: 'Colombo Trincomalee Luxury Coach',
    hoverImage: '/images/destination/trincomalee-2.jpg',
    hoverFallback: '/images/trincomalee-to-colombo-99-ncg-express.webp',
    hoverLabel: 'Trincomalee Natural Harbor & Coast',
    stops: ['Colombo', 'Kurunegala', 'Dambulla', 'Habarana', 'Trinco'],
  },
];

export default function DestinationsList() {
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const handleImageError = (e, fallback) => {
    const src = e.target.src;
    if (src.endsWith('.jpg')) {
      e.target.src = src.replace('.jpg', '.png');
    } else if (src.endsWith('.png')) {
      e.target.src = src.replace('.png', '.webp');
    } else if (src !== fallback) {
      e.target.src = fallback;
    }
  };

  return (
    <div className="destinations-fullwidth-grid">
      {ALL_DESTINATIONS.map((route) => {
        const isHovered = hoveredCardId === route.id;

        return (
          <article
            key={route.id}
            className={`full-fill-route-card ${isHovered ? 'card-hovered' : ''}`}
            style={{
              '--card-theme': route.themeColor,
              '--card-glow': route.themeGlow,
            }}
            onMouseEnter={() => setHoveredCardId(route.id)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            {/* Background Images Layer: Fills the ENTIRE card (No white slot) */}
            <div className="full-card-bg-wrap">
              {/* Photo 1: Primary Coach / Route (Before Hover) */}
              <img
                src={route.primaryImage}
                alt={route.primaryLabel}
                className={`full-card-bg-img ${isHovered ? 'bg-hidden' : 'bg-visible'}`}
                onError={(e) => handleImageError(e, route.primaryFallback)}
              />

              {/* Photo 2: Landmark / Cultural on Hover (After Hover) */}
              <img
                src={route.hoverImage}
                alt={route.hoverLabel}
                className={`full-card-bg-img bg-secondary ${isHovered ? 'bg-visible' : 'bg-hidden'}`}
                onError={(e) => handleImageError(e, route.hoverFallback)}
              />

              {/* Contrast Protection Dark Scrim Gradient */}
              <div className="full-card-scrim-gradient"></div>
            </div>

            {/* Foreground Content: Placed ON TOP of the full-fill image */}
            <div className="full-card-foreground">
              {/* Top Bar: Service Badge & Route Tag */}
              <div className="full-card-top-bar">
                <div className="full-card-badges">
                  <span className={`badge ${route.badgeClass}`}>{route.badge}</span>
                  <span className="route-tag-capsule" style={{ borderColor: route.themeColor }}>
                    {route.number}
                  </span>
                </div>
              </div>

              {/* Bottom Area: Title, Stops, Meta & Actions */}
              <div className="full-card-bottom-area">
                <h3 className="full-card-title">{route.title}</h3>

                {/* Sub-Destinations / Stops Path */}
                <div className="full-card-stops-path">
                  {route.stops.map((stop, i) => (
                    <React.Fragment key={stop}>
                      <span className="stop-name-tag">{stop}</span>
                      {i < route.stops.length - 1 && <span className="stop-arrow">➔</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Departure & Frequency Metas */}
                <div className="full-card-meta-row">
                  <div className="meta-capsule">
                    <span className="capsule-label">Departure</span>
                    <span className="capsule-val">{route.departure}</span>
                  </div>
                  <div className="meta-capsule">
                    <span className="capsule-label">Frequency</span>
                    <span className="capsule-val">{route.frequency}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="full-card-actions">
                  <Link href={route.timetableLink} className="btn-card-outline">
                    Timetable
                  </Link>
                  <Link
                    href={route.bookingLink}
                    className="btn-card-primary"
                  >
                    {route.actionText || 'Book Online'}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
