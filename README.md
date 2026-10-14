# PNG Express Sri Lanka - Self-Contained Web Platform

A 100% self-contained, independent transport system web application built with **Next.js 15 (App Router)** and **React 19**.

---

## 🚀 Architectural Highlights

1. **Independent Self-Contained Platform**:
   - **Zero External Dependencies / Links**: All external hyperlinks to third-party portals, external sister sites, social media links, and external map iframes have been removed.
   - All links route internally within the Next.js application.

2. **In-House Online Ticket Reservation System**:
   - Direct seat search across all major routes (Route 87 Colombo–Jaffna, Route 99 Colombo–Passara, EX 01 Makumbura–Badulla, Route 15 Panadura–KKS, Route 17 Panadura–Kandy).
   - **Interactive Visual Coach Seat Selector**: Real-time 40-seat coach layout with front cabin, central aisle, available/selected/booked indicators, and dynamic price calculation.
   - **Digital E-Ticket Issuance**: Generates instant e-ticket vouchers with unique reference codes (`PNG-EXXXXXX`), passenger names, assigned seat numbers, boarding locations, and print ticket support.

3. **Pure Slot Design System (No Images / Clean Picture Slots)**:
   - All pictures and image files have been removed from the platform.
   - Replaced by structured, responsive **[`ImageSlot`](file:///d:/transport_system/Transport_System_Soliution/components/ImageSlot.jsx)** containers indicating slot category, target aspect ratio, standard dimensions, and transport vector icons.
   - **Gallery Slots**: 20 filterable photo slots with full-screen slot lightbox inspector.
   - **Hero Slider Slots**: Dynamic multi-hub gradient slides with Hero banner preview slots.
   - **Brand Logo**: Vector SVG emblem (`<BrandLogo />`) with zero external image asset dependencies.

---

## 📁 Project Structure

```
Transport_System_Soliution/
├── app/
│   ├── layout.jsx               # Root layout (TopBar, Header, Footer, clean metadata)
│   ├── page.jsx                 # Homepage with ImageSlots & in-house booking
│   ├── globals.css              # Design system, ImageSlot styles, responsive layout
│   ├── services/
│   │   └── page.jsx             # Services showcase & Special Hire charter quote form
│   ├── bus-timetables/
│   │   └── page.jsx             # Searchable route database & schedules
│   ├── destinations/
│   │   └── page.jsx             # Destination cards with destination image slots
│   ├── gallery/
│   │   └── page.jsx             # 20 photo slots with category tabs & slot lightbox
│   ├── about-us/
│   │   └── page.jsx             # Company profile, history, and fleet slots
│   └── contact-us/
│       └── page.jsx             # Route hotlines, inquiry form, & local depot slot
├── components/
│   ├── ImageSlot.jsx            # Reusable responsive image slot container
│   ├── BrandLogo.jsx            # 100% SVG vector brand emblem & typography
│   ├── BookingWidget.jsx        # Complete in-house booking engine & visual seat selector
│   ├── HeroSlider.jsx           # Animated gradient slider with coach slots
│   ├── TopBar.jsx               # Top bar with hotlines & local contact info
│   ├── Header.jsx               # Sticky navbar with internal booking trigger
│   ├── Footer.jsx               # Internal footer with group divisions & hotlines
│   ├── TimetableList.jsx        # Route filter and direct reservation links
│   ├── GalleryLightbox.jsx      # Interactive gallery slot explorer
│   ├── SpecialHireForm.jsx      # Charter bus quotation submission form
│   └── ContactForm.jsx          # Message contact form
├── next.config.mjs              # Next.js configuration
├── package.json                 # Project dependencies & scripts
└── README.md
```

---

## 🛠️ Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm start
```
*(Verified production build: 100% prerendered static pages with 0 errors).*