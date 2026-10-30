'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BUS_ROUTES } from '@/data/busRoutes';

function PayForBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const busId = searchParams.get('busId') || 'b-87-1';
  const paramFrom = searchParams.get('from') || 'Colombo';
  const paramTo = searchParams.get('to') || 'Jaffna';
  const paramDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const paramPassengers = parseInt(searchParams.get('passengers') || '1', 10);

  // Find bus details
  const bus = BUS_ROUTES.find((b) => b.id === busId) || BUS_ROUTES[0];

  // Booking Flow Steps: 1 = Seat Selection & Passenger Info, 2 = Payment, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Selected seats state
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState(bus.boardingPoints[0] || 'Main Terminal');

  // Passenger Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nic, setNic] = useState('');
  const [email, setEmail] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  // Initialize with first available seat
  useEffect(() => {
    const firstAvail = [];
    for (let i = 1; i <= bus.totalSeats; i++) {
      if (!bus.reservedSeats.includes(i)) {
        firstAvail.push(i);
        if (firstAvail.length === paramPassengers) break;
      }
    }
    setSelectedSeats(firstAvail.length > 0 ? firstAvail : [2]);
  }, [bus, paramPassengers]);

  // Toggle seat selection
  const handleSeatClick = (seatNum) => {
    // Cannot select reserved seat
    if (bus.reservedSeats.includes(seatNum)) return;

    if (selectedSeats.includes(seatNum)) {
      if (selectedSeats.length === 1) {
        alert('Please keep at least 1 seat selected.');
        return;
      }
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
    } else {
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  // Step 1 -> Step 2 validation
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat on the bus layout.');
      return;
    }
    if (!name.trim()) {
      alert('Please enter passenger full name.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter mobile phone number for ticket SMS confirmation.');
      return;
    }

    // Scroll to top and switch to payment step
    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 2 -> Step 3 payment processing
  const handleFinalPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const ticketRef = 'PNG-BK' + Math.floor(100000 + Math.random() * 900000);
      const ticketData = {
        ref: ticketRef,
        busName: bus.busName,
        routeNo: bus.routeNo,
        route: `${paramFrom} ➔ ${paramTo}`,
        departure: bus.departure,
        arrival: bus.arrival,
        date: paramDate,
        seats: [...selectedSeats],
        boarding: boardingPoint,
        name: name,
        phone: phone,
        nic: nic || 'V-9984129',
        email: email || 'passenger@gmail.com',
        farePerSeat: bus.fareNum,
        totalFare: selectedSeats.length * bus.fareNum,
        paymentMethod: paymentMethod === 'card' ? 'Visa / MasterCard' : 'Magiya Pay / LankaPay',
        bookedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      setConfirmedTicket(ticketData);
      setCurrentStep(3);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 1400);
  };

  const totalFare = selectedSeats.length * bus.fareNum;

  // Generate bus seat rows (4 seats per row: A, B, aisle, C, D)
  const totalRows = Math.ceil(bus.totalSeats / 4);

  return (
    <div className="pay-booking-page">
      {/* Top Breadcrumb & Step Navigation */}
      <div className="booking-steps-bar">
        <div className="container steps-flex">
          <Link href="/destinations#seat-booking" className="btn-back-link">
            ← Back to Destinations
          </Link>

          <div className="checkout-step-pills">
            <div className={`step-pill ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              <span>Seat Selection &amp; Details</span>
            </div>
            <span className="step-divider">➔</span>
            <div className={`step-pill ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              <span>Payment Gateway</span>
            </div>
            <span className="step-divider">➔</span>
            <div className={`step-pill ${currentStep === 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span>Confirmed E-Ticket</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container booking-main-container">
        {/* STEP 1: DRAWED BUS SEATING LAYOUT & PASSENGER FORM */}
        {currentStep === 1 && (
          <div className="step-layout-grid">
            {/* Left Column: Drawed Bus Floor Plan */}
            <div className="bus-diagram-card">
              <div className="bus-diagram-header">
                <div>
                  <span className="bus-header-tag">{bus.routeNo} • {bus.type}</span>
                  <h2 className="bus-header-title">{bus.busName}</h2>
                  <p className="bus-header-route">
                    <strong>{paramFrom}</strong> ➔ <strong>{paramTo}</strong> • Departure: <strong>{bus.departure}</strong>
                  </p>
                </div>
                <div className="fare-badge-pill">
                  {bus.fare} <span className="per-seat">/ seat</span>
                </div>
              </div>

              {/* SEAT LEGEND (Available, Reserved, Selected, Isolated) */}
              <div className="seat-legend-bar">
                <div className="legend-item">
                  <div className="legend-box available-box"></div>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box selected-box">✓</div>
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box reserved-box">✕</div>
                  <span>Reserved</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box isolated-box">★</div>
                  <span>Isolated Single</span>
                </div>
              </div>

              {/* DRAWED BUS INTERIOR FLOOR PLAN */}
              <div className="drawed-bus-wrapper">
                {/* Front Cabin: Windshield, Steering Wheel & Entrance Door */}
                <div className="bus-cabin-front">
                  <div className="bus-door-indicator">
                    <span>🚪 ENTRANCE</span>
                  </div>
                  <div className="bus-driver-area">
                    <span className="steering-icon">☸</span>
                    <span className="driver-label">DRIVER CABIN</span>
                  </div>
                </div>

                {/* Seats Grid (Left Window, Left Aisle, [AISLE PATH], Right Aisle, Right Window) */}
                <div className="bus-seating-grid">
                  {Array.from({ length: totalRows }).map((_, rowIndex) => {
                    const seatA = rowIndex * 4 + 1;
                    const seatB = rowIndex * 4 + 2;
                    const seatC = rowIndex * 4 + 3;
                    const seatD = rowIndex * 4 + 4;

                    const renderSeat = (num) => {
                      if (num > bus.totalSeats) return <div key={num} className="seat-spacer"></div>;

                      const isReserved = bus.reservedSeats.includes(num);
                      const isSelected = selectedSeats.includes(num);
                      const isIsolated = bus.isolatedSeats && bus.isolatedSeats.includes(num);

                      let seatClass = 'bus-seat available';
                      if (isReserved) seatClass = 'bus-seat reserved';
                      if (isIsolated && !isReserved) seatClass = 'bus-seat isolated';
                      if (isSelected) seatClass = 'bus-seat selected';

                      return (
                        <button
                          key={num}
                          type="button"
                          className={seatClass}
                          disabled={isReserved}
                          onClick={() => handleSeatClick(num)}
                          title={`Seat ${num}: ${isReserved ? 'Reserved' : isSelected ? 'Selected' : 'Available'}`}
                        >
                          <span className="seat-num-text">{num}</span>
                          {isSelected && <span className="seat-check">✓</span>}
                          {isReserved && <span className="seat-lock">🔒</span>}
                          {isIsolated && !isReserved && !isSelected && <span className="seat-star">★</span>}
                        </button>
                      );
                    };

                    return (
                      <div key={rowIndex} className="bus-seat-row">
                        <div className="seat-pair left-pair">
                          {renderSeat(seatA)}
                          {renderSeat(seatB)}
                        </div>

                        {/* Central Walking Aisle */}
                        <div className="central-walking-aisle">
                          <span className="aisle-line"></span>
                        </div>

                        <div className="seat-pair right-pair">
                          {renderSeat(seatC)}
                          {renderSeat(seatD)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rear Bus Tail */}
                <div className="bus-rear-tail">
                  <span>EMERGENCY EXIT &amp; BACK RESTROOM</span>
                </div>
              </div>
            </div>

            {/* Right Column: Selection Summary & Passenger Details Form */}
            <div className="checkout-sidebar-card">
              <h3 className="sidebar-heading">Trip &amp; Passenger Details</h3>

              <div className="trip-summary-box">
                <div className="summary-row">
                  <span className="sum-label">Route:</span>
                  <span className="sum-val">{paramFrom} ➔ {paramTo}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Departure:</span>
                  <span className="sum-val">{bus.departure}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Travel Date:</span>
                  <span className="sum-val">
                    {new Date(paramDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="summary-row highlight-row">
                  <span className="sum-label">Selected Seats:</span>
                  <span className="sum-seats-tag">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                  </span>
                </div>
                <div className="summary-row total-row">
                  <span className="sum-label">Total Amount:</span>
                  <span className="sum-total">LKR {totalFare.toLocaleString()}</span>
                </div>
              </div>

              {/* Passenger Info Form */}
              <form onSubmit={handleProceedToPayment} className="passenger-entry-form">
                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="boardingSelect">Select Boarding Station *</label>
                  <select
                    id="boardingSelect"
                    className="checkout-input"
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                    required
                  >
                    {bus.boardingPoints.map((bp, i) => (
                      <option key={i} value={bp}>{bp}</option>
                    ))}
                  </select>
                </div>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="passName">Full Passenger Name *</label>
                  <input
                    id="passName"
                    type="text"
                    className="checkout-input"
                    placeholder="e.g. Kasun Perera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="passPhone">Mobile Phone (for SMS Ticket) *</label>
                  <input
                    id="passPhone"
                    type="tel"
                    className="checkout-input"
                    placeholder="077 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="passNic">National ID / Passport Number</label>
                  <input
                    id="passNic"
                    type="text"
                    className="checkout-input"
                    placeholder="e.g. 199012345678"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                  />
                </div>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="passEmail">Email Address (Optional)</label>
                  <input
                    id="passEmail"
                    type="email"
                    className="checkout-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-proceed-pay">
                  <span>Next: Proceed to Payment</span>
                  <span className="btn-arrow-icon">➔</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT SECTION */}
        {currentStep === 2 && (
          <div className="payment-step-wrapper">
            <div className="payment-grid">
              {/* Payment Form */}
              <div className="payment-card">
                <div className="payment-card-header">
                  <h2 className="payment-title">Secure Payment Gateway</h2>
                  <p className="payment-subtitle">
                    Select your preferred payment method to finalize your seat reservation.
                  </p>
                </div>

                {/* Payment Method Selector */}
                <div className="payment-method-selector">
                  <label className={`method-pill ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span className="method-icon">💳</span>
                    <span className="method-name">Credit / Debit Card</span>
                    <span className="card-logos">VISA • MC</span>
                  </label>

                  <label className={`method-pill ${paymentMethod === 'magiya' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payMethod"
                      value="magiya"
                      checked={paymentMethod === 'magiya'}
                      onChange={() => setPaymentMethod('magiya')}
                    />
                    <span className="method-icon">📱</span>
                    <span className="method-name">Magiya Pay / LankaPay</span>
                    <span className="wallet-pill">QR / eZ Cash</span>
                  </label>
                </div>

                <form onSubmit={handleFinalPayment} className="payment-gateway-form">
                  {paymentMethod === 'card' ? (
                    <div className="card-details-box">
                      <div className="checkout-form-group">
                        <label className="checkout-label" htmlFor="cardName">Cardholder Name</label>
                        <input
                          id="cardName"
                          type="text"
                          className="checkout-input"
                          placeholder="Name on card"
                          defaultValue={name}
                          required
                        />
                      </div>

                      <div className="checkout-form-group">
                        <label className="checkout-label" htmlFor="cardNum">Card Number</label>
                        <input
                          id="cardNum"
                          type="text"
                          className="checkout-input"
                          placeholder="•••• •••• •••• ••••"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div className="card-row-split">
                        <div className="checkout-form-group">
                          <label className="checkout-label" htmlFor="cardExp">Expiry Date</label>
                          <input
                            id="cardExp"
                            type="text"
                            className="checkout-input"
                            placeholder="MM / YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            required
                          />
                        </div>
                        <div className="checkout-form-group">
                          <label className="checkout-label" htmlFor="cardCvvInput">CVV / CVC</label>
                          <input
                            id="cardCvvInput"
                            type="password"
                            className="checkout-input"
                            placeholder="•••"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="security-notice-box">
                        <span className="lock-icon">🔒</span>
                        <span>256-bit Bank Grade SSL Encryption • Verified by Visa &amp; Mastercard Identity Check</span>
                      </div>
                    </div>
                  ) : (
                    <div className="magiya-pay-box">
                      <div className="magiya-qr-mock">
                        <div className="qr-box">📱 QR</div>
                        <div className="qr-instructions">
                          <h4>Scan to Pay via LankaPay / Magiya App</h4>
                          <p>Open your banking app or Magiya wallet and scan this code to complete transaction.</p>
                        </div>
                      </div>
                      <div className="checkout-form-group" style={{ marginTop: '1rem' }}>
                        <label className="checkout-label" htmlFor="magiyaPhone">Mobile Wallet Number</label>
                        <input
                          id="magiyaPhone"
                          type="tel"
                          className="checkout-input"
                          defaultValue={phone}
                          placeholder="077 123 4567"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="payment-actions-bar">
                    <button
                      type="button"
                      className="btn-back-seats"
                      onClick={() => setCurrentStep(1)}
                    >
                      ← Back to Seats
                    </button>

                    <button
                      type="submit"
                      className="btn-complete-pay"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span>Processing Payment...</span>
                      ) : (
                        <span>Pay LKR {totalFare.toLocaleString()} &amp; Confirm Booking</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Order Summary Column */}
              <div className="payment-summary-card">
                <h3 className="sidebar-heading">Order Summary</h3>

                <div className="order-items-list">
                  <div className="order-item">
                    <span className="item-title">{bus.busName}</span>
                    <span className="item-sub">{bus.route}</span>
                  </div>

                  <div className="order-detail-row">
                    <span>Date:</span>
                    <strong>{paramDate}</strong>
                  </div>
                  <div className="order-detail-row">
                    <span>Departure Time:</span>
                    <strong>{bus.departure}</strong>
                  </div>
                  <div className="order-detail-row">
                    <span>Boarding Terminal:</span>
                    <strong>{boardingPoint}</strong>
                  </div>
                  <div className="order-detail-row">
                    <span>Passenger Name:</span>
                    <strong>{name}</strong>
                  </div>
                  <div className="order-detail-row">
                    <span>Phone:</span>
                    <strong>{phone}</strong>
                  </div>

                  <div className="order-seats-highlight">
                    <span>Selected Seats:</span>
                    <span className="seat-badge-list">
                      {selectedSeats.map((s) => (
                        <span key={s} className="pill-seat">Seat {s}</span>
                      ))}
                    </span>
                  </div>

                  <div className="fare-calc-box">
                    <div className="calc-row">
                      <span>Base Fare ({selectedSeats.length} × LKR {bus.fareNum.toLocaleString()}):</span>
                      <span>LKR {totalFare.toLocaleString()}</span>
                    </div>
                    <div className="calc-row">
                      <span>Expressway Toll &amp; Processing:</span>
                      <span className="free-text">FREE</span>
                    </div>
                    <div className="calc-row final-total">
                      <span>Grand Total:</span>
                      <span className="amount-highlight">LKR {totalFare.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INSTANT E-TICKET CONFIRMATION */}
        {currentStep === 3 && confirmedTicket && (
          <div className="confirmation-wrapper">
            <div className="ticket-success-card">
              <div className="success-icon-badge">✓</div>
              <h1 className="success-heading">Seat Booking Confirmed!</h1>
              <p className="success-subtext">
                Your reservation is confirmed. An SMS and e-ticket receipt have been sent to <strong>{confirmedTicket.phone}</strong>.
              </p>

              {/* E-Ticket Voucher */}
              <div className="printable-e-ticket">
                <div className="ticket-top-strip">
                  <div className="ticket-brand">
                    <span className="ticket-logo-text">PNG EXPRESS</span>
                    <span className="ticket-tagline">SRI LANKA LUXURY TRANSIT</span>
                  </div>
                  <div className="ticket-ref-box">
                    <span className="ref-label">TICKET REFERENCE</span>
                    <span className="ref-code">{confirmedTicket.ref}</span>
                  </div>
                </div>

                <div className="ticket-body-grid">
                  <div className="ticket-col">
                    <span className="t-label">JOURNEY ROUTE</span>
                    <span className="t-val-route">{confirmedTicket.route}</span>
                    <span className="t-sub">{confirmedTicket.busName} ({confirmedTicket.routeNo})</span>
                  </div>

                  <div className="ticket-col">
                    <span className="t-label">BOARDING STATION</span>
                    <span className="t-val">{confirmedTicket.boarding}</span>
                    <span className="t-sub">Please arrive 15 minutes before departure</span>
                  </div>

                  <div className="ticket-col">
                    <span className="t-label">TRAVEL DATE &amp; TIME</span>
                    <span className="t-val">{confirmedTicket.date} at {confirmedTicket.departure}</span>
                    <span className="t-sub">Arrival approx {confirmedTicket.arrival}</span>
                  </div>

                  <div className="ticket-col">
                    <span className="t-label">CONFIRMED SEATS</span>
                    <span className="t-val-seats">
                      {confirmedTicket.seats.map((s) => `Seat ${s}`).join(', ')}
                    </span>
                    <span className="t-sub">{confirmedTicket.seats.length} Passenger(s)</span>
                  </div>

                  <div className="ticket-col">
                    <span className="t-label">PASSENGER DETAILS</span>
                    <span className="t-val">{confirmedTicket.name}</span>
                    <span className="t-sub">NIC: {confirmedTicket.nic} • Mobile: {confirmedTicket.phone}</span>
                  </div>

                  <div className="ticket-col">
                    <span className="t-label">TOTAL FARE PAID</span>
                    <span className="t-val-price">LKR {confirmedTicket.totalFare.toLocaleString()}</span>
                    <span className="t-sub">Paid via {confirmedTicket.paymentMethod}</span>
                  </div>
                </div>

                <div className="ticket-bottom-bar">
                  <div className="ticket-barcode-mock">
                    ||| | ||||| ||| |||| ||||| ||| ||||||| |||
                  </div>
                  <span className="boarding-guarantee-note">
                    🛡️ Official PNG Express Boarding Pass • Valid for Travel
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ticket-action-buttons">
                <button
                  type="button"
                  className="btn-print-ticket"
                  onClick={() => window.print()}
                >
                  🖨️ Print / Save Ticket
                </button>
                <Link href="/destinations" className="btn-return-destinations">
                  Return to Destinations Hub
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PayForBookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '6rem', textAlign: 'center' }}>Loading booking details...</div>}>
      <PayForBookingContent />
    </Suspense>
  );
}
