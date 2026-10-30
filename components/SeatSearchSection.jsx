'use client';

import React, { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import { CITIES, BUS_ROUTES } from '@/data/busRoutes';

export default function SeatSearchSection() {
  const router = useRouter();

  // Form states
  const [fromCity, setFromCity] = useState('Colombo');
  const [toCity, setToCity] = useState('Jaffna');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);

  // Search Results state
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Filter matching buses
    const matches = BUS_ROUTES.filter((b) => {
      const matchFrom = b.from.toLowerCase() === fromCity.toLowerCase() ||
        b.route.toLowerCase().includes(fromCity.toLowerCase());
      const matchTo = b.to.toLowerCase() === toCity.toLowerCase() ||
        b.route.toLowerCase().includes(toCity.toLowerCase());
      return matchFrom && matchTo;
    });

    // If exact pair found use it, otherwise show closest matching departures or fallback
    if (matches.length > 0) {
      setSearchResults(matches);
    } else {
      const fallbackMatches = BUS_ROUTES.filter((b) =>
        b.from.toLowerCase() === fromCity.toLowerCase() ||
        b.to.toLowerCase() === toCity.toLowerCase()
      );
      setSearchResults(fallbackMatches.length > 0 ? fallbackMatches : BUS_ROUTES.slice(0, 3));
    }

    setHasSearched(true);
  };

  const handleBookSeat = (bus) => {
    const query = new URLSearchParams({
      busId: bus.id,
      from: fromCity,
      to: toCity,
      date: date,
      passengers: passengers.toString(),
    });
    router.push(`/pay-for-booking?${query.toString()}`);
  };

  return (
    <div className="seat-search-wrapper">
      {/* Clean, Flat Modern Search Bar (No Liquid, No Glass, No Dark Background) */}
      <div className="clean-search-card">
        <form onSubmit={handleSearch} className="clean-search-form">
          {/* FROM ORIGIN */}
          <div className="clean-input-group">
            <label className="clean-input-label" htmlFor="search-origin">
              <span className="label-icon">📍</span>
              <span>From (Origin)</span>
            </label>
            <select
              id="search-origin"
              className="clean-select"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              required
            >
              {CITIES.map((c) => (
                <option key={`from-${c.value}`} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* SWAP ICON DECORATION */}
          <div className="clean-search-arrow" aria-hidden="true">
            ⇄
          </div>

          {/* TO DESTINATION */}
          <div className="clean-input-group">
            <label className="clean-input-label" htmlFor="search-destination">
              <span className="label-icon">🏁</span>
              <span>To (Destination)</span>
            </label>
            <select
              id="search-destination"
              className="clean-select"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              required
            >
              {CITIES.map((c) => (
                <option key={`to-${c.value}`} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* JOURNEY DATE */}
          <div className="clean-input-group">
            <label className="clean-input-label" htmlFor="search-date">
              <span className="label-icon">📅</span>
              <span>Journey Date</span>
            </label>
            <input
              id="search-date"
              type="date"
              className="clean-input"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* PASSENGERS */}
          <div className="clean-input-group">
            <label className="clean-input-label" htmlFor="search-passengers">
              <span className="label-icon">👥</span>
              <span>Passengers</span>
            </label>
            <select
              id="search-passengers"
              className="clean-select"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
            >
              <option value={1}>1 Passenger</option>
              <option value={2}>2 Passengers</option>
              <option value={3}>3 Passengers</option>
              <option value={4}>4 Passengers</option>
              <option value={5}>5 Passengers</option>
            </select>
          </div>

          {/* SEARCH BUTTON */}
          <div className="clean-btn-group">
            <button type="submit" className="btn-clean-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>Search Buses</span>
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH RESULTS SECTION (Shown directly below the search bar) */}
      {hasSearched && (
        <div className="search-results-container">
          <div className="results-header-bar">
            <div>
              <h3 className="results-title">
                Available Departures for {fromCity} ➔ {toCity}
              </h3>
              <p className="results-subtitle">
                Travel Date: <strong>{new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong> • Passengers: <strong>{passengers}</strong>
              </p>
            </div>
            <span className="results-count-badge">
              {searchResults.length} Coaches Found
            </span>
          </div>

          <div className="bus-results-list">
            {searchResults.map((bus) => {
              const availableCount = bus.totalSeats - bus.reservedSeats.length;

              return (
                <div key={bus.id} className="bus-result-card">
                  {/* Left: Bus Title, Route & Timing */}
                  <div className="bus-info-col">
                    <div className="bus-badges-row">
                      <span className="bus-badge-type">{bus.type}</span>
                      <span className="bus-badge-route">{bus.routeNo}</span>
                      <span className="bus-badge-model">{bus.busModel}</span>
                    </div>

                    <h4 className="bus-name-title">{bus.busName}</h4>
                    <span className="bus-route-path">{bus.route}</span>

                    {/* Departure / Arrival timeline */}
                    <div className="bus-timing-row">
                      <div className="time-block">
                        <span className="time-label">Departure</span>
                        <span className="time-val">{bus.departure}</span>
                      </div>
                      <div className="time-arrow-block">
                        <span className="duration-pill">{bus.duration}</span>
                        <span className="timeline-arrow">➔</span>
                      </div>
                      <div className="time-block">
                        <span className="time-label">Est. Arrival</span>
                        <span className="time-val">{bus.arrival}</span>
                      </div>
                    </div>

                    {/* Amenities tags */}
                    <div className="amenities-row">
                      {bus.amenities.map((item, i) => (
                        <span key={i} className="amenity-chip">✓ {item}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Price & Book Seat Action */}
                  <div className="bus-action-col">
                    <div className="seats-availability-pill">
                      <span className="seat-dot"></span>
                      <span><strong>{availableCount}</strong> Seats Available</span>
                    </div>

                    <div className="price-tag-wrap">
                      <span className="fare-label">Fare Per Seat</span>
                      <span className="fare-amount">{bus.fare}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-select-seats"
                      onClick={() => handleBookSeat(bus)}
                    >
                      <span>Book Seat</span>
                      <span className="btn-arrow">➔</span>
                    </button>
                    <span className="instant-confirm-note">⚡ Instant Ticket Confirmation</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
