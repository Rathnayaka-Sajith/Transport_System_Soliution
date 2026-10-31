import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Linking,
  Platform,
  Animated,
  SafeAreaView,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { tripSyncStore } from '../data/tripSyncStore';

// PNG Express Official Bank Account Details
const PNG_BANK_ACCOUNT = {
  bankName: 'Commercial Bank of Ceylon',
  accountName: 'PNG Express (Pvt) Ltd',
  accountNo: '1000 8492 8821',
  branch: 'Colombo Super Branch',
};

// Standard Seat Price on Route 87
const FARE_PER_SEAT = 2400; // LKR 2,400

// Helper to calculate start and end of week (Monday to Sunday)
const getWeekBounds = (referenceDate = new Date()) => {
  const d = new Date(referenceDate);
  const day = d.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const diffToMonday = (day + 6) % 7; // Mon is 0

  const monday = new Date(d);
  monday.setDate(d.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

// Format date to YYYY-MM-DD
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format readable date
const formatDisplayDate = (date) => {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format phone for international WhatsApp format (+94...)
const formatPhoneForWhatsApp = (phone) => {
  let cleaned = (phone || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '94' + cleaned.slice(1);
  } else if (!cleaned.startsWith('94') && cleaned.length === 9) {
    cleaned = '94' + cleaned;
  }
  return cleaned;
};

// Send message via WhatsApp
const sendWhatsAppMessage = async (phone, message) => {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  const encodedMsg = encodeURIComponent(message);
  const appUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMsg}`;
  const webUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  try {
    const supported = await Linking.canOpenURL(appUrl);
    if (supported) {
      await Linking.openURL(appUrl);
    } else {
      await Linking.openURL(webUrl);
    }
  } catch (err) {
    try {
      await Linking.openURL(webUrl);
    } catch (e) {
      Alert.alert(
        'WhatsApp Notice',
        `Unable to open WhatsApp app directly. Message ready for +${cleanPhone}:\n\n${message}`
      );
    }
  }
};

export default function ConductorDashboardScreen({ user }) {
  // Page state: 'calendar' (FIRST PAGE) | 'check_tickets' (SECOND PAGE ON BUTTON CLICK)
  const [currentPage, setCurrentPage] = useState('calendar');

  // Shared trip state from real-time sync store
  const [tripState, setTripState] = useState(tripSyncStore.getState());

  useEffect(() => {
    const unsubscribe = tripSyncStore.subscribe((newState) => {
      setTripState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const {
    isTripStarted,
    busPlate,
    routeNo,
    stops,
    passengers,
    activeStopId,
    isWithin50m,
  } = tripState;

  // Active stop object
  const activeStop = useMemo(() => {
    return (
      stops.find((s) => s.id === activeStopId) ||
      stops.find((s) => s.status === 'ACTIVE') ||
      stops[0]
    );
  }, [stops, activeStopId]);

  // Passengers to be picked up at the active stop
  const activeStopPassengers = useMemo(() => {
    return passengers.filter((p) => p.stopId === activeStop?.id);
  }, [passengers, activeStop?.id]);

  // Check if all passengers at this stop have boarded
  const allActivePassengersBoarded =
    activeStopPassengers.length > 0 &&
    activeStopPassengers.every((p) => p.status === 'BOARDED');

  // -------------------------------------------------------------
  // PAGE 1 STATE: CALENDAR & BUS SEATING MODAL
  // -------------------------------------------------------------
  const today = useMemo(() => new Date('2026-10-31T10:00:00'), []);
  const { monday: weekStart, sunday: weekEnd } = useMemo(() => getWeekBounds(today), [today]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  // Bus Seating Modal State (Opens on day click)
  const [showBusSeatingModal, setShowBusSeatingModal] = useState(false);
  const [selectedSeatsForBooking, setSelectedSeatsForBooking] = useState([]);
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [callerPickup, setCallerPickup] = useState('Thambuththegama Central Depot');
  const [isSubmittingReserve, setIsSubmittingReserve] = useState(false);
  const [inspectedSeatReservation, setInspectedSeatReservation] = useState(null);

  // -------------------------------------------------------------
  // PAGE 2 STATE: REAL CAMERA QR SCANNER & PHONE LOOKUP
  // -------------------------------------------------------------
  const [verifyTab, setVerifyTab] = useState('QR'); // 'QR' | 'PHONE'
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [searchPhoneQuery, setSearchPhoneQuery] = useState('');
  const [scannedTicketResult, setScannedTicketResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('back'); // 'back' | 'front'
  const [showFullscreenScanner, setShowFullscreenScanner] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Automatic Arrival Check-In Popup (< 50m of pickup place)
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const autoArrivalOpenedRef = useRef({});

  // Animated laser beam for QR scanner preview
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentPage === 'check_tickets' && verifyTab === 'QR') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [currentPage, verifyTab]);

  // Automatically open arrival check-in popup window when bus arrives within 50m
  useEffect(() => {
    if (isTripStarted && isWithin50m && activeStop && activeStop.type === 'PICKUP') {
      if (!autoArrivalOpenedRef.current[activeStop.id]) {
        autoArrivalOpenedRef.current[activeStop.id] = true;
        setShowArrivalModal(true);
      }
    }
  }, [isTripStarted, isWithin50m, activeStop?.id]);

  // Real Camera Barcode Scanned Callback
  const handleBarcodeScanned = ({ data }) => {
    if (hasScanned) return;
    setHasScanned(true);

    let rawRef = (data || '').trim();
    if (rawRef.includes('/ticket/')) {
      rawRef = rawRef.split('/ticket/')[1].split('/')[0].split('?')[0];
    }

    const matched = passengers.find(
      (p) =>
        p.ticketRef.toUpperCase() === rawRef.toUpperCase() ||
        rawRef.toUpperCase().includes(p.ticketRef.toUpperCase())
    );

    if (matched) {
      setScannedTicketResult(matched);
      Alert.alert(
        'QR Code Verified',
        `Ticket Ref: ${matched.ticketRef}\nPassenger: ${matched.name}\nSeats: ${matched.seats.join(', ')}\nPayment Status: ${matched.paymentStatus} (Rs. ${matched.fareRs.toLocaleString()})`,
        [
          {
            text: '✓ Board Passenger',
            onPress: () => {
              handleToggleBoarding(matched.ticketRef);
              setShowFullscreenScanner(false);
              setScannedTicketResult((prev) =>
                prev ? { ...prev, status: 'BOARDED' } : null
              );
              setTimeout(() => setHasScanned(false), 2000);
            },
          },
          {
            text: 'Scan Next',
            onPress: () => {
              setTimeout(() => setHasScanned(false), 1000);
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'QR Code Scanned',
        `Scanned Data: "${data}"\nNo matching booking found on Route 87 manifest.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => setHasScanned(false), 1500);
            },
          },
        ]
      );
    }
  };

  // Check if date is strictly in current active operational week
  const isDateUnlocked = (testDate) => {
    const t = new Date(testDate).setHours(12, 0, 0, 0);
    return t >= weekStart.getTime() && t <= weekEnd.getTime();
  };

  // Tap day in calendar: opens bus seating modal directly
  const handleDayClick = (dayDate, unlocked) => {
    if (!unlocked) {
      Alert.alert(
        'Date Locked',
        `Bookings are restricted strictly to the current active operational week (${formatDisplayDate(
          weekStart
        )} - ${formatDisplayDate(weekEnd)}).`
      );
      return;
    }
    setSelectedDate(dayDate);
    setSelectedSeatsForBooking([]);
    setCallerName('');
    setCallerPhone('');
    setInspectedSeatReservation(null);
    setShowBusSeatingModal(true);
  };

  // Seat status lookup for calendar modal
  const getSeatInfoForDate = (seatNum) => {
    if (selectedSeatsForBooking.includes(seatNum)) {
      return { seatNumber: seatNum, status: 'SELECTED', reservation: null };
    }
    const found = passengers.find((p) => (p.seats || []).includes(seatNum));
    if (found) {
      return {
        seatNumber: seatNum,
        status: found.paymentStatus === 'PAID' ? 'CONFIRMED' : 'PENDING_PAYMENT',
        reservation: found,
      };
    }
    return { seatNumber: seatNum, status: 'AVAILABLE', reservation: null };
  };

  // Handle seat click in bus seating modal
  const handleSeatPress = (seatNum) => {
    const info = getSeatInfoForDate(seatNum);
    if (info.status === 'AVAILABLE') {
      setInspectedSeatReservation(null);
      setSelectedSeatsForBooking((prev) =>
        prev.includes(seatNum) ? prev.filter((s) => s !== seatNum) : [...prev, seatNum].sort((a, b) => a - b)
      );
    } else if (info.status === 'SELECTED') {
      setSelectedSeatsForBooking((prev) => prev.filter((s) => s !== seatNum));
    } else {
      setSelectedSeatsForBooking([]);
      setInspectedSeatReservation(info.reservation);
    }
  };

  // Reserve seats pendingly and dispatch WhatsApp with bank details
  const handleConfirmPendingReserve = async () => {
    if (selectedSeatsForBooking.length === 0) {
      Alert.alert('Select Seats', 'Please tap one or more vacant seats on the bus layout.');
      return;
    }
    if (!callerName.trim()) {
      Alert.alert('Required Field', 'Please enter customer name.');
      return;
    }
    if (!callerPhone.trim() || callerPhone.trim().length < 9) {
      Alert.alert('Required Field', 'Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    setIsSubmittingReserve(true);
    const totalSeats = selectedSeatsForBooking.length;
    const totalAmount = totalSeats * FARE_PER_SEAT;
    const resId = `RES-${Math.floor(8820 + Math.random() * 900)}`;

    const newTicket = {
      ticketRef: resId,
      stopId: activeStop.id,
      name: callerName.trim(),
      phone: callerPhone.trim(),
      seats: [...selectedSeatsForBooking],
      boardingPoint: callerPickup,
      destination: 'Jaffna',
      fareRs: totalAmount,
      paymentStatus: 'PENDING',
      status: 'PENDING',
      boardedAt: null,
      checkedInBy: null,
    };

    tripSyncStore.markPassengerBoardedDirect(newTicket.ticketRef, 'Conductor');

    const waMessage = `🚌 *PNG EXPRESS - SEAT RESERVATION (PENDING PAYMENT)*

Dear ${callerName.trim()},
Your provisional seat reservation has been recorded by Conductor ${user?.name || 'Nimal Silva'} (Route 87: Thambuththegama ➔ Jaffna).

📋 *Reservation Details:*
• Ref Number: *${resId}*
• Date of Travel: *${formatDisplayDate(selectedDate)}*
• Reserved Seats: *Seats ${selectedSeatsForBooking.join(', ')}* (${totalSeats} Seat${totalSeats > 1 ? 's' : ''})
• Boarding Place: *${callerPickup}*
• Total Amount Due: *LKR ${totalAmount.toLocaleString()}*

🏦 *Official Bank Account for Payment:*
• Bank: *${PNG_BANK_ACCOUNT.bankName}*
• Account Name: *${PNG_BANK_ACCOUNT.accountName}*
• Account Number: *${PNG_BANK_ACCOUNT.accountNo}*
• Branch: *${PNG_BANK_ACCOUNT.branch}*

📲 *To Confirm Your Seats:*
Please deposit/transfer *LKR ${totalAmount.toLocaleString()}* and reply with your bank transfer slip / receipt to this WhatsApp chat. Once verified by our conductor, your permanent digital ticket and QR Code Pass will be issued immediately.

Thank you for choosing PNG Express! Safe travels.`;

    setIsSubmittingReserve(false);
    const bookedPhone = callerPhone.trim();
    const bookedSeats = [...selectedSeatsForBooking];

    setSelectedSeatsForBooking([]);
    setCallerName('');
    setCallerPhone('');

    Alert.alert(
      'Pending Reservation Saved',
      `Seats ${bookedSeats.join(', ')} marked as Pending. Opening WhatsApp now to send PNG bank details to ${bookedPhone}...`,
      [
        {
          text: 'Open WhatsApp ➔',
          onPress: () => sendWhatsAppMessage(bookedPhone, waMessage),
        },
      ]
    );
  };

  // Toggle passenger boarding (Synchronizes to Driver instantly in real-time)
  const handleToggleBoarding = (ticketRef) => {
    const conductorName = user?.name ? `Conductor ${user.name.split(' ')[0]}` : 'Conductor Nimal';
    tripSyncStore.checkInPassenger(ticketRef, conductorName);
  };

  // Complete current pickup stop and advance to next stop
  const handleDepartCurrentStop = () => {
    const departingName = activeStop.name;
    tripSyncStore.departStop(activeStop.id);
    Alert.alert(
      'Stop Completed',
      `${departingName} completed. Now en-route to the next pickup stop.`
    );
  };

  const handleCallPassenger = (phone, name) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const url = `tel:${cleanPhone}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Phone Call', `Dialing ${name} at ${phone}`);
    });
  };

  // Filter passengers by search query (for phone number or name lookup)
  const filteredLookupPassengers = useMemo(() => {
    const q = searchPhoneQuery.trim().toLowerCase();
    if (!q) return passengers;
    return passengers.filter(
      (p) =>
        p.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
        p.name.toLowerCase().includes(q) ||
        p.ticketRef.toLowerCase().includes(q)
    );
  }, [passengers, searchPhoneQuery]);

  // Fast Week Days (7 Unlocked Days)
  const currentWeekDays = useMemo(() => {
    const days = [];
    const temp = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const cur = new Date(temp);
      const key = formatDateKey(cur);
      const isSelected = formatDateKey(selectedDate) === key;
      const isTodayDate = formatDateKey(today) === key;

      days.push({
        date: cur,
        key,
        dayName: cur.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: cur.getDate(),
        isTodayDate,
        isSelected,
      });

      temp.setDate(temp.getDate() + 1);
    }
    return days;
  }, [weekStart, selectedDate, today]);

  // Full Month Matrix
  const calendarMatrix = useMemo(() => {
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1);
    const lastDayOfMonth = new Date(calendarYear, calendarMonth + 1, 0);

    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ empty: true, id: `empty-pre-${i}` });
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayDate = new Date(calendarYear, calendarMonth, d);
      const dateKey = formatDateKey(dayDate);
      const unlocked = isDateUnlocked(dayDate);
      const isTodayDate = formatDateKey(today) === dateKey;
      const isSelected = formatDateKey(selectedDate) === dateKey;

      cells.push({
        empty: false,
        id: `day-${dateKey}`,
        dayNumber: d,
        date: dayDate,
        dateKey,
        unlocked,
        isTodayDate,
        isSelected,
      });
    }

    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        cells.push({ empty: true, id: `empty-post-${i}` });
      }
    }

    return cells;
  }, [calendarYear, calendarMonth, today, selectedDate, weekStart, weekEnd]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // =============================================================
  // VIEW 1: FIRST PAGE (CALENDAR & BUS SEATING PAGE)
  // =============================================================
  if (currentPage === 'calendar') {
    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header: Conductor on - Bus Number & Route Number */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeftCol}>
            <Text style={styles.headerConductorTitle}>Conductor on - {busPlate}</Text>
            <Text style={styles.headerSubRouteText}>Route 87</Text>
          </View>

          <View style={styles.tripStatusPill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.tripStatusPillText}>Trip Started</Text>
          </View>
        </View>

        {/* DRIVER HAS STARTED TRIP: CLICK HERE TO CHECK TICKETS BUTTON */}
        <TouchableOpacity
          style={styles.btnCheckTicketsCard}
          onPress={() => setCurrentPage('check_tickets')}
          activeOpacity={0.85}
        >
          <View style={styles.ticketIconCircle}>
            <Ionicons name="qr-code-outline" size={26} color="#FFFFFF" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.btnCheckTicketsTitle}>Click Here To Check Tickets</Text>
            <Text style={styles.btnCheckTicketsSub}>
              Driver has started the trip • Scan QR or verify by phone number
            </Text>
          </View>

          <View style={styles.chevronCircle}>
            <Feather name="chevron-right" size={20} color="#006FD8" />
          </View>
        </TouchableOpacity>

        {/* Fast Current Week Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekCarouselContent}
          style={styles.weekCarouselScroll}
        >
          {currentWeekDays.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.weekDayPill,
                item.isSelected && styles.weekDayPillSelected,
                item.isTodayDate && styles.weekDayPillToday,
              ]}
              onPress={() => handleDayClick(item.date, true)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.weekDayNameText,
                  item.isSelected && styles.weekDayNameTextSelected,
                ]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.weekDayNumText,
                  item.isSelected && styles.weekDayNumTextSelected,
                ]}
              >
                {item.dayNum}
              </Text>
              {item.isTodayDate && (
                <Text
                  style={[
                    styles.miniTodayLabel,
                    item.isSelected && styles.miniTodayLabelSelected,
                  ]}
                >
                  Today
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Full Month Interactive Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="calendar-outline" size={18} color="#006FD8" />
              <Text style={styles.calendarMonthTitle}>
                {monthNames[calendarMonth]} {calendarYear}
              </Text>
            </View>

            <View style={styles.monthNavControls}>
              <TouchableOpacity
                style={styles.monthNavBtn}
                onPress={() => {
                  if (calendarMonth === 0) {
                    setCalendarMonth(11);
                    setCalendarYear((y) => y - 1);
                  } else {
                    setCalendarMonth((m) => m - 1);
                  }
                }}
                activeOpacity={0.7}
              >
                <Feather name="chevron-left" size={18} color="#0F172A" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.monthNavBtn}
                onPress={() => {
                  if (calendarMonth === 11) {
                    setCalendarMonth(0);
                    setCalendarYear((y) => y + 1);
                  } else {
                    setCalendarMonth((m) => m + 1);
                  }
                }}
                activeOpacity={0.7}
              >
                <Feather name="chevron-right" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.weekdayRow}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <Text key={day} style={styles.weekdayColText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendarMatrix.map((cell) => {
              if (cell.empty) {
                return <View key={cell.id} style={styles.emptyDayCell} />;
              }

              return (
                <TouchableOpacity
                  key={cell.id}
                  style={[
                    styles.dayCell,
                    !cell.unlocked && styles.dayCellLocked,
                    cell.unlocked && styles.dayCellUnlocked,
                    cell.isSelected && styles.dayCellSelected,
                    cell.isTodayDate && !cell.isSelected && styles.dayCellTodayBorder,
                  ]}
                  onPress={() => handleDayClick(cell.date, cell.unlocked)}
                  activeOpacity={cell.unlocked ? 0.75 : 0.9}
                >
                  <Text
                    style={[
                      styles.dayCellText,
                      !cell.unlocked && styles.dayCellTextLocked,
                      cell.unlocked && styles.dayCellTextUnlocked,
                      cell.isSelected && styles.dayCellTextSelected,
                    ]}
                  >
                    {cell.dayNumber}
                  </Text>

                  {!cell.unlocked && (
                    <View style={styles.lockedMiniIcon}>
                      <Ionicons name="lock-closed" size={9} color="#94A3B8" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.calendarLegendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSquare, { backgroundColor: '#FFFFFF', borderColor: '#006FD8', borderWidth: 1.5 }]} />
              <Text style={styles.legendLabel}>Active (Tap to Open Bus)</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendSquare, { backgroundColor: '#F1F5F9' }]} />
              <Text style={styles.legendLabel}>Locked Days</Text>
            </View>
          </View>
        </View>

        {/* Selected Day Direct Action Box */}
        <View style={styles.dateActionCard}>
          <View style={styles.dateActionTopRow}>
            <View>
              <Text style={styles.selectedDateHeadline}>
                {formatDisplayDate(selectedDate)}
              </Text>
              <Text style={styles.selectedDateSub}>
                Route 87: Thambuththegama ➔ Jaffna (Bus NB-4592)
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btnOpenBusSeating}
              onPress={() => {
                setSelectedSeatsForBooking([]);
                setCallerName('');
                setCallerPhone('');
                setInspectedSeatReservation(null);
                setShowBusSeatingModal(true);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="bus" size={16} color="#FFFFFF" />
              <Text style={styles.btnOpenBusSeatingText}>Open Bus Seating</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================= */}
        {/* POP-UP WINDOW: BUS SEATING & CALL-IN PENDING RESERVATION       */}
        {/* ============================================================= */}
        <Modal
          visible={showBusSeatingModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBusSeatingModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowBusSeatingModal(false)}
          >
            <TouchableOpacity
              style={styles.busModalCard}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={styles.modalBusIconCircle}>
                    <Ionicons name="bus" size={20} color="#006FD8" />
                  </View>
                  <View>
                    <Text style={styles.modalHeaderTitle}>
                      Bus Seating • {formatDisplayDate(selectedDate)}
                    </Text>
                    <Text style={styles.modalHeaderSub}>
                      Coach NB-4592 • Tap vacant seats to reserve pendingly
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setShowBusSeatingModal(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ maxHeight: 520 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Color Legend */}
                <View style={styles.busLegendRow}>
                  <View style={styles.busLegendItem}>
                    <View style={[styles.seatLegendBox, styles.seatLegendAvailable]} />
                    <Text style={styles.busLegendLabel}>Vacant</Text>
                  </View>
                  <View style={styles.busLegendItem}>
                    <View style={[styles.seatLegendBox, styles.seatLegendSelected]} />
                    <Text style={styles.busLegendLabel}>Selected</Text>
                  </View>
                  <View style={styles.busLegendItem}>
                    <View style={[styles.seatLegendBox, styles.seatLegendPending]} />
                    <Text style={styles.busLegendLabel}>Pending Slip</Text>
                  </View>
                  <View style={styles.busLegendItem}>
                    <View style={[styles.seatLegendBox, styles.seatLegendConfirmed]} />
                    <Text style={styles.busLegendLabel}>Confirmed</Text>
                  </View>
                </View>

                {/* Front Cabin Banner */}
                <View style={styles.frontCabinBanner}>
                  <Ionicons name="shield-checkmark" size={14} color="#64748B" />
                  <Text style={styles.frontCabinText}>FRONT • DRIVER CABIN & DOOR</Text>
                </View>

                {/* 40-Seat Coach Layout */}
                <View style={styles.busCoachBody}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rowIdx) => {
                    const s1 = (rowIdx - 1) * 4 + 1;
                    const s2 = (rowIdx - 1) * 4 + 2;
                    const s3 = (rowIdx - 1) * 4 + 3;
                    const s4 = (rowIdx - 1) * 4 + 4;

                    const renderSeatBtn = (seatNum) => {
                      const info = getSeatInfoForDate(seatNum);
                      const isAvailable = info.status === 'AVAILABLE';
                      const isSelected = info.status === 'SELECTED';
                      const isPending = info.status === 'PENDING_PAYMENT';
                      const isConfirmed = info.status === 'CONFIRMED';

                      return (
                        <TouchableOpacity
                          key={seatNum}
                          style={[
                            styles.seatItem,
                            isAvailable && styles.seatAvailable,
                            isSelected && styles.seatSelected,
                            isPending && styles.seatPending,
                            isConfirmed && styles.seatConfirmed,
                          ]}
                          onPress={() => handleSeatPress(seatNum)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.seatNumberText,
                              isSelected && styles.seatNumberTextWhite,
                              isPending && styles.seatNumberTextPending,
                              isConfirmed && styles.seatNumberTextConfirmed,
                            ]}
                          >
                            {seatNum}
                          </Text>
                          {isSelected && <Text style={styles.seatMiniBadge}>✓</Text>}
                          {isPending && <Text style={styles.seatMiniBadge}>⏳</Text>}
                          {isConfirmed && <Text style={styles.seatMiniBadge}>★</Text>}
                        </TouchableOpacity>
                      );
                    };

                    return (
                      <View key={rowIdx} style={styles.seatRow}>
                        <View style={styles.seatPair}>
                          {renderSeatBtn(s1)}
                          {renderSeatBtn(s2)}
                        </View>
                        <View style={styles.aisleGap}>
                          <Text style={styles.aisleText}>{rowIdx}</Text>
                        </View>
                        <View style={styles.seatPair}>
                          {renderSeatBtn(s3)}
                          {renderSeatBtn(s4)}
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* WHEN CONDUCTOR SELECTS SEATS -> SHOW FORM */}
                {selectedSeatsForBooking.length > 0 && (
                  <View style={styles.reservationFormBox}>
                    <View style={styles.reservationFormHeader}>
                      <Ionicons name="create-outline" size={18} color="#006FD8" />
                      <Text style={styles.reservationFormTitle}>
                        Reserve Seats: {selectedSeatsForBooking.join(', ')} ({selectedSeatsForBooking.length} Seat{selectedSeatsForBooking.length > 1 ? 's' : ''})
                      </Text>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Customer / Caller Name *</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="e.g. Sanjeewa Wickramasinghe"
                        placeholderTextColor="#94A3B8"
                        value={callerName}
                        onChangeText={setCallerName}
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>WhatsApp Mobile Number *</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="e.g. 077 892 1144"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                        value={callerPhone}
                        onChangeText={setCallerPhone}
                      />
                      <Text style={styles.inputHelpText}>
                        PNG bank account details will be sent automatically to this WhatsApp number.
                      </Text>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Boarding / Pickup Stop</Text>
                      <View style={styles.pickupPillsGrid}>
                        {[
                          'Thambuththegama Central Depot',
                          'Thalawa Junction',
                          'Anuradhapura Stand',
                          'Vavuniya Rest Stop',
                        ].map((stop) => (
                          <TouchableOpacity
                            key={stop}
                            style={[
                              styles.pickupPill,
                              callerPickup === stop && styles.pickupPillActive,
                            ]}
                            onPress={() => setCallerPickup(stop)}
                          >
                            <Text
                              style={[
                                styles.pickupPillText,
                                callerPickup === stop && styles.pickupPillTextActive,
                              ]}
                            >
                              {stop}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.fareNoticeRow}>
                      <View>
                        <Text style={styles.fareNoticeLabel}>Total Amount Due:</Text>
                        <Text style={styles.fareNoticeValue}>
                          LKR {(selectedSeatsForBooking.length * FARE_PER_SEAT).toLocaleString()}
                        </Text>
                      </View>
                      <Text style={styles.fareNoticeSub}>
                        LKR 2,400 × {selectedSeatsForBooking.length}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.btnConfirmReserveMain}
                      onPress={handleConfirmPendingReserve}
                      disabled={isSubmittingReserve}
                      activeOpacity={0.85}
                    >
                      {isSubmittingReserve ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
                      )}
                      <Text style={styles.btnConfirmReserveMainText}>
                        Reserve Seats Pendingly & Send WhatsApp ➔
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedSeatsForBooking.length === 0 && !inspectedSeatReservation && (
                  <View style={styles.tapToSelectHintBox}>
                    <Ionicons name="hand-left-outline" size={18} color="#64748B" />
                    <Text style={styles.tapToSelectHintText}>
                      Tap any vacant seat above to select and reserve for a customer caller.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    );
  }

  // =============================================================
  // VIEW 2: SECOND PAGE (TICKET CHECKER & NEXT PICKUPS)
  // =============================================================
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Back to Calendar Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.btnBackToCalendar}
          onPress={() => setCurrentPage('calendar')}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={18} color="#0F172A" />
          <Text style={styles.btnBackToCalendarText}>Calendar</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerConductorTitle}>Conductor on - {busPlate}</Text>
          <Text style={styles.headerSubRouteText}>Route 87</Text>
        </View>

        <View style={styles.tripStatusPill}>
          <View style={styles.livePulseDot} />
          <Text style={styles.tripStatusPillText}>Ongoing Route 87</Text>
        </View>
      </View>

      {/* SECTION 1: NEXT PICKUP PLACE CARD */}
      <View style={styles.nextPickupCardScreenshot}>
        <View style={styles.nextPickupTopScreenshot}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={styles.locationPinCircle}>
              <Ionicons name="location-sharp" size={20} color="#006FD8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextPickupLabelScreenshot}>Next Pickup Place</Text>
              <Text style={styles.nextPickupPlaceTitleScreenshot}>{activeStop.name}</Text>
            </View>
          </View>

          {/* Only display arrival pill when bus has actually reached the stop (<50m) */}
          {isWithin50m ? (
            <View style={styles.within50mBadgeScreenshot}>
              <View style={styles.livePulseDotGreen} />
              <Text style={styles.within50mBadgeText}>Arrived at Stop</Text>
            </View>
          ) : (
            <View style={styles.enRoutePill}>
              <Ionicons name="bus-outline" size={13} color="#64748B" />
              <Text style={styles.enRoutePillText}>En Route</Text>
            </View>
          )}
        </View>

        {/* Sub-header: Passengers to Pick Up at this Stop */}
        <View style={styles.passengersToPickRow}>
          <Text style={styles.passengersToPickTitle}>
            Passengers to Pick Up at this Stop:
          </Text>
          <Text style={styles.bookedCountBadgeScreenshot}>
            {activeStopPassengers.length} Booked
          </Text>
        </View>

        {/* Passenger Cards Matching User Screenshot */}
        {activeStopPassengers.map((p) => {
          const isBoarded = p.status === 'BOARDED';
          return (
            <View key={p.ticketRef} style={styles.passengerRowScreenshot}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.passengerNameScreenshot}>{p.name}</Text>
                  <View
                    style={[
                      styles.waitingTagScreenshot,
                      isBoarded && styles.boardedTagScreenshot,
                    ]}
                  >
                    <Text
                      style={[
                        styles.waitingTagTextScreenshot,
                        isBoarded && styles.boardedTagTextScreenshot,
                      ]}
                    >
                      {isBoarded ? '✓ Boarded' : '⏳ Waiting'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.passengerDetailSubScreenshot}>
                  Seats: <Text style={styles.boldSeatTextScreenshot}>{p.seats.join(', ')}</Text> •{' '}
                  {p.destination} • Fare:{' '}
                  <Text style={styles.farePaidGreenScreenshot}>
                    Rs. {p.fareRs.toLocaleString()} ({p.paymentStatus})
                  </Text>
                </Text>

                {p.boardedAt && (
                  <Text style={styles.syncAttributionText}>
                    Checked in at {p.boardedAt} {p.checkedInBy ? `• ${p.checkedInBy}` : ''}
                  </Text>
                )}
              </View>

              {/* Call Button */}
              <TouchableOpacity
                style={styles.callCircleBtnScreenshot}
                onPress={() => handleCallPassenger(p.phone, p.name)}
                activeOpacity={0.7}
              >
                <Feather name="phone" size={15} color="#006FD8" />
              </TouchableOpacity>

              {/* Check In Button */}
              <TouchableOpacity
                style={[
                  styles.btnCheckInScreenshot,
                  isBoarded && styles.btnCheckInScreenshotBoarded,
                ]}
                onPress={() => handleToggleBoarding(p.ticketRef)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.btnCheckInTextScreenshot,
                    isBoarded && styles.btnCheckInTextScreenshotBoarded,
                  ]}
                >
                  {isBoarded ? '✓ Boarded' : 'Check In'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* STOP COMPLETION & NEXT PICKUP ADVANCEMENT */}
        {allActivePassengersBoarded && (
          <View style={styles.stopDepartReadyBanner}>
            <Ionicons name="checkmark-done-circle" size={20} color="#059669" />
            <View style={{ flex: 1 }}>
              <Text style={styles.stopDepartReadyTitle}>
                All passengers boarded at {activeStop.name}!
              </Text>
              <Text style={styles.stopDepartReadySub}>
                Tap to complete this stop and show the next pickup point.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.btnDepartStopNext}
              onPress={handleDepartCurrentStop}
              activeOpacity={0.85}
            >
              <Text style={styles.btnDepartStopNextText}>Next Stop ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FIXED: Open Arrival Check-In Window Button - cleanly contained inside box */}
        <TouchableOpacity
          style={styles.btnOpenArrivalCheckInScreenshot}
          onPress={() => setShowArrivalModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="checkbox-outline" size={17} color="#006FD8" />
          <Text style={styles.btnOpenArrivalCheckInTextScreenshot} numberOfLines={1}>
            Check-In Window ({activeStop.name})
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECTION 2: REAL CAMERA QR SCANNER & PHONE NUMBER LOOKUP */}
      <View style={styles.ticketVerificationSection}>
        <View style={styles.ticketSectionTitleRow}>
          <Ionicons name="shield-checkmark" size={18} color="#006FD8" />
          <Text style={styles.ticketSectionTitle}>Verify & Check Passenger Tickets</Text>
        </View>

        {/* Verification Mode Tabs */}
        <View style={styles.verifyTabsRow}>
          <TouchableOpacity
            style={[
              styles.verifyTabBtn,
              verifyTab === 'QR' && styles.verifyTabBtnActive,
            ]}
            onPress={() => setVerifyTab('QR')}
          >
            <Ionicons
              name="camera"
              size={15}
              color={verifyTab === 'QR' ? '#006FD8' : '#64748B'}
            />
            <Text
              style={[
                styles.verifyTabBtnText,
                verifyTab === 'QR' && styles.verifyTabBtnTextActive,
              ]}
            >
              Scan QR Code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.verifyTabBtn,
              verifyTab === 'PHONE' && styles.verifyTabBtnActive,
            ]}
            onPress={() => setVerifyTab('PHONE')}
          >
            <Ionicons
              name="call"
              size={15}
              color={verifyTab === 'PHONE' ? '#006FD8' : '#64748B'}
            />
            <Text
              style={[
                styles.verifyTabBtnText,
                verifyTab === 'PHONE' && styles.verifyTabBtnTextActive,
              ]}
            >
              Phone Lookup (No Phone)
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: REAL CAMERA QR CODE SCANNER */}
        {verifyTab === 'QR' && (
          <View>
            {/* If camera permission is not yet granted, show permission request card */}
            {!cameraPermission || !cameraPermission.granted ? (
              <View style={styles.cameraPermissionBox}>
                <Ionicons name="camera" size={40} color="#006FD8" />
                <Text style={styles.cameraPermissionTitle}>Camera Access Required</Text>
                <Text style={styles.cameraPermissionSub}>
                  Please allow camera access to scan ticket QR passes directly with your phone.
                </Text>
                <TouchableOpacity
                  style={styles.btnGrantCamera}
                  onPress={requestCameraPermission}
                  activeOpacity={0.8}
                >
                  <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                  <Text style={styles.btnGrantCameraText}>Allow Camera Access</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* REAL CAMERA VIEW WITH SCANNER OVERLAY */
              <View>
                {/* ONE-TAP FULLSCREEN CAMERA SCANNER BUTTON */}
                <TouchableOpacity
                  style={styles.btnLaunchFullscreenScanner}
                  onPress={() => setShowFullscreenScanner(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="camera" size={19} color="#FFFFFF" />
                  <Text style={styles.btnLaunchFullscreenScannerText}>
                    Open Camera Scanner
                  </Text>
                  <Feather name="maximize-2" size={16} color="#FFFFFF" />
                </TouchableOpacity>

                {/* INLINE CAMERA PREVIEW WITH EXPLICIT RIGID DIMENSIONS */}
                <TouchableOpacity
                  style={styles.cameraViewfinderBox}
                  activeOpacity={0.9}
                  onPress={() => setShowFullscreenScanner(true)}
                >
                  <CameraView
                    style={styles.cameraInlinePreview}
                    facing={cameraFacing}
                    enableTorch={isTorchOn}
                    onCameraReady={() => setIsCameraReady(true)}
                    onMountError={(err) => {
                      console.log('Camera mount error:', err);
                    }}
                    barcodeScannerSettings={{
                      barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
                  />

                  {/* Viewfinder Target Overlays */}
                  <View style={[styles.cornerMark, styles.cornerTL]} />
                  <View style={[styles.cornerMark, styles.cornerTR]} />
                  <View style={[styles.cornerMark, styles.cornerBL]} />
                  <View style={[styles.cornerMark, styles.cornerBR]} />

                  <Animated.View
                    style={[
                      styles.scanningLaserLine,
                      {
                        transform: [
                          {
                            translateY: laserAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 140],
                            }),
                          },
                        ],
                      },
                    ]}
                  />

                  {/* Camera Controls Overlay */}
                  <View style={styles.cameraControlsOverlay}>
                    {/* Torch / Flash Toggle */}
                    <TouchableOpacity
                      style={[styles.torchToggleBtn, isTorchOn && styles.torchToggleBtnActive]}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        setIsTorchOn((t) => !t);
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isTorchOn ? 'flash' : 'flash-off'}
                        size={14}
                        color="#FFFFFF"
                      />
                      <Text style={styles.torchToggleBtnText}>
                        {isTorchOn ? 'Flash ON' : 'Flash'}
                      </Text>
                    </TouchableOpacity>

                    {/* Flip Camera */}
                    <TouchableOpacity
                      style={styles.torchToggleBtn}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        setCameraFacing((f) => (f === 'back' ? 'front' : 'back'));
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="camera-reverse" size={14} color="#FFFFFF" />
                      <Text style={styles.torchToggleBtnText}>Flip</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cameraAimPill}>
                    <Ionicons name="scan-outline" size={12} color="#FFFFFF" />
                    <Text style={styles.cameraAimText}>
                      Point at ticket QR or tap to enlarge ⛶
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Quick Test Scan Buttons for Immediate Testing */}
            <View style={styles.simulateScanSection}>
              <Text style={styles.simulateScanTitle}>Test Scan Passenger Tickets:</Text>
              <View style={styles.simulateButtonsGrid}>
                {activeStopPassengers.map((p) => (
                  <TouchableOpacity
                    key={p.ticketRef}
                    style={styles.simulateScanBtn}
                    onPress={() => {
                      setIsScanning(true);
                      setTimeout(() => {
                        setScannedTicketResult(p);
                        setIsScanning(false);
                      }, 400);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="barcode-outline" size={14} color="#006FD8" />
                    <Text style={styles.simulateScanBtnText}>
                      {p.name} ({p.ticketRef})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Scanned Result Card */}
            {scannedTicketResult && (
              <View style={styles.scanResultCard}>
                <View style={styles.scanResultHeader}>
                  <View style={styles.verifiedGreenCircle}>
                    <Ionicons name="checkmark-done" size={16} color="#059669" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scanResultName}>{scannedTicketResult.name}</Text>
                    <Text style={styles.scanResultRef}>
                      Ticket #{scannedTicketResult.ticketRef}
                    </Text>
                  </View>
                  <View style={styles.paidPillBadge}>
                    <Text style={styles.paidPillBadgeText}>
                      {scannedTicketResult.paymentStatus} (Rs.{' '}
                      {scannedTicketResult.fareRs.toLocaleString()})
                    </Text>
                  </View>
                </View>

                <View style={styles.scanResultDetailsRow}>
                  <Text style={styles.scanResultSeats}>
                    Seats: {scannedTicketResult.seats.join(', ')}
                  </Text>
                  <Text style={styles.scanResultRoute}>
                    {scannedTicketResult.boardingPoint} ➔ {scannedTicketResult.destination}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.btnConfirmScanBoard,
                    scannedTicketResult.status === 'BOARDED' &&
                      styles.btnConfirmScanBoardDone,
                  ]}
                  onPress={() => {
                    handleToggleBoarding(scannedTicketResult.ticketRef);
                    setScannedTicketResult((prev) => ({
                      ...prev,
                      status: prev.status === 'BOARDED' ? 'PENDING' : 'BOARDED',
                    }));
                  }}
                >
                  <Text style={styles.btnConfirmScanBoardText}>
                    {scannedTicketResult.status === 'BOARDED'
                      ? '✓ Verified & Boarded (Tap to Undo)'
                      : 'Confirm & Board Passenger ➔'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* TAB 2: PHONE NUMBER LOOKUP (PEOPLES WITHOUT PHONE) */}
        {verifyTab === 'PHONE' && (
          <View>
            <View style={styles.phoneSearchBox}>
              <Ionicons name="search" size={16} color="#64748B" />
              <TextInput
                style={styles.phoneSearchInput}
                placeholder="Enter booked phone number (e.g. 077 334 1122)..."
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={searchPhoneQuery}
                onChangeText={setSearchPhoneQuery}
              />
              {searchPhoneQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchPhoneQuery('')}>
                  <Feather name="x" size={16} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.lookupSubNotice}>
              For passengers without a phone, ask their booked phone number to verify paid
              status and check them in:
            </Text>

            {filteredLookupPassengers.map((p) => {
              const isBoarded = p.status === 'BOARDED';
              const isPaid = p.paymentStatus === 'PAID';

              return (
                <View key={p.ticketRef} style={styles.lookupPassengerCard}>
                  <View style={styles.lookupCardTop}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.lookupPassengerName}>{p.name}</Text>
                        <View
                          style={[
                            styles.lookupPaidBadge,
                            isPaid ? styles.lookupPaidGreen : styles.lookupPaidAmber,
                          ]}
                        >
                          <Text
                            style={
                              isPaid
                                ? styles.lookupPaidGreenText
                                : styles.lookupPaidAmberText
                            }
                          >
                            {isPaid ? '✓ PAID' : '⚠️ PENDING PAYMENT'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.lookupPhoneText}>
                        📞 Phone: <Text style={styles.boldText}>{p.phone}</Text>
                      </Text>
                      <Text style={styles.lookupSeatsText}>
                        Seats: <Text style={styles.boldSeatText}>{p.seats.join(', ')}</Text> •{' '}
                        {p.boardingPoint} • Total: Rs. {p.fareRs.toLocaleString()}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.btnLookupCheckIn,
                        isBoarded && styles.btnLookupCheckInDone,
                      ]}
                      onPress={() => handleToggleBoarding(p.ticketRef)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.btnLookupCheckInText,
                          isBoarded && styles.btnLookupCheckInDoneText,
                        ]}
                      >
                        {isBoarded ? '✓ Boarded' : 'Check In'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* 2-Way Staff Sync Banner */}
      <View style={styles.syncStatusFooterNotice}>
        <Ionicons name="sync" size={15} color="#059669" />
        <Text style={styles.syncStatusFooterText}>
          Real-time synchronized with Driver's cockpit. Check-ins updated instantly on both phones.
        </Text>
      </View>

      {/* ============================================================= */}
      {/* ARRIVAL POPUP MODAL (< 50m)                                   */}
      {/* ============================================================= */}
      <Modal
        visible={showArrivalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowArrivalModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowArrivalModal(false)}
        >
          <TouchableOpacity
            style={styles.arrivalModalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.arrivedIconPulseCircle}>
                  <Ionicons name="location" size={20} color="#006FD8" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>
                    Arrived at {activeStop.name}
                  </Text>
                  <Text style={styles.modalHeaderSub}>
                    Check in passengers boarding at this stop below
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowArrivalModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.arrivalSyncNoticeBox}>
              <Ionicons name="people" size={16} color="#006FD8" />
              <Text style={styles.arrivalSyncNoticeText}>
                Both Driver and Conductor can check in passengers. Changes show immediately on
                each other's screen.
              </Text>
            </View>

            <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
              {activeStopPassengers.map((p) => {
                const isBoarded = p.status === 'BOARDED';
                return (
                  <View key={p.ticketRef} style={styles.arrivalPassengerRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.arrivalPassengerName}>{p.name}</Text>
                      <Text style={styles.arrivalPassengerSub}>
                        Seats: {p.seats.join(', ')} • Phone: {p.phone}
                      </Text>
                      {p.boardedAt && (
                        <Text style={styles.arrivalBoardedAt}>
                          ✓ Boarded at {p.boardedAt} {p.checkedInBy ? `by ${p.checkedInBy}` : ''}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.btnCallSmall}
                      onPress={() => handleCallPassenger(p.phone, p.name)}
                    >
                      <Feather name="phone" size={13} color="#006FD8" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.btnCheckInToggle,
                        isBoarded && styles.btnCheckInToggleBoarded,
                      ]}
                      onPress={() => handleToggleBoarding(p.ticketRef)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.btnCheckInToggleText,
                          isBoarded && styles.btnCheckInToggleTextBoarded,
                        ]}
                      >
                        {isBoarded ? '✓ Boarded' : 'Check In'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.btnCompletePickupAndDepart}
              onPress={() => {
                setShowArrivalModal(false);
                tripSyncStore.departStop(activeStop.id);
                Alert.alert(
                  'Stop Completed',
                  `${activeStop.name} completed. Now en route to next pickup stop.`
                );
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
              <Text style={styles.btnCompletePickupAndDepartText}>
                Complete Pickup & Depart ➔
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ============================================================= */}
      {/* FULLSCREEN REAL CAMERA QR SCANNER MODAL (NATIVE FIXED WINDOW) */}
      {/* ============================================================= */}
      <Modal
        visible={showFullscreenScanner}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowFullscreenScanner(false)}
      >
        <View style={styles.fullscreenScannerRoot}>
          {/* Real Native CameraView filling the full modal without ScrollView interference */}
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={cameraFacing}
            enableTorch={isTorchOn}
            onCameraReady={() => setIsCameraReady(true)}
            onMountError={(err) => {
              Alert.alert(
                'Camera Error',
                err?.message || 'Could not start camera on this device. Please check camera permissions in iOS settings.'
              );
            }}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
          />

          {/* Top Bar Overlay */}
          <SafeAreaView style={styles.scannerTopSafeArea}>
            <View style={styles.scannerHeaderRow}>
              <TouchableOpacity
                style={styles.scannerCloseCircleBtn}
                onPress={() => setShowFullscreenScanner(false)}
                activeOpacity={0.8}
              >
                <Feather name="x" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.scannerHeaderTitleCol}>
                <Text style={styles.scannerHeaderTitle}>Scan Ticket QR Pass</Text>
                <Text style={styles.scannerHeaderSub}>PNG Express • Conductor Validator</Text>
              </View>

              <View style={styles.scannerControlsGroup}>
                {/* Flash Toggle */}
                <TouchableOpacity
                  style={[styles.scannerTopControlBtn, isTorchOn && styles.scannerTopControlBtnActive]}
                  onPress={() => setIsTorchOn((t) => !t)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={isTorchOn ? 'flash' : 'flash-off'} size={18} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Flip Camera */}
                <TouchableOpacity
                  style={styles.scannerTopControlBtn}
                  onPress={() => setCameraFacing((f) => (f === 'back' ? 'front' : 'back'))}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera-reverse" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* Center Scan Reticle Frame */}
          <View style={styles.scannerCenterContainer} pointerEvents="none">
            <View style={styles.scannerTargetBox}>
              <View style={[styles.targetCorner, styles.targetCornerTL]} />
              <View style={[styles.targetCorner, styles.targetCornerTR]} />
              <View style={[styles.targetCorner, styles.targetCornerBL]} />
              <View style={[styles.targetCorner, styles.targetCornerBR]} />

              <Animated.View
                style={[
                  styles.scannerLaserLine,
                  {
                    transform: [
                      {
                        translateY: laserAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 210],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <Text style={styles.scannerInstructionText}>
              Align ticket QR code within the square frame to verify
            </Text>
          </View>

          {/* Bottom Bar: Manual Phone Lookup shortcut */}
          <SafeAreaView style={styles.scannerBottomBar}>
            <TouchableOpacity
              style={styles.btnSwitchToPhoneFromScanner}
              onPress={() => {
                setShowFullscreenScanner(false);
                setVerifyTab('PHONE');
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="call-outline" size={16} color="#FFFFFF" />
              <Text style={styles.btnSwitchToPhoneFromScannerText}>
                No phone? Verify by Phone Number ➔
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    flexGrow: 1,
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 520,
          width: '100%',
          alignSelf: 'center',
        }
      : {}),
  },

  // Header Bar
  headerBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  headerLeftCol: {
    flex: 1,
  },
  headerConductorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubRouteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#006FD8',
    marginTop: 2,
  },
  tripStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#006FD8',
  },
  livePulseDotGreen: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  tripStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  btnBackToCalendar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  btnBackToCalendarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Primary Action Card: Click Here To Check Tickets
  btnCheckTicketsCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#006FD8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#006FD8',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  ticketIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCheckTicketsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnCheckTicketsSub: {
    fontSize: 11,
    color: '#E0F2FE',
    marginTop: 3,
    lineHeight: 15,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Page 1: Calendar Elements
  weekCarouselScroll: {
    width: '100%',
    marginBottom: 14,
  },
  weekCarouselContent: {
    gap: 8,
    paddingVertical: 2,
  },
  weekDayPill: {
    width: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  weekDayPillSelected: {
    backgroundColor: '#006FD8',
    borderColor: '#006FD8',
  },
  weekDayPillToday: {
    borderColor: '#006FD8',
  },
  weekDayNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  weekDayNameTextSelected: {
    color: '#FFFFFF',
  },
  weekDayNumText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  weekDayNumTextSelected: {
    color: '#FFFFFF',
  },
  miniTodayLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#006FD8',
    marginTop: 3,
  },
  miniTodayLabelSelected: {
    color: '#BFDBFE',
  },
  calendarCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarMonthTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  monthNavControls: {
    flexDirection: 'row',
    gap: 6,
  },
  monthNavBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  weekdayColText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDayCell: {
    width: '14.28%',
    height: 44,
  },
  dayCell: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  dayCellLocked: {
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  dayCellUnlocked: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayCellSelected: {
    backgroundColor: '#006FD8',
    borderColor: '#006FD8',
  },
  dayCellTodayBorder: {
    borderColor: '#006FD8',
    borderWidth: 1.5,
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dayCellTextLocked: {
    color: '#94A3B8',
  },
  dayCellTextUnlocked: {
    color: '#0F172A',
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  lockedMiniIcon: {
    marginTop: 1,
  },
  calendarLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  dateActionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  dateActionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedDateHeadline: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  selectedDateSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  btnOpenBusSeating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#006FD8',
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 10,
  },
  btnOpenBusSeatingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Bus Seating Modal
  busModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 10,
  },
  modalBusIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  modalHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalHeaderSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  busLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  busLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  seatLegendBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  seatLegendAvailable: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  seatLegendSelected: {
    backgroundColor: '#006FD8',
  },
  seatLegendPending: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  seatLegendConfirmed: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  busLegendLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  frontCabinBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  frontCabinText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  busCoachBody: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  seatPair: {
    flexDirection: 'row',
    gap: 6,
  },
  aisleGap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aisleText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  seatItem: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  seatAvailable: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  seatSelected: {
    backgroundColor: '#006FD8',
    borderWidth: 1.5,
    borderColor: '#005BB5',
  },
  seatPending: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  seatConfirmed: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  seatNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  seatNumberTextWhite: {
    color: '#FFFFFF',
  },
  seatNumberTextPending: {
    color: '#B45309',
  },
  seatNumberTextConfirmed: {
    color: '#047857',
  },
  seatMiniBadge: {
    fontSize: 8,
    position: 'absolute',
    top: 2,
    right: 2,
    color: '#0F172A',
  },
  reservationFormBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginTop: 8,
  },
  reservationFormTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  reservationFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    paddingBottom: 6,
  },
  formGroup: {
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: '#0F172A',
  },
  inputHelpText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 3,
  },
  pickupPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  pickupPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  pickupPillActive: {
    backgroundColor: '#006FD8',
    borderColor: '#006FD8',
  },
  pickupPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  pickupPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  fareNoticeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  fareNoticeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
  },
  fareNoticeValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  fareNoticeSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  btnConfirmReserveMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 11,
    borderRadius: 10,
  },
  btnConfirmReserveMainText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  tapToSelectHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  tapToSelectHintText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  // =============================================================
  // PAGE 2: SCREENSHOT-MATCHING STYLES (NEXT PICKUP CARD)
  // =============================================================
  nextPickupCardScreenshot: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  nextPickupTopScreenshot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  nextPickupLabelScreenshot: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  nextPickupPlaceTitleScreenshot: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  within50mBadgeScreenshot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  within50mBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  enRoutePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  enRoutePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  passengersToPickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
  },
  passengersToPickTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookedCountBadgeScreenshot: {
    fontSize: 12,
    fontWeight: '800',
    color: '#006FD8',
  },
  passengerRowScreenshot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passengerNameScreenshot: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  waitingTagScreenshot: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  boardedTagScreenshot: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  waitingTagTextScreenshot: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  boardedTagTextScreenshot: {
    color: '#047857',
  },
  passengerDetailSubScreenshot: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },
  boldSeatTextScreenshot: {
    color: '#006FD8',
    fontWeight: '900',
  },
  farePaidGreenScreenshot: {
    color: '#059669',
    fontWeight: '800',
  },
  callCircleBtnScreenshot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnCheckInScreenshot: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnCheckInScreenshotBoarded: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  btnCheckInTextScreenshot: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  btnCheckInTextScreenshotBoarded: {
    color: '#FFFFFF',
  },

  // Stop Depart Ready Banner
  stopDepartReadyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 8,
  },
  stopDepartReadyTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  stopDepartReadySub: {
    fontSize: 10,
    color: '#047857',
    marginTop: 1,
  },
  btnDepartStopNext: {
    backgroundColor: '#059669',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  btnDepartStopNextText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // FIXED: Button stays 100% inside container with zero overflow
  btnOpenArrivalCheckInScreenshot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 12,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  btnOpenArrivalCheckInTextScreenshot: {
    fontSize: 12,
    fontWeight: '800',
    color: '#006FD8',
    flexShrink: 1,
    textAlign: 'center',
  },

  // Ticket Verification Section in Page 2
  ticketVerificationSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  ticketSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  ticketSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifyTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  verifyTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  verifyTabBtnActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  verifyTabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  verifyTabBtnTextActive: {
    color: '#006FD8',
  },

  // Camera Permission Box
  cameraPermissionBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cameraPermissionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  cameraPermissionSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 15,
  },
  btnGrantCamera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#006FD8',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnGrantCameraText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // 1. Launch Fullscreen Scanner Button
  btnLaunchFullscreenScanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#006FD8',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  btnLaunchFullscreenScannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // 2. Camera Live Viewfinder & Overlays
  cameraViewfinderBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#000000',
    borderRadius: 14,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 12,
  },
  cameraInlinePreview: {
    width: '100%',
    height: 200,
  },
  scanningLaserLine: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  cornerMark: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#006FD8',
  },
  cornerTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
  cameraControlsOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 6,
  },
  torchToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  torchToggleBtnActive: {
    backgroundColor: '#006FD8',
  },
  torchToggleBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraAimPill: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  cameraAimText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // 3. Fullscreen Camera Scanner Modal Styles
  fullscreenScannerRoot: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  scannerTopSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  scannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scannerCloseCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerHeaderTitleCol: {
    flex: 1,
    marginHorizontal: 12,
  },
  scannerHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  scannerHeaderSub: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  scannerControlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scannerTopControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerTopControlBtnActive: {
    backgroundColor: '#006FD8',
  },
  scannerCenterContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  scannerTargetBox: {
    width: 250,
    height: 250,
    position: 'relative',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  targetCorner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#006FD8',
  },
  targetCornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  targetCornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  targetCornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  targetCornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  scannerLaserLine: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.9,
    shadowRadius: 8,
    borderRadius: 2,
  },
  scannerInstructionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 20,
    textAlign: 'center',
    maxWidth: 280,
  },
  scannerBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnSwitchToPhoneFromScanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  btnSwitchToPhoneFromScannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  simulateScanSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  simulateScanTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  simulateButtonsGrid: {
    gap: 6,
  },
  simulateScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  simulateScanBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006FD8',
  },

  // Scan Result Card
  scanResultCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    marginBottom: 10,
  },
  scanResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  verifiedGreenCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanResultName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  scanResultRef: {
    fontSize: 10,
    color: '#64748B',
  },
  paidPillBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  paidPillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  scanResultDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  scanResultSeats: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  scanResultRoute: {
    fontSize: 11,
    color: '#475569',
  },
  btnConfirmScanBoard: {
    backgroundColor: '#059669',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnConfirmScanBoardDone: {
    backgroundColor: '#10B981',
  },
  btnConfirmScanBoardText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Phone Lookup Tab
  phoneSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 8,
  },
  phoneSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  lookupSubNotice: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 10,
  },
  lookupPassengerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  lookupCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lookupPassengerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  lookupPaidBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  lookupPaidGreen: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  lookupPaidGreenText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  lookupPaidAmber: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  lookupPaidAmberText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  lookupPhoneText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  lookupSeatsText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  btnLookupCheckIn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnLookupCheckInDone: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  btnLookupCheckInText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  btnLookupCheckInDoneText: {
    color: '#FFFFFF',
  },
  syncAttributionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },

  // 2-Way Staff Sync Banner
  syncStatusFooterNotice: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  syncStatusFooterText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
    lineHeight: 15,
    fontWeight: '600',
  },

  // Modal Overlay & Arrival Card
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  arrivalModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 10,
  },
  arrivedIconPulseCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  arrivalSyncNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 12,
  },
  arrivalSyncNoticeText: {
    fontSize: 11,
    color: '#0369A1',
    flex: 1,
    lineHeight: 15,
    fontWeight: '600',
  },
  arrivalPassengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  arrivalPassengerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  arrivalPassengerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  arrivalBoardedAt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  btnCompletePickupAndDepart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  btnCompletePickupAndDepartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
