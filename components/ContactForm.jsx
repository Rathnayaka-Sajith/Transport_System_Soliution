'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      e.target.reset();
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="contact-card">
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>Send Us a Message</h3>
      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        Please feel free to reach out to us using the form below. We will get back to you promptly!
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" htmlFor="contactName">Your Name</label>
          <input type="text" id="contactName" className="form-control" placeholder="Enter your full name" required />
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" htmlFor="contactEmail">Your Email</label>
          <input type="email" id="contactEmail" className="form-control" placeholder="name@example.com" required />
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" htmlFor="contactSubject">Subject</label>
          <input type="text" id="contactSubject" className="form-control" placeholder="Ticket inquiry, special hire, timetable feedback..." required />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" htmlFor="contactMsg">Your Message</label>
          <textarea id="contactMsg" className="form-control" rows={5} placeholder="Write your message here..." required></textarea>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Sending Message...' : 'Send Message ➔'}
        </button>
      </form>

      {submitted && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', color: '#065f46', textAlign: 'center' }}>
          ✓ Thank you! Your message has been sent successfully. A PNG representative will contact you shortly.
        </div>
      )}
    </div>
  );
}
