'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const availableRoutes = [
  {
    id: 'b-87-1',
    route: 'Colombo (Pettah) → Jaffna',
    routeNo: 'Route 87',
    type: 'Super Luxury - AC',
    departure: '08:30 PM',
    arrival: '04:30 AM',
    duration: '8h 00m',
    fareNum: 2400,
    fare: 'LKR 2,400',
    availableSeats: [2, 5, 6, 9, 10, 14, 15, 18, 21, 22, 27, 28, 33, 34],
    totalSeats: 40,
    boardingPoints: ['Pettah Central Bus Stand', 'Wellawatta Clock Tower', 'Soysapura Moratuwa'],
  },
  {
    id: 'b-99-1',
    route: 'Colombo → Passara',
    routeNo: 'Route 99',
    type: 'Super Luxury - AC',
    departure: '12:45 AM',
    arrival: '06:45 AM',
    duration: '6h 00m',
    fareNum: 2200,
    fare: 'LKR 2,200',
    availableSeats: [3, 4, 7, 8, 11, 16, 19, 20, 25, 31, 35, 36],
    totalSeats: 40,
    boardingPoints: ['Bastian Mawatha Pettah', 'Homagama Junction', 'Awissawella'],
  },
  {
    id: 'b-ex01-1',
    route: 'Makumbura MMC → Badulla & Ella',
    routeNo: 'EX 01 74/31-2',
    type: 'Super Luxury Express Highway',
    departure: '10:30 AM',
    arrival: '03:00 PM',
    duration: '4h 30m',
    fareNum: 2100,
    fare: 'LKR 2,100',
    availableSeats: [1, 2, 7, 8, 12, 13, 17, 18, 23, 24, 29, 30, 37, 38],
    totalSeats: 40,
    boardingPoints: ['Makumbura Multimodal Center (Bay 4)', 'Mattala Interchange', 'Wellawaya Town'],
  },
  {
    id: 'b-ex01-2',
    route: 'Makumbura MMC → Badulla & Ella',
    routeNo: 'EX 01 74/31-2',
    type: 'Super Luxury Express Highway',
    departure: '05:30 PM',
    arrival: '10:00 PM',
    duration: '4h 30m',
    fareNum: 2100,
    fare: 'LKR 2,100',
    availableSeats: [4, 5, 9, 10, 15, 19, 20, 26, 27, 32, 39],
    totalSeats: 40,
    boardingPoints: ['Makumbura Multimodal Center (Bay 4)', 'Mattala Interchange', 'Wellawaya Town'],
  },
  {
    id: 'b-15-1',
    route: 'Panadura → Kankesanthurai (KKS)',
    routeNo: 'Route 15',
    type: 'Super Luxury - AC',
    departure: '08:30 PM',
    arrival: '05:00 AM',
    duration: '8h 30m',
    fareNum: 2500,
    fare: 'LKR 2,500',
    availableSeats: [1, 2, 6, 7, 11, 12, 16, 21, 25, 26, 30, 35],
    totalSeats: 40,
    boardingPoints: ['Panadura Private Stand', 'Pettah', 'Kurunegala Transit Stop'],
  },
  {
    id: 'b-17-1',
    route: 'Panadura → Kandy',
    routeNo: 'Route 17',
    type: 'Normal Daily Service',
    departure: '05:40 AM',
    arrival: '09:40 AM',
    duration: '4h 00m',
    fareNum: 850,
    fare: 'LKR 850',
    availableSeats: [5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 22, 23, 24, 25, 30, 31, 32],
    totalSeats: 49,
    boardingPoints: ['Panadura Bus Stand', 'Moratuwa', 'Kadawatha Bus Stand'],
  },
];

export default function BookingWidget({ onClose }) {
  const [fromCity, setFromCity] = useState('Colombo');
  const [toCity, setToCity] = useState('Jaffna');
  const [date, setDate] = useState('2026-10-15');
  const [passengers, setPassengers] = useState(1);

  // Search Results Modal
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // In-App Seat Selection & Booking Engine
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerNic, setPassengerNic] = useState('');
  const [boardingPoint, setBoardingPoint] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    let matches = availableRoutes.filter(
      (b) =>
        b.route.toLowerCase().includes(fromCity.toLowerCase()) ||
        b.route.toLowerCase().includes(toCity.toLowerCase())
    );
    if (matches.length === 0) {
      matches = availableRoutes.slice(0, 3);
    }
    setSearchResults(matches);
    setResultsModalOpen(true);
  };

  const startSeatSelection = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([bus.availableSeats[0] || 1]);
    setBoardingPoint(bus.boardingPoints[0] || 'Main Terminal');
    setConfirmedTicket(null);
  };

  const toggleSeat = (seatNum) => {
    if (!selectedBus) return;
    const isAvailable = selectedBus.availableSeats.includes(seatNum);
    if (!isAvailable) return;

    if (selectedSeats.includes(seatNum)) {
      if (selectedSeats.length === 1) return; // Keep at least one selected
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
    } else {
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!passengerName || !passengerPhone) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const ticketRef = 'PNG-E' + Math.floor(100000 + Math.random() * 900000);
      setConfirmedTicket({
        ref: ticketRef,
        bus: selectedBus,
        date: date,
        seats: [...selectedSeats],
        totalFare: selectedSeats.length * selectedBus.fareNum,
        name: passengerName,
        phone: passengerPhone,
        nic: passengerNic || 'V/99812903',
        boarding: boardingPoint,
        paymentMethod: paymentMethod,
        issuedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
    }, 1200);
  };

  const resetBooking = () => {
    setSelectedBus(null);
    setSelectedSeats([]);
    setConfirmedTicket(null);
    setPassengerName('');
    setPassengerPhone('');
    setPassengerNic('');
  };

  return (
    <>
      {/* Search Widget Container (Transparent Liquid Glass Theme) */}
      <section className="booking-widget-wrapper" id="booking">
        <div className="booking-widget booking-widget-liquid-glass">
          <div className="booking-widget-header">
            <div className="booking-widget-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" className="glass-icon-glow">
                <rect x="3" y="4" width="18" height="15" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <circle cx="7" cy="15" r="1.5" />
                <circle cx="17" cy="15" r="1.5" />
              </svg>
              <span>In-House Online Ticket Reservation System</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="booking-tabs">
                <button type="button" className="booking-tab-btn active">Direct Booking</button>
                <Link href="/bus-timetables" className="booking-tab-btn">
                  Full Timetables
                </Link>
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="apple-glass-minimize-btn"
                  title="Minimize booking tab"
                  aria-label="Minimize"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="booking-form">
            <div className="form-group">
              <label className="form-label" htmlFor="searchFrom">From (Origin)</label>
              <select
                id="searchFrom"
                className="form-control"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                required
              >
                <option value="Colombo">Colombo / Pettah</option>
                <option value="Makumbura">Makumbura (Multimodal Center)</option>
                <option value="Panadura">Panadura</option>
                <option value="Moratuwa">Moratuwa / Soysapura</option>
                <option value="Jaffna">Jaffna Town</option>
                <option value="Badulla">Badulla</option>
                <option value="Passara">Passara</option>
                <option value="Kandy">Kandy</option>
                <option value="Point Pedro">Point Pedro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="searchTo">To (Destination)</label>
              <select
                id="searchTo"
                className="form-control"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                required
              >
                <option value="Jaffna">Jaffna (Route 87)</option>
                <option value="Badulla">Badulla / Ella (EX 01 Express)</option>
                <option value="Passara">Passara (Route 99)</option>
                <option value="Kankesanthurai">Kankesanthurai (Route 15)</option>
                <option value="Point Pedro">Point Pedro (via Kopay / Palaly)</option>
                <option value="Kandy">Kandy (Route 17)</option>
                <option value="Colombo">Colombo (Return)</option>
                <option value="Makumbura">Makumbura (Return)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="searchDate">Journey Date</label>
              <input
                type="date"
                id="searchDate"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="searchSeats">Passengers</label>
              <select
                id="searchSeats"
                className="form-control"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              >
                <option value={1}>1 Passenger</option>
                <option value={2}>2 Passengers</option>
                <option value={3}>3 Passengers</option>
                <option value={4}>4 Passengers</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '48px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search Schedules
            </button>
          </form>
        </div>
      </section>

      {/* 1. Modal: Search Results */}
      <div
        className={`modal-backdrop ${resultsModalOpen && !selectedBus ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target.classList.contains('modal-backdrop')) setResultsModalOpen(false);
        }}
      >
        <div className="modal-box" style={{ maxWidth: '780px' }}>
          <button className="modal-close-btn" onClick={() => setResultsModalOpen(false)}>
            &times;
          </button>
          <div>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#e0f2fe', borderRadius: '10px' }}>
              <h4 style={{ margin: 0, color: '#0369a1', fontSize: '1.1rem' }}>
                Available Coaches for {fromCity} → {toCity}
              </h4>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#0c4a6e' }}>
                Travel Date: <strong>{date}</strong> | Official In-House Booking Portal
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {searchResults.map((bus) => (
                <div
                  key={bus.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    background: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge-route" style={{ marginRight: '0.5rem' }}>{bus.routeNo}</span>
                      <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>{bus.route}</strong>
                      <div style={{ marginTop: '0.35rem' }}>
                        <span className={`badge ${bus.type.includes('Super') ? 'badge-super-luxury' : 'badge-normal'}`}>
                          {bus.type}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#046bd2' }}>{bus.fare}</div>
                      <small style={{ color: '#16a34a', fontWeight: 600 }}>{bus.availableSeats.length} seats available</small>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#475569', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    <div><strong>Departure:</strong> {bus.departure}</div>
                    <div><strong>Arrival:</strong> {bus.arrival}</div>
                    <div><strong>Duration:</strong> {bus.duration}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => startSeatSelection(bus)}
                    >
                      Select Seats &amp; Reserve ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Modal: In-App Interactive Seat Layout & Reservation Form */}
      <div
        className={`modal-backdrop ${selectedBus ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target.classList.contains('modal-backdrop')) resetBooking();
        }}
      >
        <div className="modal-box" style={{ maxWidth: confirmedTicket ? '650px' : '900px' }}>
          <button className="modal-close-btn" onClick={resetBooking}>
            &times;
          </button>

          {!confirmedTicket ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0f172a' }}>
                    {selectedBus?.route} ({selectedBus?.routeNo})
                  </h3>
                  <small style={{ color: '#64748b' }}>
                    Departure: {selectedBus?.departure} | Date: {date} | Fare: {selectedBus?.fare} / seat
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedBus(null)}
                >
                  ← Back to Buses
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '2rem' }}>
                {/* Visual Coach Seat Map */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Front (Driver Cabin)</span>
                    <span style={{ fontSize: '1.2rem' }}>💺</span>
                  </div>

                  {/* Seat Legend */}
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', marginBottom: '1rem', justifyContent: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '12px', height: '12px', background: '#ffffff', border: '1px solid #046bd2', borderRadius: '3px', display: 'inline-block' }}></span>
                      Available
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '12px', height: '12px', background: '#046bd2', borderRadius: '3px', display: 'inline-block' }}></span>
                      Selected
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '12px', height: '12px', background: '#cbd5e1', borderRadius: '3px', display: 'inline-block' }}></span>
                      Booked
                    </span>
                  </div>

                  {/* Seat Grid Layout (10 Rows of 4 Seats with Aisle) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr) 24px repeat(2, 1fr)', gap: '8px', alignItems: 'center' }}>
                    {Array.from({ length: 40 }, (_, i) => i + 1).map((seatNum) => {
                      const isAvailable = selectedBus?.availableSeats.includes(seatNum);
                      const isSelected = selectedSeats.includes(seatNum);

                      return (
                        <React.Fragment key={seatNum}>
                          {seatNum % 4 === 3 && <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.7rem' }}>•</div>}
                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => toggleSeat(seatNum)}
                            style={{
                              padding: '8px 4px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: isAvailable ? 'pointer' : 'not-allowed',
                              border: isSelected ? '2px solid #0352a1' : isAvailable ? '1px solid #046bd2' : '1px solid #cbd5e1',
                              background: isSelected ? '#046bd2' : isAvailable ? '#ffffff' : '#e2e8f0',
                              color: isSelected ? '#ffffff' : isAvailable ? '#0f172a' : '#94a3b8',
                              transition: 'all 0.15s ease',
                              textAlign: 'center',
                            }}
                          >
                            {seatNum}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Passenger Information & Confirmation Form */}
                <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                      Selected Seat(s): <strong>{selectedSeats.join(', ')}</strong> ({selectedSeats.length} seat)
                    </div>
                    <div style={{ fontSize: '1.15rem', color: '#15803d', fontWeight: 800, marginTop: '0.2rem' }}>
                      Total Fare: LKR {(selectedSeats.length * (selectedBus?.fareNum || 0)).toLocaleString()}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="resName">Full Name</label>
                    <input
                      type="text"
                      id="resName"
                      className="form-control"
                      placeholder="e.g. Sajith Rathnayaka"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="resPhone">Mobile Phone (for e-Ticket SMS)</label>
                    <input
                      type="tel"
                      id="resPhone"
                      className="form-control"
                      placeholder="e.g. 077 123 4567"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="resNic">NIC / Passport Number</label>
                    <input
                      type="text"
                      id="resNic"
                      className="form-control"
                      placeholder="e.g. 199512345678"
                      value={passengerNic}
                      onChange={(e) => setPassengerNic(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="resBoarding">Select Boarding Point</label>
                    <select
                      id="resBoarding"
                      className="form-control"
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                    >
                      {selectedBus?.boardingPoints.map((bp, idx) => (
                        <option key={idx} value={bp}>{bp}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #cbd5e1', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="radio"
                          name="pay"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                        />
                        Credit / Debit Card
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #cbd5e1', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="radio"
                          name="pay"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={() => setPaymentMethod('cash')}
                        />
                        Pay at Boarding
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Issuing Ticket...' : `Confirm & Issue Ticket (LKR ${(selectedSeats.length * (selectedBus?.fareNum || 0)).toLocaleString()}) ➔`}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* 3. Confirmed E-Ticket Voucher */
            <div style={{ padding: '0.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.75rem' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '0 0 0.25rem' }}>Reservation Confirmed!</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                  Your e-ticket has been generated successfully. Please present this reference code when boarding.
                </p>
              </div>

              {/* Digital Ticket Card */}
              <div
                style={{
                  border: '2px dashed #046bd2',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  padding: '1.75rem',
                  position: 'relative',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#046bd2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>PNG Express Sri Lanka</span>
                    <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', color: '#0f172a' }}>{confirmedTicket.bus.route}</h4>
                    <span className="badge badge-super-luxury" style={{ marginTop: '0.25rem' }}>{confirmedTicket.bus.type}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>E-TICKET REF</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#046bd2', letterSpacing: '0.05em' }}>{confirmedTicket.ref}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.9rem', color: '#334155', marginBottom: '1rem' }}>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>PASSENGER NAME</strong>
                    {confirmedTicket.name}
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>CONTACT PHONE</strong>
                    {confirmedTicket.phone}
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>JOURNEY DATE &amp; TIME</strong>
                    {confirmedTicket.date} at {confirmedTicket.bus.departure}
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>ASSIGNED SEAT(S)</strong>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#046bd2' }}>Seat {confirmedTicket.seats.join(', ')}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>BOARDING LOCATION</strong>
                    {confirmedTicket.boarding}
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>TOTAL FARE PAID</strong>
                    <strong style={{ color: '#15803d', fontSize: '1.05rem' }}>LKR {confirmedTicket.totalFare.toLocaleString()}</strong>
                  </div>
                </div>

                <div style={{ background: '#e0f2fe', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', fontSize: '0.82rem', color: '#0369a1' }}>
                  🔒 Verified System Ticket Ref: {confirmedTicket.ref} | Status: CONFIRMED
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => window.print()}
                >
                  🖨️ Print Ticket
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={resetBooking}
                >
                  Done / Book Another Route
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
