'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function BookingWidget({ onClose, initialMode = 'seats', onModeChange }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialMode);

  // Sync when parent mode changes
  useEffect(() => {
    if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (onModeChange) onModeChange(tab);
  };

  // --- Mode 1: Seat Booking State ---
  const [fromCity, setFromCity] = useState('Colombo');
  const [toCity, setToCity] = useState('Jaffna');
  const [date, setDate] = useState('2026-10-28');
  const [passengers, setPassengers] = useState(1);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerNic, setPassengerNic] = useState('');
  const [boardingPoint, setBoardingPoint] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Mode 2: Entire Bus for Trip Booking State ---
  const [charterStartPoint, setCharterStartPoint] = useState('Colombo');
  const [charterEndPoint, setCharterEndPoint] = useState('Nuwara Eliya');
  const [charterCategory, setCharterCategory] = useState('super-luxury');
  const [charterTripDate, setCharterTripDate] = useState('2026-11-05');
  const [charterPassengers, setCharterPassengers] = useState(40);
  const [charterModalOpen, setCharterModalOpen] = useState(false);
  const [charterQuote, setCharterQuote] = useState(null);
  const [charterName, setCharterName] = useState('');
  const [charterPhone, setCharterPhone] = useState('');
  const [charterNotes, setCharterNotes] = useState('');
  const [charterConfirmed, setCharterConfirmed] = useState(null);
  const [isCharterSubmitting, setIsCharterSubmitting] = useState(false);

  const getCategoryDetails = (cat) => {
    switch (cat) {
      case 'super-luxury':
        return { name: 'Super Luxury Coach (45 Seats)', features: 'Full Climate AC, Ergonomic Recline, USB Fast Charging, TV/Audio', baseFare: 68000 };
      case 'luxury':
        return { name: 'Luxury Coach (33 Seats)', features: 'Full AC, High Back Recline, Spacious Legroom', baseFare: 54000 };
      case 'semi-luxury':
        return { name: 'Semi-Luxury Coach (29 Seats)', features: 'High Back Comfort Seats, Overhead Luggage, PA System', baseFare: 44000 };
      case 'mini-coach':
        return { name: 'Mini Coach (20 Seats)', features: 'AC Compact Tourer, Ideal for Family & Corporate Groups', baseFare: 36000 };
      case 'normal':
        return { name: 'Normal Standard Coach (49 Seats)', features: 'Spacious Group Transit, High Capacity, Economical', baseFare: 40000 };
      default:
        return { name: 'Super Luxury Coach', features: 'Full Climate AC, Recline, USB', baseFare: 60000 };
    }
  };

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
    const query = new URLSearchParams({
      busId: bus.id,
      from: fromCity,
      to: toCity,
      date: date,
      passengers: passengers.toString(),
    });
    router.push(`/pay-for-booking?${query.toString()}`);
  };

  const toggleSeat = (seatNum) => {
    if (!selectedBus) return;
    const isAvailable = selectedBus.availableSeats.includes(seatNum);
    if (!isAvailable) return;

    if (selectedSeats.includes(seatNum)) {
      if (selectedSeats.length === 1) return;
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

  // --- Entire Bus Charter Handlers ---
  const handleCharterSubmit = (e) => {
    e.preventDefault();
    const details = getCategoryDetails(charterCategory);
    setCharterQuote({
      startPoint: charterStartPoint,
      endPoint: charterEndPoint,
      category: charterCategory,
      categoryName: details.name,
      features: details.features,
      fare: details.baseFare,
      tripDate: charterTripDate,
      passengers: charterPassengers,
    });
    setCharterModalOpen(true);
    setCharterConfirmed(null);
  };

  const handleConfirmCharter = (e) => {
    e.preventDefault();
    if (!charterName || !charterPhone) return;

    setIsCharterSubmitting(true);
    setTimeout(() => {
      setIsCharterSubmitting(false);
      const ref = 'PNG-TRIP-' + Math.floor(10000 + Math.random() * 90000);
      setCharterConfirmed({
        ref: ref,
        name: charterName,
        phone: charterPhone,
        notes: charterNotes,
        quote: charterQuote,
        issuedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
    }, 1100);
  };

  const resetCharter = () => {
    setCharterModalOpen(false);
    setCharterConfirmed(null);
    setCharterName('');
    setCharterPhone('');
    setCharterNotes('');
  };

  return (
    <>
      {/* Search Widget Container (Transparent Liquid Glass Theme) */}
      <section className="booking-widget-wrapper" id="booking">
        <div className="booking-widget booking-widget-liquid-glass">
          <div className="booking-widget-header">
            <div className="booking-widget-title">
              {activeTab === 'seats' ? (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" className="glass-icon-glow">
                    <rect x="3" y="4" width="18" height="15" rx="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="7" cy="15" r="1.5" />
                    <circle cx="17" cy="15" r="1.5" />
                  </svg>
                  <span>In-House Online Ticket Reservation System</span>
                </>
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" className="glass-icon-glow">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="7" cy="18" r="1.5" />
                    <circle cx="17" cy="18" r="1.5" />
                    <path d="M2 11h20" />
                    <path d="M7 6v5" />
                    <path d="M12 6v5" />
                  </svg>
                  <span>Charter Bus for Trip • Exclusive Coach Hire</span>
                </>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="booking-tabs">
                <button
                  type="button"
                  className={`booking-tab-btn ${activeTab === 'seats' ? 'active' : ''}`}
                  onClick={() => handleTabSwitch('seats')}
                >
                  Book Seats
                </button>
                <button
                  type="button"
                  className={`booking-tab-btn ${activeTab === 'charter' ? 'active' : ''}`}
                  onClick={() => handleTabSwitch('charter')}
                >
                  Book Entire Bus for Trip
                </button>
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

          {/* TAB 1: BOOK REGULAR SEATS */}
          {activeTab === 'seats' && (
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
          )}

          {/* TAB 2: BOOK ENTIRE BUS FOR TRIP (CHARTER) */}
          {activeTab === 'charter' && (
            <form onSubmit={handleCharterSubmit} className="booking-form charter-booking-form">
              <div className="form-group">
                <label className="form-label" htmlFor="charterStart">Started Point</label>
                <select
                  id="charterStart"
                  className="form-control"
                  value={charterStartPoint}
                  onChange={(e) => setCharterStartPoint(e.target.value)}
                  required
                >
                  <option value="Colombo">Colombo / Pettah</option>
                  <option value="Panadura">Panadura / Kalutara</option>
                  <option value="Gampaha">Gampaha / Negombo</option>
                  <option value="Kandy">Kandy Central</option>
                  <option value="Galle">Galle / Matara</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Jaffna">Jaffna Town</option>
                  <option value="Other">Custom Location (Islandwide)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="charterEnd">End Point (Destination)</label>
                <select
                  id="charterEnd"
                  className="form-control"
                  value={charterEndPoint}
                  onChange={(e) => setCharterEndPoint(e.target.value)}
                  required
                >
                  <option value="Nuwara Eliya">Nuwara Eliya (Hill Country Tour)</option>
                  <option value="Ella">Ella / Badulla</option>
                  <option value="Kandy">Kandy / Peradeniya</option>
                  <option value="Sigiriya">Sigiriya / Dambulla</option>
                  <option value="Kataragama">Kataragama / Yala</option>
                  <option value="Jaffna">Jaffna Peninsula</option>
                  <option value="Trincomalee">Trincomalee / Nilaveli</option>
                  <option value="Anuradhapura">Anuradhapura Sacred City</option>
                  <option value="Other">Custom Destination (Islandwide)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="charterCategory">Seat Category</label>
                <select
                  id="charterCategory"
                  className="form-control"
                  value={charterCategory}
                  onChange={(e) => setCharterCategory(e.target.value)}
                  required
                >
                  <option value="super-luxury">Super Luxury (45 Seats • Full AC, Recline, USB)</option>
                  <option value="luxury">Luxury Coach (33 Seats • Full AC, Recline)</option>
                  <option value="semi-luxury">Semi-Luxury (29 Seats • High Back Comfort)</option>
                  <option value="mini-coach">Mini Coach (20 Seats • Compact Tourer)</option>
                  <option value="normal">Normal Coach (49 Seats • Economy Group)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="charterDate">Trip Date</label>
                <input
                  type="date"
                  id="charterDate"
                  className="form-control"
                  value={charterTripDate}
                  onChange={(e) => setCharterTripDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-charter-action" style={{ height: '48px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Book Entire Bus
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 1. Modal: Seat Search Results */}
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
                        <span className="badge badge-super-luxury">{bus.type}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#046bd2' }}>{bus.fare}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>per passenger</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.88rem', color: '#475569' }}>
                    <div>
                      <span>Departure: <strong>{bus.departure}</strong></span> &bull; <span>Arrival: <strong>{bus.arrival}</strong></span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => startSeatSelection(bus)}
                    >
                      Select Seats ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Modal: Interactive Seat Selection & Ticket Issuance */}
      <div
        className={`modal-backdrop ${selectedBus ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target.classList.contains('modal-backdrop')) setSelectedBus(null);
        }}
      >
        <div className="modal-box" style={{ maxWidth: '860px' }}>
          <button className="modal-close-btn" onClick={() => setSelectedBus(null)}>
            &times;
          </button>

          {!confirmedTicket ? (
            <div>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <span className="badge badge-super-luxury">{selectedBus?.type}</span>
                <h3 style={{ margin: '0.5rem 0 0.25rem', color: '#0f172a' }}>{selectedBus?.route}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                  Departure: <strong>{selectedBus?.departure}</strong> | Travel Date: <strong>{date}</strong>
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                {/* Visual Seat Layout */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.75rem' }}>Select Your Preferred Seat(s):</h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '0.65rem',
                      background: '#f8fafc',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                    }}
                  >
                    {Array.from({ length: selectedBus?.totalSeats || 40 }, (_, i) => i + 1).map((s) => {
                      const isAvail = selectedBus?.availableSeats.includes(s);
                      const isSel = selectedSeats.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={!isAvail}
                          onClick={() => toggleSeat(s)}
                          style={{
                            padding: '0.6rem 0.25rem',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: isAvail ? 'pointer' : 'not-allowed',
                            border: isSel ? '2px solid #046bd2' : '1px solid #cbd5e1',
                            background: isSel ? '#046bd2' : isAvail ? '#ffffff' : '#e2e8f0',
                            color: isSel ? '#ffffff' : isAvail ? '#0f172a' : '#94a3b8',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reservation Passenger Form */}
                <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="resName">Full Name *</label>
                    <input
                      type="text"
                      id="resName"
                      className="form-control"
                      placeholder="e.g. Priyantha Silva"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="resPhone">Mobile Phone *</label>
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
                    <label className="form-label" htmlFor="resBoarding">Boarding Point</label>
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
            /* Confirmed E-Ticket Voucher */
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.9rem', color: '#334155' }}>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>PASSENGER NAME</strong>
                    {confirmedTicket.name}
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>CONTACT PHONE</strong>
                    {confirmedTicket.phone}
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>DATE &amp; TIME</strong>
                    {confirmedTicket.date} at {confirmedTicket.bus.departure}
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>ASSIGNED SEAT(S)</strong>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#046bd2' }}>Seat {confirmedTicket.seats.join(', ')}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>TOTAL FARE PAID</strong>
                    <strong style={{ color: '#15803d', fontSize: '1.05rem' }}>LKR {confirmedTicket.totalFare.toLocaleString()}</strong>
                  </div>
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

      {/* 3. Modal: Entire Bus Charter Quote & Reservation */}
      <div
        className={`modal-backdrop ${charterModalOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target.classList.contains('modal-backdrop')) setCharterModalOpen(false);
        }}
      >
        <div className="modal-box" style={{ maxWidth: '820px' }}>
          <button className="modal-close-btn" onClick={() => setCharterModalOpen(false)}>
            &times;
          </button>

          {!charterConfirmed ? (
            <div>
              {/* Quote Overview Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Exclusive Private Coach Charter
                    </span>
                    <h3 style={{ margin: '0.25rem 0', color: '#064e3b', fontSize: '1.35rem' }}>
                      {charterQuote?.startPoint} ➔ {charterQuote?.endPoint}
                    </h3>
                    <p style={{ margin: 0, color: '#047857', fontSize: '0.9rem' }}>
                      Category: <strong>{charterQuote?.categoryName}</strong> | Travel Date: <strong>{charterQuote?.tripDate}</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>ESTIMATED TRIP PACKAGE</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#065f46' }}>
                      LKR {charterQuote?.fare?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#059669' }}>Includes coach, certified driver & fuel</div>
                  </div>
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#334155' }}>
                <strong style={{ color: '#0f172a' }}>Included Features:</strong> {charterQuote?.features} &bull; Highway Express Clearance &bull; 24/7 GPS Telematics Monitoring.
              </div>

              {/* Customer Booking Request Form */}
              <form onSubmit={handleConfirmCharter}>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '1rem' }}>
                  Enter Contact Details to Reserve This Bus:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="chName">Your Full Name *</label>
                    <input
                      type="text"
                      id="chName"
                      className="form-control"
                      placeholder="e.g. Kasun Jayawardena"
                      value={charterName}
                      onChange={(e) => setCharterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="chPhone">Contact Phone Number *</label>
                    <input
                      type="tel"
                      id="chPhone"
                      className="form-control"
                      placeholder="e.g. 077 456 7890"
                      value={charterPhone}
                      onChange={(e) => setCharterPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" htmlFor="chNotes">Trip Itinerary & Special Requirements (Optional)</label>
                  <textarea
                    id="chNotes"
                    className="form-control"
                    rows={3}
                    placeholder="E.g., 2-day round trip, 3 pickup locations in Colombo, return on Sunday night..."
                    value={charterNotes}
                    onChange={(e) => setCharterNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setCharterModalOpen(false)}
                  >
                    Back / Modify Details
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-charter-action"
                    disabled={isCharterSubmitting}
                  >
                    {isCharterSubmitting ? 'Confirming Charter...' : 'Submit Charter Reservation Request ➔'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Confirmed Charter Voucher */
            <div style={{ padding: '0.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.75rem' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#064e3b', margin: '0 0 0.25rem' }}>Bus Charter Reserved Successfully!</h3>
                <p style={{ color: '#047857', fontSize: '0.92rem', margin: 0 }}>
                  Your entire bus trip request has been recorded in our dispatch system.
                </p>
              </div>

              <div
                style={{
                  border: '2px dashed #059669',
                  borderRadius: '16px',
                  background: '#f0fdf4',
                  padding: '1.75rem',
                  position: 'relative',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #bbf7d0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>PNG Express Special Hires</span>
                    <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', color: '#064e3b' }}>
                      {charterConfirmed.quote.startPoint} ➔ {charterConfirmed.quote.endPoint}
                    </h4>
                    <span className="badge" style={{ background: '#d1fae5', color: '#065f46', marginTop: '0.35rem', display: 'inline-block' }}>
                      {charterConfirmed.quote.categoryName}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>CHARTER REF NO</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857', letterSpacing: '0.05em' }}>
                      {charterConfirmed.ref}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.9rem', color: '#14532d' }}>
                  <div>
                    <strong style={{ color: '#047857', display: 'block', fontSize: '0.78rem' }}>CLIENT NAME</strong>
                    {charterConfirmed.name}
                  </div>
                  <div>
                    <strong style={{ color: '#047857', display: 'block', fontSize: '0.78rem' }}>PRIMARY PHONE</strong>
                    {charterConfirmed.phone}
                  </div>
                  <div>
                    <strong style={{ color: '#047857', display: 'block', fontSize: '0.78rem' }}>TRAVEL DATE</strong>
                    {charterConfirmed.quote.tripDate}
                  </div>
                  <div>
                    <strong style={{ color: '#047857', display: 'block', fontSize: '0.78rem' }}>ESTIMATED PACKAGE</strong>
                    <strong>LKR {charterConfirmed.quote.fare.toLocaleString()}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#dcfce7', borderRadius: '8px', fontSize: '0.85rem', color: '#166534' }}>
                  📞 <strong>Direct Charter Dispatch Lines:</strong> 074 289 3612 / 074 381 9631 (Our Special Hires Manager will call within 15 minutes).
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => window.print()}
                >
                  🖨️ Print Quotation
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-charter-action"
                  onClick={resetCharter}
                >
                  Done / Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
