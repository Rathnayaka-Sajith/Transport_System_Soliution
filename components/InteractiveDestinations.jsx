'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const ROUTES_DATA = [
  {
    id: 'route-99',
    number: 'Route 99',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Colombo ⇌ Passara',
    subtitle: 'Route 99 Super Luxury Coach Service',
    description: 'Scheduled daily express connecting Colombo and Homagama to the misty mountain heights of Bandarawela, Badulla, and Passara.',
    distance: '248 km',
    duration: '5h 30m',
    departure: '12:45 AM / 12:30 AM',
    frequency: 'Daily Scheduled',
    timetableLink: '/bus-timetables#route-99',
    bookingLink: '/pay-for-booking?busId=b-99-1&from=Colombo&to=Passara',
    actionText: 'Book Online',
    themeColor: '#f59e0b', // Amber
    themeGlow: 'rgba(245, 158, 11, 0.45)',
    // User images in public/images/destination/
    primaryImage: '/images/destination/route-99-1.jpg',
    primaryFallback: '/images/colombo-passara-99-ncg-express.webp',
    primaryLabel: 'Route 99 Super Luxury Coach',
    hoverImage: '/images/destination/route-99-2.jpg',
    hoverFallback: '/images/makumbura-to-badulla-ncg-express.webp',
    hoverLabel: 'Scenic Badulla & Passara Hills',
    stops: ['Colombo', 'Homagama', 'Bandarawela', 'Badulla', 'Passara'],
  },
  {
    id: 'route-15',
    number: 'Route 15',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Panadura ⇌ Kankesanthurai',
    subtitle: 'Route 15 Super Luxury Coach Service',
    description: 'Overnight express crossing central Sri Lanka to reach the historic northern coastal port of Kankesanthurai and Keerimalai springs.',
    distance: '412 km',
    duration: '8h 15m',
    departure: '08:30 PM (via Dambulla)',
    frequency: 'Daily Scheduled',
    timetableLink: '/bus-timetables#route-15',
    bookingLink: '/pay-for-booking?busId=b-15-1&from=Panadura&to=Kankesanthurai',
    actionText: 'Book Online',
    themeColor: '#38bdf8', // Cyan / Sky Blue
    themeGlow: 'rgba(56, 189, 248, 0.45)',
    primaryImage: '/images/destination/route-15-1.jpg',
    primaryFallback: '/images/panadura-to-kankesanthurai-ncg-express-bus.webp',
    primaryLabel: 'Route 15 Super Luxury Coach',
    hoverImage: '/images/destination/route-15-2.jpg',
    hoverFallback: '/images/keerimalai-springs-ncg-express.webp',
    hoverLabel: 'Keerimalai Springs & KKS Beach',
    stops: ['Panadura', 'Pettah', 'Kurunegala', 'Jaffna', 'KKS'],
  },
  {
    id: 'route-87',
    number: 'Route 87',
    badge: 'Super Luxury',
    badgeClass: 'badge-super-luxury',
    title: 'Colombo ⇌ Jaffna',
    subtitle: 'Route 87 Super Luxury Express Corridor',
    description: 'High-speed overnight super luxury coaches connecting Western Province to the northernmost tip of the island via Palaly & Kopay.',
    distance: '425 km',
    duration: '8h 30m',
    departure: '07:30 PM & 08:30 PM',
    frequency: 'via Palaly & Kopay',
    timetableLink: '/bus-timetables#route-87',
    bookingLink: '/pay-for-booking?busId=b-87-1&from=Colombo&to=Jaffna',
    actionText: 'Book Online',
    themeColor: '#a855f7', // Purple
    themeGlow: 'rgba(168, 85, 247, 0.45)',
    primaryImage: '/images/destination/route-87-1.jpg',
    primaryFallback: '/images/colombo-jaffna-87-ncg-express.webp',
    primaryLabel: 'Route 87 Super Luxury Express',
    hoverImage: '/images/destination/route-87-2.jpg',
    hoverFallback: '/images/nallur-kovil-ncg-express.webp',
    hoverLabel: 'Nallur Kandaswamy Kovil & Jaffna',
    stops: ['Colombo', 'Vavuniya', 'Kilinochchi', 'Jaffna'],
  },
  {
    id: 'route-17',
    number: 'Route 17',
    badge: 'Normal Service',
    badgeClass: 'badge-normal',
    title: 'Panadura ⇌ Kandy',
    subtitle: 'Route 17 Daily Service Corridor',
    description: 'High-frequency daily scheduled passenger service connecting Western coastal belt directly to Kandy, the sacred UNESCO cultural capital.',
    distance: '135 km',
    duration: '3h 15m',
    departure: '12+ Trips Daily',
    frequency: 'Starts At 03:30 AM Daily',
    timetableLink: '/bus-timetables#route-17',
    bookingLink: '/pay-for-booking?busId=b-17-1&from=Panadura&to=Kandy',
    actionText: 'Book Online',
    themeColor: '#10b981', // Emerald
    themeGlow: 'rgba(16, 185, 129, 0.45)',
    primaryImage: '/images/destination/route-17-1.jpg',
    primaryFallback: '/images/panadura-to-kandy-ncg-express-bus.webp',
    primaryLabel: 'Route 17 Daily Service Coach',
    hoverImage: '/images/destination/route-17-2.jpg',
    hoverFallback: '/images/kandy-temple.jpg',
    hoverLabel: 'Temple of the Tooth & Kandy Lake',
    stops: ['Panadura', 'Moratuwa', 'Colombo', 'Kadawatha', 'Kandy'],
  },
];

export default function InteractiveDestinations() {
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
      {ROUTES_DATA.map((route) => {
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
              {/* Photo 1: Primary Coach / Route */}
              <img
                src={route.primaryImage}
                alt={route.primaryLabel}
                className={`full-card-bg-img ${isHovered ? 'bg-hidden' : 'bg-visible'}`}
                onError={(e) => handleImageError(e, route.primaryFallback)}
              />

              {/* Photo 2: Landmark / Cultural on Hover */}
              <img
                src={route.hoverImage}
                alt={route.hoverLabel}
                className={`full-card-bg-img bg-secondary ${isHovered ? 'bg-visible' : 'bg-hidden'}`}
                onError={(e) => handleImageError(e, route.hoverFallback)}
              />

              {/* Contrast Protection Dark Scrim Gradient */}
              <div className="full-card-scrim-gradient"></div>
            </div>

            {/* Foreground Content: Beautifully Placed ON TOP of the Image */}
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

                {/* Sub-Destinations Path */}
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
                    More Details
                  </Link>
                  <Link
                    href={route.bookingLink}
                    className="btn-card-primary"
                  >
                    {route.actionText || 'RESERVE SEAT'}
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
