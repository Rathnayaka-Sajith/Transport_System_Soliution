'use client';

import React, { useState } from 'react';

export default function SpecialHireForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      e.target.reset();
      setTimeout(() => setSubmitted(false), 6000);
    }, 1000);
  };

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.08)', padding: '3rem', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="section-subtitle">Charter Reservations</span>
        <h2 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>Book a Bus for Special Hire</h2>
        <p style={{ color: '#64748b' }}>
          Planning a corporate getaway, school trip, pilgrimage, or event? Request a personalized quote from our Special Hires division. Direct lines: <strong>074 289 3612 / 074 381 9631</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="hireName">Your Full Name</label>
          <input type="text" id="hireName" className="form-control" placeholder="e.g. Priyantha Silva" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hirePhone">Contact Phone Number</label>
          <input type="tel" id="hirePhone" className="form-control" placeholder="e.g. 077 123 4567" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hireEmail">Email Address</label>
          <input type="email" id="hireEmail" className="form-control" placeholder="e.g. name@example.com" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hireCoachType">Bus Category</label>
          <select id="hireCoachType" className="form-control">
            <option value="super-luxury">Super Luxury (Full AC, Recline, TV, USB)</option>
            <option value="luxury">Luxury Coach</option>
            <option value="semi-luxury">Semi-Luxury Coach</option>
            <option value="normal">Normal Passenger Coach</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hireOrigin">Pickup Location</label>
          <input type="text" id="hireOrigin" className="form-control" placeholder="e.g. Colombo, Panadura, Gampaha" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hireDest">Destination</label>
          <input type="text" id="hireDest" className="form-control" placeholder="e.g. Nuwara Eliya, Jaffna, Kataragama" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hireDate">Departure Date</label>
          <input type="date" id="hireDate" className="form-control" defaultValue="2026-10-20" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hirePassengers">Expected Passenger Count</label>
          <input type="number" id="hirePassengers" className="form-control" placeholder="e.g. 45" min="10" max="60" required />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="hireMsg">Special Requests or Itinerary Details</label>
          <textarea id="hireMsg" className="form-control" rows={4} placeholder="Mention number of days, intermediate stops, luggage requirements..."></textarea>
        </div>

        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', maxWidth: '320px' }} disabled={loading}>
            {loading ? 'Submitting Request...' : 'Submit Special Hire Request ➔'}
          </button>
        </div>
      </form>

      {submitted && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', color: '#065f46', textAlign: 'center' }}>
          ✓ Thank you! Your Special Hire inquiry has been received. Our Special Hires Manager will call you shortly.
        </div>
      )}
    </div>
  );
}
