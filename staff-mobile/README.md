# PNG Express - Staff Mobile App (iOS & Android)

A unified cross-platform mobile application for PNG Express operational field staff:
- **Bus Drivers** 🚌 (Pre-trip safety checklists, route navigation, and emergency breakdown SOS alerts)
- **Bus Conductors** 🎫 (Live digital QR ticket scanning, 40-seat passenger manifest, and onboard cash ticketing)
- **Fleet Mechanics** 🔧 (Emergency breakdown rescue calls, job cards, and roadworthy sign-off certification)

---

## Key Features

1. **Multi-Role Registration:**
   - Staff can register for **one or more roles** simultaneously (e.g., Conductor who also drives, or Driver who performs mechanic repairs).
2. **Dynamic Shift Role Selector:**
   - After signing in with email and password, the app asks: **"Who are you logging in as right now?"**
   - Displays only the roles registered for that specific employee.
   - Staff can switch their active duty category at any time from the top bar without logging out.
3. **Cross-Platform Compatibility:**
   - Compiles and runs identically on **Apple iOS (iPhone/iPad)** and **Google Android**.

---

## How to Run Locally

### 1. Install Dependencies
```bash
cd staff-mobile
npm install
```

### 2. Start Expo Development Server
```bash
npx expo start
```

### 3. Open on Devices

- **On Physical iPhone or Android Phone:**
  - Install the **Expo Go** app from Apple App Store or Google Play Store.
  - Scan the QR code displayed in the terminal.
- **On Android Emulator:**
  - Press `a` in the terminal to launch on Android Studio Emulator.
- **On iOS Simulator:**
  - Press `i` in the terminal to launch on Xcode iOS Simulator (macOS).
- **On Web Browser:**
  - Press `w` in the terminal to open in web view.

---

## Building Production Binaries (iOS `.ipa` & Android `.apk`)

Using Expo Application Services (EAS):

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Configure build
eas build:configure

# 3. Build Android APK
eas build --platform android --profile preview

# 4. Build iOS TestFlight
eas build --platform ios --profile production
```
