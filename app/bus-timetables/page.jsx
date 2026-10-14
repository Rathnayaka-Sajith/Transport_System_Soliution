import React from 'react';
import TimetableList from '@/components/TimetableList';

export const metadata = {
  title: "PNG Express Bus Timetables / Schedules | Plan your journey!",
  description: "Find up-to-date bus timetables, routes, and schedules for convenient and reliable travel across Sri Lanka. Check now for seamless trip planning.",
};

export default function BusTimetablesPage() {
  return (
    <>
      {/* Page Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0b1329, #1e293b)', color: '#ffffff', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-subtitle" style={{ color: '#38bdf8' }}>Official Schedules &amp; Departures</span>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 3.8vw, 3.25rem)', marginBottom: '0.75rem' }}>PNG Express Bus Timetables</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
            Timetables / Schedules of all PNG Express bus routes. The following schedules may be subject to minor adjustments due to road conditions, weather, or regulatory changes.
          </p>
        </div>
      </section>

      {/* Timetables Interactive Content */}
      <section className="section">
        <div className="container">
          <TimetableList />
        </div>
      </section>
    </>
  );
}
