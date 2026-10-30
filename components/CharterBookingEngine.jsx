'use client';

import React, { useState } from 'react';

const FLEET_CATEGORIES = [
  {
    id: 'super-luxury',
    name: 'Super Luxury Coach',
    seats: '45 Reclining Seats',
    badge: 'Flagship Luxury',
    badgeColor: '#046bd2',
    ratePerKm: 280,
    baseFare: 68000,
    features: [
      'Full Dual-Zone Climate Control AC',
      'Plush Ergonomic Reclining Seats with Armrests',
      'Individual High-Speed USB Charging Ports',
      'Flat-Screen HD TV & Premium Audio System',
      'Large Underfloor Luggage Compartments',
      'Certified Senior Highway Captain & Assistant',
    ],
    idealFor: 'Executive Corporate Tours, Foreign Travelers & Long-Distance Express Journeys',
  },
  {
    id: 'luxury',
    name: 'Luxury Touring Coach',
    seats: '33 Reclining Seats',
    badge: 'Popular Choice',
    badgeColor: '#059669',
    ratePerKm: 240,
    baseFare: 54000,
    features: [
      'Full Cabin Air Conditioning',
      'High-Back Adjustable Reclining Seats',
      'On-Board PA & Microphone System',
      'Dedicated Baggage Bay',
      'Smooth Highway Air Suspension',
      'Experienced Tour Captain',
    ],
    idealFor: 'Family Vacations, University Excursions & Wedding Guest Transportation',
  },
  {
    id: 'semi-luxury',
    name: 'Semi-Luxury Coach',
    seats: '29 High-Back Seats',
    badge: 'Value Choice',
    badgeColor: '#d97706',
    ratePerKm: 200,
    baseFare: 44000,
    features: [
      'Cooling Ventilation & Tinted Privacy Glass',
      'Cushioned High-Back Seats with Headrests',
      'Overhead Parcel Racks',
      'Heavy-Duty Suspension for Hill Country',
      'Certified Professional Driver',
    ],
    idealFor: 'Pilgrimage Groups, School Excursions & Community Trips',
  },
  {
    id: 'mini-coach',
    name: 'Mini Touring Coach',
    seats: '20 Luxury Seats',
    badge: 'Compact Tourer',
    badgeColor: '#7c3aed',
    ratePerKm: 180,
    baseFare: 36000,
    features: [
      'Full Cabin Air Conditioning',
      'Compact Maneuverability for Narrow Hill Roads',
      'Comfort Reclining Seats',
      'Bluetooth Sound System',
      'Dedicated Driver',
    ],
    idealFor: 'Small Corporate Teams, Private Family Getaways & Airport Transfers',
  },
  {
    id: 'normal',
    name: 'Standard Capacity Bus',
    seats: '49 High-Capacity Seats',
    badge: 'High Capacity',
    badgeColor: '#475569',
    ratePerKm: 190,
    baseFare: 40000,
    features: [
      'Maximum Passenger Capacity (49 Passengers)',
      'Spacious Wide Aisle & High Ceiling',
      'Durable Fabric Cushioned Seats',
      'Economical Group Transportation',
      'Senior Commercial Driver',
    ],
    idealFor: 'Large Pilgrimages, Factory Outings & Budget Group Events',
  },
];

const POPULAR_DESTINATIONS = [
  { name: 'Nuwara Eliya (Little England)', estDist: 175, highlight: 'Tea Estates, Lake Gregory & Waterfalls' },
  { name: 'Ella & Badulla', estDist: 215, highlight: 'Nine Arches Bridge, Little Adam’s Peak & Demodara' },
  { name: 'Sigiriya & Dambulla', estDist: 165, highlight: 'Lion Rock Fortress, Cave Temples & Minneriya Safari' },
  { name: 'Kandy & Peradeniya', estDist: 115, highlight: 'Temple of the Tooth Relic, Botanical Gardens & Cultural Tour' },
  { name: 'Kataragama & Yala', estDist: 285, highlight: 'Sacred Devalaya, Kirinda Beach & National Park Safari' },
  { name: 'Jaffna & Point Pedro', estDist: 395, highlight: 'Nallur Kandaswamy Temple, Casuarina Beach & Northern Culture' },
  { name: 'Trincomalee & Nilaveli', estDist: 260, highlight: 'Koneswaram Temple, Marble Beach & Pigeon Island' },
  { name: 'Anuradhapura Sacred City', estDist: 205, highlight: 'Ruwanwelisaya, Jaya Sri Maha Bodhi & Ancient Heritage' },
];

export default function CharterBookingEngine() {
  const [startedPoint, setStartedPoint] = useState('Colombo');
  const [customStart, setCustomStart] = useState('');
  const [endPoint, setEndPoint] = useState('Nuwara Eliya');
  const [customEnd, setCustomEnd] = useState('');
  const [seatCategory, setSeatCategory] = useState('super-luxury');
  const [tripType, setTripType] = useState('round-trip'); // 'round-trip' | 'one-way'
  const [departureDate, setDepartureDate] = useState('2026-11-05');
  const [returnDate, setReturnDate] = useState('2026-11-07');
  const [passengersCount, setPassengersCount] = useState(40);
  const [tripNotes, setTripNotes] = useState('');

  // Contact Details
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Confirmation Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const selectedCategoryObj = FLEET_CATEGORIES.find((c) => c.id === seatCategory) || FLEET_CATEGORIES[0];

  // Dynamic Fare Calculation
  const calculateEstimatedFare = () => {
    let dist = 180;
    const destMatch = POPULAR_DESTINATIONS.find((d) => d.name.toLowerCase().includes(endPoint.toLowerCase()));
    if (destMatch) {
      dist = destMatch.estDist;
    }
    const totalDist = tripType === 'round-trip' ? dist * 2 : dist;
    const calculated = totalDist * selectedCategoryObj.ratePerKm + 15000; // includes driver allowances & tolls
    return Math.max(calculated, selectedCategoryObj.baseFare);
  };

  const estimatedFare = calculateEstimatedFare();

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Please enter your contact Name and Phone Number to complete the bus booking.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const refCode = 'PNG-TRIP-' + Math.floor(10000 + Math.random() * 90000);
      setConfirmationData({
        ref: refCode,
        clientName,
        clientPhone,
        clientEmail: clientEmail || 'Not specified',
        start: startedPoint === 'Custom' ? customStart : startedPoint,
        end: endPoint === 'Custom' ? customEnd : endPoint,
        category: selectedCategoryObj.name,
        seats: selectedCategoryObj.seats,
        tripType: tripType === 'round-trip' ? 'Round Trip Tour' : 'One-Way Transit',
        departureDate,
        returnDate: tripType === 'round-trip' ? returnDate : 'N/A',
        passengersCount,
        tripNotes: tripNotes || 'None',
        totalFare: estimatedFare,
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="charter-page-container">
      {!confirmationData ? (
        <form onSubmit={handleBookingSubmit} className="charter-booking-card">
          <div className="charter-card-header">
            <span className="section-subtitle">Exclusive Fleet Reservation</span>
            <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: '0.35rem 0' }}>
              Book an Entire Bus for Your Trip
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '640px', margin: '0 auto' }}>
              Select your pickup town, destination, and bus category to get an instant all-inclusive quotation and book your coach with PNG Express.
            </p>
          </div>

          {/* Step 1: Trip Route & Locations */}
          <div className="charter-section-block">
            <h3 className="charter-block-title">
              <span className="step-num">1</span> Pick Route Details
            </h3>

            <div className="charter-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="charterStart">
                  Started Point (Pickup Town) *
                </label>
                <select
                  id="charterStart"
                  className="form-control"
                  value={startedPoint}
                  onChange={(e) => setStartedPoint(e.target.value)}
                  required
                >
                  <option value="Colombo">Colombo (Pettah / Fort / Greater Colombo)</option>
                  <option value="Makumbura">Makumbura (Multimodal Center)</option>
                  <option value="Panadura">Panadura / Kalutara</option>
                  <option value="Gampaha">Gampaha / Negombo</option>
                  <option value="Kandy">Kandy Central & Peradeniya</option>
                  <option value="Galle">Galle / Matara / Southern Expressway</option>
                  <option value="Kurunegala">Kurunegala / Wayamba</option>
                  <option value="Jaffna">Jaffna Town / Northern Province</option>
                  <option value="Custom">Other (Custom Pickup Location)</option>
                </select>
                {startedPoint === 'Custom' && (
                  <input
                    type="text"
                    className="form-control"
                    style={{ marginTop: '0.5rem' }}
                    placeholder="Enter your exact pickup address or town"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="charterEnd">
                  End Point (Destination) *
                </label>
                <select
                  id="charterEnd"
                  className="form-control"
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  required
                >
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <option key={dest.name} value={dest.name}>
                      {dest.name} (~{dest.estDist} km)
                    </option>
                  ))}
                  <option value="Custom">Other (Custom Destination)</option>
                </select>
                {endPoint === 'Custom' && (
                  <input
                    type="text"
                    className="form-control"
                    style={{ marginTop: '0.5rem' }}
                    placeholder="Enter destination city, resort, or attraction"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Choose Seat Category */}
          <div className="charter-section-block">
            <h3 className="charter-block-title">
              <span className="step-num">2</span> Select Bus Seat Category *
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Choose the luxury level and seating capacity that best fits your passenger group:
            </p>

            <div className="fleet-category-selector-grid">
              {FLEET_CATEGORIES.map((cat) => {
                const isSelected = seatCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSeatCategory(cat.id)}
                    className={`fleet-card-option ${isSelected ? 'fleet-selected' : ''}`}
                  >
                    <div className="fleet-card-top">
                      <span className="fleet-badge" style={{ background: cat.badgeColor }}>
                        {cat.badge}
                      </span>
                      <strong className="fleet-seat-tag">{cat.seats}</strong>
                    </div>

                    <h4 className="fleet-card-name">{cat.name}</h4>
                    <p className="fleet-card-ideal">{cat.idealFor}</p>

                    <ul className="fleet-card-features">
                      {cat.features.slice(0, 3).map((f, i) => (
                        <li key={i}>✓ {f}</li>
                      ))}
                    </ul>

                    <div className="fleet-card-footer">
                      <span className="fleet-rate-text">
                        Starts from <strong>LKR {cat.baseFare.toLocaleString()}</strong>
                      </span>
                      <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Dates & Schedule */}
          <div className="charter-section-block">
            <h3 className="charter-block-title">
              <span className="step-num">3</span> Trip Dates & Passenger Count
            </h3>

            <div className="charter-grid-4">
              <div className="form-group">
                <label className="form-label">Trip Schedule Type</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setTripType('round-trip')}
                    className={`btn btn-sm ${tripType === 'round-trip' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                  >
                    Round Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('one-way')}
                    className={`btn btn-sm ${tripType === 'one-way' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                  >
                    One-Way
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="depDate">Departure Date *</label>
                <input
                  type="date"
                  id="depDate"
                  className="form-control"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </div>

              {tripType === 'round-trip' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="retDate">Return Date *</label>
                  <input
                    type="date"
                    id="retDate"
                    className="form-control"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="passengersCount">Expected Passengers</label>
                <input
                  type="number"
                  id="passengersCount"
                  className="form-control"
                  min="5"
                  max="60"
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 4: Contact Information */}
          <div className="charter-section-block">
            <h3 className="charter-block-title">
              <span className="step-num">4</span> Customer Contact Details
            </h3>

            <div className="charter-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="clientName">Your Full Name *</label>
                <input
                  type="text"
                  id="clientName"
                  className="form-control"
                  placeholder="e.g. Kasun Jayawardena"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="clientPhone">Contact Phone Number *</label>
                <input
                  type="tel"
                  id="clientPhone"
                  className="form-control"
                  placeholder="e.g. 077 123 4567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="clientEmail">Email Address (Optional)</label>
                <input
                  type="email"
                  id="clientEmail"
                  className="form-control"
                  placeholder="e.g. name@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label" htmlFor="tripNotes">
                Special Requests or Tour Itinerary (Optional)
              </label>
              <textarea
                id="tripNotes"
                className="form-control"
                rows={3}
                placeholder="Mention intermediate sightseeing stops, pickup locations, luggage requirements, or hotel drop-offs..."
                value={tripNotes}
                onChange={(e) => setTripNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Instant Quote & Submit Action */}
          <div className="charter-summary-bar">
            <div>
              <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                All-Inclusive Trip Estimate
              </span>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a' }}>
                LKR {estimatedFare.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Includes coach, commercial captain, fuel, and expressway highway toll clearances
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
              style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 800 }}
            >
              {isSubmitting ? 'Reserving Your Bus...' : 'Confirm Entire Bus Booking ➔'}
            </button>
          </div>
        </form>
      ) : (
        /* Confirmed Booking Voucher Card */
        <div className="charter-voucher-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="voucher-success-icon">✓</div>
            <h2 style={{ fontSize: '2.2rem', color: '#064e3b', margin: '0.5rem 0 0.25rem' }}>
              Entire Bus Trip Reserved Successfully!
            </h2>
            <p style={{ color: '#047857', fontSize: '1.05rem' }}>
              Your exclusive coach charter booking request has been confirmed in the PNG Express Fleet Dispatch system.
            </p>
          </div>

          <div className="charter-voucher-card">
            <div className="voucher-header">
              <div>
                <span className="voucher-brand">PNG EXPRESS SRI LANKA • SPECIAL HIRES</span>
                <h3 className="voucher-route">
                  {confirmationData.start} ➔ {confirmationData.end}
                </h3>
                <span className="badge badge-super-luxury" style={{ marginTop: '0.35rem' }}>
                  {confirmationData.category} ({confirmationData.seats})
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 800 }}>BOOKING REFERENCE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#047857', letterSpacing: '0.06em' }}>
                  {confirmationData.ref}
                </div>
              </div>
            </div>

            <div className="voucher-grid">
              <div>
                <span className="voucher-label">CLIENT NAME</span>
                <strong>{confirmationData.clientName}</strong>
              </div>
              <div>
                <span className="voucher-label">CONTACT PHONE</span>
                <strong>{confirmationData.clientPhone}</strong>
              </div>
              <div>
                <span className="voucher-label">TRIP SCHEDULE</span>
                <strong>{confirmationData.tripType}</strong>
              </div>
              <div>
                <span className="voucher-label">DEPARTURE DATE</span>
                <strong>{confirmationData.departureDate}</strong>
              </div>
              {confirmationData.returnDate !== 'N/A' && (
                <div>
                  <span className="voucher-label">RETURN DATE</span>
                  <strong>{confirmationData.returnDate}</strong>
                </div>
              )}
              <div>
                <span className="voucher-label">EXPECTED PASSENGERS</span>
                <strong>{confirmationData.passengersCount} Passengers</strong>
              </div>
              <div>
                <span className="voucher-label">ALL-INCLUSIVE ESTIMATE</span>
                <strong style={{ color: '#047857', fontSize: '1.2rem' }}>
                  LKR {confirmationData.totalFare.toLocaleString()}
                </strong>
              </div>
              <div>
                <span className="voucher-label">STATUS</span>
                <strong style={{ color: '#059669' }}>CONFIRMED / DISPATCH ASSIGNED</strong>
              </div>
            </div>

            {confirmationData.tripNotes !== 'None' && (
              <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.88rem', color: '#334155' }}>
                <strong>Itinerary / Special Notes:</strong> {confirmationData.tripNotes}
              </div>
            )}

            <div className="voucher-hotline-box">
              <span style={{ fontSize: '1.1rem' }}>📞</span>
              <div>
                <strong>Charter Dispatch Coordination:</strong> Our Special Hires Manager will call you within 15 minutes to verify vehicle allocation and driver details.
                <div style={{ marginTop: '0.25rem' }}>Direct Lines: <strong>074 289 3612</strong> / <strong>074 381 9631</strong></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => window.print()}
            >
              🖨️ Print Trip Confirmation
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => setConfirmationData(null)}
            >
              Book Another Bus / Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
