'use client';

import React from 'react';

export default function GlobalError({ error, reset }) {
  return (
    <div style={{ textAlign: 'center', padding: '8rem 1.5rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#e11d48', margin: 0 }}>Error</h1>
      <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '0.5rem 0 1rem' }}>Something went wrong!</h2>
      <p style={{ color: '#64748b', maxWidth: '480px', marginBottom: '2rem' }}>
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="btn btn-primary"
      >
        Try Again ➔
      </button>
    </div>
  );
}
