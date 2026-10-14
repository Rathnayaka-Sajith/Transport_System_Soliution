'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const timetables = [
  {
    id: 'route-87-1',
    routeNo: 'Route 87',
    title: 'Moratuwa to Karainagar',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    stops: [
      { time: '7.30 PM', name: 'Soysapura', type: 'Departure' },
      { time: '8.30 PM', name: 'Wellawatta', type: 'Boarding' },
      { time: '8.45 PM', name: 'Pettah', type: 'Main Station' },
      { time: '3.00 AM', name: 'Jaffna Town', type: 'Drop-off' },
      { time: '4.30 AM', name: 'Karainagar', type: 'Final Destination' },
    ],
  },
  {
    id: 'route-87-2',
    routeNo: 'Route 87',
    title: 'Karainagar to Moratuwa',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    stops: [
      { time: '6.30 PM', name: 'Karainagar', type: 'Departure' },
      { time: '8.30 PM', name: 'Jaffna Bus Stand', type: 'Boarding' },
      { time: '2.45 AM', name: 'Pettah', type: 'Arrival' },
      { time: '3.00 AM', name: 'Wellawatta', type: 'Arrival' },
      { time: '3.20 AM', name: 'Soysapura', type: 'Final Destination' },
    ],
  },
  {
    id: 'route-87-3',
    routeNo: 'Route 87',
    title: 'Moratuwa to Point Pedro (via Palaly)',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    stops: [
      { time: '8.00 PM', name: 'Soysapura', type: 'Departure' },
      { time: '9.00 PM', name: 'Wellawatta', type: 'Boarding' },
      { time: '9.15 PM', name: 'Pettah', type: 'Main Station' },
      { time: '3.30 AM', name: 'Jaffna Town', type: 'Drop-off' },
      { time: '4.20 AM', name: 'Point Pedro', type: 'Final Destination' },
    ],
  },
  {
    id: 'route-87-4',
    routeNo: 'Route 87',
    title: 'Point Pedro to Moratuwa (via Palaly)',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    stops: [
      { time: '7.20 PM', name: 'Point Pedro', type: 'Departure' },
      { time: '9.00 PM', name: 'Jaffna Bus Stand', type: 'Boarding' },
      { time: '3.15 AM', name: 'Pettah', type: 'Arrival' },
      { time: '3.30 AM', name: 'Wellawatta', type: 'Arrival' },
      { time: '3.40 AM', name: 'Soysapura', type: 'Final Destination' },
    ],
  },
  {
    id: 'route-87-5',
    routeNo: 'Route 87',
    title: 'Moratuwa to Point Pedro (via Kopay)',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    stops: [
      { time: '9.00 PM', name: 'Soysapura', type: 'Departure' },
      { time: '10.00 PM', name: 'Wellawatta', type: 'Boarding' },
      { time: '10.15 PM', name: 'Pettah', type: 'Main Station' },
      { time: '4.30 AM', name: 'Jaffna Town', type: 'Drop-off' },
      { time: '5.10 AM', name: 'Point Pedro', type: 'Final Destination' },
    ],
  },
  {
    id: 'route-87-6',
    routeNo: 'Route 87',
    title: 'Moratuwa to Jaffna (via Kodikamam)',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    stops: [
      { time: '8.30 PM', name: 'Soysapura', type: 'Departure' },
      { time: '9.30 PM', name: 'Wellawatta', type: 'Boarding' },
      { time: '9.45 PM', name: 'Pettah', type: 'Main Station' },
      { time: '4.00 AM', name: 'Point Pedro', type: 'Drop-off' },
      { time: '4.45 AM', name: 'Jaffna Town', type: 'Final Destination' },
    ],
  },
  {
    id: 'route-15',
    routeNo: 'Route 15',
    title: 'Panadura to Kankesanthurai (via Dambulla)',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    stops: [
      { time: '8.30 PM', name: 'Panadura', type: 'Departure' },
      { time: '10.15 PM', name: 'Pettah', type: 'Boarding' },
      { time: '12.00 AM', name: 'Kurunegala', type: 'Transit Stop' },
      { time: '4.30 AM', name: 'Jaffna', type: 'Drop-off' },
      { time: '5.00 AM', name: 'Kankesanthurai', type: 'Final Destination' },
    ],
  },
  {
    id: 'route-ex01',
    routeNo: 'EX 01 74/31-2',
    title: 'Makumbura to Badulla / Ella (Expressway)',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    hasTwoDepartures: true,
    stops: [
      { time: '10.30 AM / 5.30 PM', name: 'Makumbura MMC', type: 'Departure' },
      { time: '12.30 PM / 7.30 PM', name: 'Mattala', type: 'Expressway Exit' },
      { time: '1.40 PM / 8.25 PM', name: 'Wellawaya', type: 'Boarding' },
      { time: '2.20 PM / 8.55 PM', name: 'Ella', type: 'Tourism Stop' },
      { time: '3.00 PM / 9.30 PM', name: 'Badulla', type: 'Final Station' },
    ],
  },
  {
    id: 'route-99',
    routeNo: 'Route 99',
    title: 'Colombo to Passara',
    type: 'super luxury',
    badgeText: 'Super Luxury - Daily',
    bookingLink: '/#booking',
    stops: [
      { time: '12.45 AM', name: 'Colombo', type: 'Departure' },
      { time: '1.15 AM', name: 'Homagama', type: 'Boarding' },
      { time: '5.15 AM', name: 'Bandarawela', type: 'Drop-off' },
      { time: '6.00 AM', name: 'Badulla', type: 'Drop-off' },
      { time: '6.45 AM', name: 'Passara', type: 'Final Destination' },
    ],
  },
  {
    id: 'route-17',
    routeNo: 'Route 17',
    title: 'Panadura to Kandy (Normal Daily Service)',
    type: 'normal',
    badgeText: 'Normal Service - 12+ Departures',
    contactUrl: '/contact-us',
    isNormalTable: true,
  },
];

export default function TimetableList() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = timetables.filter((t) => {
    const text = `${t.routeNo} ${t.title} ${t.type}`.toLowerCase();
    const matchesSearch = !search || text.includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type.includes(filterType);
    return matchesSearch && matchesType;
  });

  return (
    <>
      <div className="timetables-filter-bar">
        <div>
          <label className="form-label" htmlFor="timetableSearch">Search Route / Town</label>
          <input
            type="text"
            id="timetableSearch"
            className="form-control"
            placeholder="Search by route, city, e.g. Jaffna, Badulla, Passara, 87..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="timetableTypeFilter">Service Type</label>
          <select
            id="timetableTypeFilter"
            className="form-control"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Service Types</option>
            <option value="super luxury">Super Luxury</option>
            <option value="normal">Normal Service</option>
          </select>
        </div>
        <div>
          <label className="form-label">Sort</label>
          <select className="form-control">
            <option>Route Number (Asc)</option>
            <option>Departure Time</option>
          </select>
        </div>
        <div>
          <Link
            href="/#booking"
            className="btn btn-primary"
            style={{ height: '48px', marginTop: '1.5rem' }}
          >
            Instant Seat Booking ➔
          </Link>
        </div>
      </div>

      <div id="timetableList">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="timetable-card"
            data-type={item.type}
            id={item.id}
          >
            <div className="timetable-card-header">
              <div className="route-badge-title">
                <span className="badge-route">{item.routeNo}</span>
                <h3 style={{ fontSize: '1.35rem', margin: 0, color: '#0f172a' }}>{item.title}</h3>
                <span className={`badge ${item.type.includes('super') ? 'badge-super-luxury' : 'badge-normal'}`}>
                  {item.badgeText}
                </span>
              </div>
              <div>
                {item.bookingLink && !item.hasTwoDepartures && (
                  <Link
                    href={item.bookingLink}
                    className="btn btn-primary btn-sm"
                  >
                    Reserve Seats ➔
                  </Link>
                )}
                {item.hasTwoDepartures && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      href={item.bookingLink}
                      className="btn btn-primary btn-sm"
                    >
                      Book 10.30 AM ➔
                    </Link>
                    <Link
                      href={item.bookingLink}
                      className="btn btn-primary btn-sm"
                    >
                      Book 5.30 PM ➔
                    </Link>
                  </div>
                )}
                {item.isNormalTable && (
                  <Link href="/contact-us" className="btn btn-outline btn-sm">
                    Inquire Hotline ➔
                  </Link>
                )}
              </div>
            </div>

            {item.stops && (
              <div className="stops-timeline">
                {item.stops.map((stop, sIdx) => (
                  <div key={sIdx} className="stop-point">
                    <span className="stop-time">{stop.time}</span>
                    <span className="stop-name">{stop.name}</span>
                    <span className="stop-type">{stop.type}</span>
                  </div>
                ))}
              </div>
            )}

            {item.isNormalTable && (
              <>
                <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: '1rem' }}>
                  Full day continuous departures linking Panadura, Moratuwa, Colombo, Kadawatha, Warakapola, and Kandy:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px' }}>
                  <div><strong>03:30 AM</strong> ➔ Arr: 07:20 AM</div>
                  <div><strong>04:00 AM</strong> ➔ Arr: 07:50 AM</div>
                  <div><strong>04:30 AM</strong> ➔ Arr: 08:15 AM</div>
                  <div><strong>04:50 AM</strong> ➔ Arr: 08:45 AM</div>
                  <div><strong>05:15 AM</strong> ➔ Arr: 09:30 AM</div>
                  <div><strong>05:40 AM</strong> ➔ Arr: 09:40 AM</div>
                  <div><strong>06:15 AM</strong> ➔ Arr: 10:10 AM</div>
                  <div><strong>07:00 AM</strong> ➔ Arr: 10:50 AM</div>
                  <div><strong>07:30 AM</strong> ➔ Arr: 11:20 AM</div>
                  <div><strong>08:10 AM</strong> ➔ Arr: 01:00 PM</div>
                  <div><strong>08:30 AM</strong> ➔ Arr: 01:40 PM</div>
                  <div><strong>09:50 AM</strong> ➔ Arr: 03:15 PM</div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
