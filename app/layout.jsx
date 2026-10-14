import React from 'react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Sri Lanka's Best Public Transport | PNG Express",
  description: "PNG Express has emerged as a leading people mobility company in Sri Lanka, boasting a comprehensive fleet ranging from Super luxury to Normal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
