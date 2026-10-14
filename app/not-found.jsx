import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '8rem 1.5rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#046bd2', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.75rem', color: '#0f172a', margin: '0.5rem 0 1rem' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', maxWidth: '480px', marginBottom: '2rem' }}>
        The route or timetable you were looking for could not be located.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home ➔
      </Link>
    </div>
  );
}
