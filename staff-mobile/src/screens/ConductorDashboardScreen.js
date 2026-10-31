import React, { useState, useMemo } from 'react';
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
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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

// Initial Mock Reservations (Seeded on Today: 2026-10-31)
const INITIAL_RESERVATIONS = [
  {
    id: 'RES-8812',
    ticketRef: null,
    customerName: 'Chaminda Senanayake',
    phone: '076 554 9911',
    dateKey: '2026-10-31',
    seats: [21, 22],
    pickup: 'Anuradhapura Stand',
    amount: 4800,
    status: 'PENDING_PAYMENT', // 'PENDING_PAYMENT' | 'CONFIRMED'
    createdAt: '10:15 AM',
    bankRef: null,
  },
  {
    id: 'RES-8815',
    ticketRef: null,
    customerName: 'V. Ramanathan',
    phone: '077 341 8820',
    dateKey: '2026-10-31',
    seats: [6, 7],
    pickup: 'Thalawa Junction',
    amount: 4800,
    status: 'PENDING_PAYMENT',
    createdAt: '09:40 AM',
    bankRef: null,
  },
  {
    id: 'RES-8701',
    ticketRef: 'PNG-TKT-1081',
    customerName: 'Kasun Bandara',
    phone: '077 123 9081',
    dateKey: '2026-10-31',
    seats: [1, 2],
    pickup: 'Thambuththegama Central Depot',
    amount: 4800,
    status: 'CONFIRMED',
    createdAt: 'Yesterday',
    bankRef: 'Commercial Bank Slip #CB-9941',
  },
  {
    id: 'RES-8702',
    ticketRef: 'PNG-TKT-1082',
    customerName: 'Mohamed Rizwan',
    phone: '077 665 4433',
    dateKey: '2026-10-31',
    seats: [12, 13],
    pickup: 'Thambuththegama Central Depot',
    amount: 4800,
    status: 'CONFIRMED',
    createdAt: 'Yesterday',
    bankRef: 'Bank of Ceylon Slip #BOC-1029',
  },
  {
    id: 'RES-8703',
    ticketRef: 'PNG-TKT-1083',
    customerName: 'Sithara Fernando',
    phone: '071 883 1920',
    dateKey: '2026-10-31',
    seats: [5],
    pickup: 'Thalawa Junction',
    amount: 2400,
    status: 'CONFIRMED',
    createdAt: 'Yesterday',
    bankRef: 'Commercial Bank Slip #CB-8832',
  },
];

export default function ConductorDashboardScreen({ user }) {
  // Current local system time
  const today = useMemo(() => new Date('2026-10-31T10:00:00'), []);
  const { monday: weekStart, sunday: weekEnd } = useMemo(() => getWeekBounds(today), [today]);

  // Selected date defaults to today
  const [selectedDate, setSelectedDate] = useState(today);

  // Calendar month/year navigation state
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth()); // 0-11
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  // Master Reservations State
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);

  // POP-UP WINDOW 1: Bus Seating Layout & Reservation Modal
  const [showBusSeatingModal, setShowBusSeatingModal] = useState(false);
  const [selectedSeatsForBooking, setSelectedSeatsForBooking] = useState([]);
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [callerPickup, setCallerPickup] = useState('Thambuththegama Central Depot');
  const [isSubmittingReserve, setIsSubmittingReserve] = useState(false);

  // Detail Inspector for an already booked/pending seat
  const [inspectedSeatReservation, setInspectedSeatReservation] = useState(null);

  // POP-UP WINDOW 2: Verify Payment & Confirm Permanently
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [activePendingToVerify, setActivePendingToVerify] = useState(null);
  const [bankSlipRef, setBankSlipRef] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // POP-UP WINDOW 3: Digital Ticket QR Pass
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeConfirmedRes, setActiveConfirmedRes] = useState(null);

  // Check if a date falls strictly within the current unlocked operational week
  const isDateUnlocked = (testDate) => {
    const t = new Date(testDate).setHours(12, 0, 0, 0);
    return t >= weekStart.getTime() && t <= weekEnd.getTime();
  };

  // -------------------------------------------------------------
  // CALENDAR CELL CLICK: DIRECTLY OPEN BUS SEATING POPUP WINDOW
  // -------------------------------------------------------------
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

    // Set selected date and immediately open bus seating popup window!
    setSelectedDate(dayDate);
    setSelectedSeatsForBooking([]);
    setCallerName('');
    setCallerPhone('');
    setInspectedSeatReservation(null);
    setShowBusSeatingModal(true);
  };

  // Selected date key
  const selectedDateKey = formatDateKey(selectedDate);

  // Get seat info for the selected date (1 to 40)
  const getSeatInfoForDate = (seatNum) => {
    // 1. Is this seat currently selected for a new booking by the conductor?
    if (selectedSeatsForBooking.includes(seatNum)) {
      return {
        seatNumber: seatNum,
        status: 'SELECTED',
        reservation: null,
      };
    }

    // 2. Is this seat already booked/reserved on this date?
    const foundRes = reservations.find(
      (r) => r.dateKey === selectedDateKey && (r.seats || []).includes(seatNum)
    );

    if (foundRes) {
      return {
        seatNumber: seatNum,
        status: foundRes.status, // 'PENDING_PAYMENT' | 'CONFIRMED'
        reservation: foundRes,
      };
    }

    // 3. Otherwise, vacant / available
    return {
      seatNumber: seatNum,
      status: 'AVAILABLE',
      reservation: null,
    };
  };

  // Toggle seat selection on the bus map
  const handleSeatPress = (seatNum) => {
    const info = getSeatInfoForDate(seatNum);

    if (info.status === 'AVAILABLE') {
      // Toggle into selectedSeatsForBooking
      setInspectedSeatReservation(null);
      setSelectedSeatsForBooking((prev) =>
        prev.includes(seatNum) ? prev.filter((s) => s !== seatNum) : [...prev, seatNum].sort((a, b) => a - b)
      );
    } else if (info.status === 'SELECTED') {
      // Remove from selection
      setSelectedSeatsForBooking((prev) => prev.filter((s) => s !== seatNum));
    } else if (info.status === 'PENDING_PAYMENT') {
      // Inspect pending reservation
      setSelectedSeatsForBooking([]);
      setInspectedSeatReservation(info.reservation);
    } else if (info.status === 'CONFIRMED') {
      // Inspect confirmed reservation
      setSelectedSeatsForBooking([]);
      setInspectedSeatReservation(info.reservation);
    }
  };

  // -------------------------------------------------------------
  // SUBMIT PENDING RESERVATION & SEND WHATSAPP TO INPUT NUMBER
  // -------------------------------------------------------------
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

    const newReservation = {
      id: resId,
      ticketRef: null,
      customerName: callerName.trim(),
      phone: callerPhone.trim(),
      dateKey: selectedDateKey,
      seats: [...selectedSeatsForBooking],
      pickup: callerPickup,
      amount: totalAmount,
      status: 'PENDING_PAYMENT',
      createdAt: 'Just now',
      bankRef: null,
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Prepare Official WhatsApp Message with PNG Bank Details
    const waMessage = `🚌 *PNG EXPRESS - SEAT RESERVATION (PENDING PAYMENT)*

Dear ${callerName.trim()},
Your provisional seat reservation has been recorded by Conductor ${user?.name || 'Nimal Silva'} (Route 87: Thambuththegama ➔ Jaffna).

📋 *Reservation Details:*
• Ref Number: *${resId}*
• Travel Date: *${formatDisplayDate(selectedDate)}*
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

    // Clear inputs and selection
    setSelectedSeatsForBooking([]);
    setCallerName('');
    setCallerPhone('');

    // Open WhatsApp directly to the customer's phone number
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

  // -------------------------------------------------------------
  // VERIFY PAYMENT & PERMANENTLY RESERVE (DISPATCH QR VIA WHATSAPP)
  // -------------------------------------------------------------
  const handleInitiatePaymentVerification = (res) => {
    setActivePendingToVerify(res);
    setBankSlipRef(`Slip #CB-${Math.floor(1000 + Math.random() * 9000)}`);
    setShowVerifyModal(true);
  };

  const handleConfirmPermanentBooking = async () => {
    if (!activePendingToVerify) return;

    setIsVerifyingPayment(true);
    const generatedTicketRef = `PNG-TKT-${Math.floor(2000 + Math.random() * 8000)}`;
    const verifiedSlip = bankSlipRef.trim() || 'Direct Online Transfer Verified';

    setReservations((prev) =>
      prev.map((r) =>
        r.id === activePendingToVerify.id
          ? {
              ...r,
              status: 'CONFIRMED',
              ticketRef: generatedTicketRef,
              bankRef: verifiedSlip,
            }
          : r
      )
    );

    const verifiedRes = {
      ...activePendingToVerify,
      status: 'CONFIRMED',
      ticketRef: generatedTicketRef,
      bankRef: verifiedSlip,
    };

    setShowVerifyModal(false);
    setIsVerifyingPayment(false);
    setInspectedSeatReservation(verifiedRes);

    // Prepare WhatsApp Message with Confirmed Ticket and Digital QR Pass Link
    const qrPassUrl = `https://pngexpress.lk/ticket/${generatedTicketRef}`;
    const waTicketMessage = `✅ *PNG EXPRESS - OFFICIAL CONFIRMED TICKET & QR PASS*

Dear ${activePendingToVerify.customerName},
Your payment of *LKR ${activePendingToVerify.amount.toLocaleString()}* has been *VERIFIED* by the bus conductor! Your seats are now *PERMANENTLY RESERVED*.

🎫 *Official Digital Ticket Pass:*
• Ticket Number: *${generatedTicketRef}*
• Passenger: *${activePendingToVerify.customerName}*
• Date of Travel: *${formatDisplayDate(selectedDate)}*
• Route: *Route 87 (Thambuththegama ➔ Jaffna)*
• Bus Plate: *NB-4592 (Scania Luxury Touring)*
• Confirmed Seats: *Seats ${activePendingToVerify.seats.join(', ')}*
• Boarding Location: *${activePendingToVerify.pickup}*
• Verification: *PAID & VERIFIED (${verifiedSlip})*

📲 *Your Digital Ticket & QR Code Pass:*
${qrPassUrl}

Please show this digital ticket / QR pass to the bus crew when boarding. Have a safe and pleasant journey with PNG Express!`;

    Alert.alert(
      'Payment Verified & Seats Confirmed',
      `Ticket ${generatedTicketRef} issued. Opening WhatsApp now to send the official QR Pass to ${activePendingToVerify.phone}...`,
      [
        {
          text: 'Send QR Pass via WhatsApp ➔',
          onPress: () => {
            sendWhatsAppMessage(activePendingToVerify.phone, waTicketMessage);
            setActiveConfirmedRes(verifiedRes);
            setShowQrModal(true);
          },
        },
      ]
    );
  };

  // Fast Week Days (7 Unlocked Days)
  const currentWeekDays = useMemo(() => {
    const days = [];
    const temp = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const cur = new Date(temp);
      const key = formatDateKey(cur);
      const isSelected = formatDateKey(selectedDate) === key;
      const isTodayDate = formatDateKey(today) === key;

      const dayBookings = reservations.filter((r) => r.dateKey === key);
      const pendingCount = dayBookings.filter((r) => r.status === 'PENDING_PAYMENT').length;
      const confirmedCount = dayBookings.filter((r) => r.status === 'CONFIRMED').length;

      days.push({
        date: cur,
        key,
        dayName: cur.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: cur.getDate(),
        isTodayDate,
        isSelected,
        pendingCount,
        confirmedCount,
      });

      temp.setDate(temp.getDate() + 1);
    }
    return days;
  }, [weekStart, selectedDate, today, reservations]);

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

      const dayBookings = reservations.filter((r) => r.dateKey === dateKey);
      const hasPending = dayBookings.some((r) => r.status === 'PENDING_PAYMENT');
      const hasConfirmed = dayBookings.some((r) => r.status === 'CONFIRMED');

      cells.push({
        empty: false,
        id: `day-${dateKey}`,
        dayNumber: d,
        date: dayDate,
        dateKey,
        unlocked,
        isTodayDate,
        isSelected,
        hasPending,
        hasConfirmed,
      });
    }

    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        cells.push({ empty: true, id: `empty-post-${i}` });
      }
    }

    return cells;
  }, [calendarYear, calendarMonth, today, selectedDate, reservations, weekStart, weekEnd]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Header Bar */}
      <View style={styles.topProfileBar}>
        <View style={styles.profileBadgeCol}>
          <Text style={styles.roleTitle}>Conductor Desk</Text>
          <Text style={styles.conductorNameText}>
            {user?.name || 'Nimal Silva'} • Badge #{user?.conductorDetails?.badgeNo || 'COND-WP-9920'}
          </Text>
        </View>

        <View style={styles.busRouteTag}>
          <Ionicons name="bus" size={13} color="#006FD8" />
          <Text style={styles.busRouteTagText}>NB-4592 • Route 87</Text>
        </View>
      </View>

      {/* 2. Instruction Banner */}
      <View style={styles.weekNoticeCard}>
        <View style={styles.weekNoticeIconCircle}>
          <Ionicons name="calendar" size={18} color="#006FD8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.weekNoticeTitle}>Tap Any Date to Open Bus Seating</Text>
          <Text style={styles.weekNoticeSub}>
            Only the active operational week ({formatDisplayDate(weekStart)} –{' '}
            {formatDisplayDate(weekEnd)}) is unlocked. Tap any active date to view seating & reserve seats pendingly.
          </Text>
        </View>
      </View>

      {/* 3. Fast Current Week Carousel */}
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

            {item.pendingCount > 0 ? (
              <View style={styles.miniPendingDot}>
                <Text style={styles.miniPendingDotText}>{item.pendingCount}</Text>
              </View>
            ) : item.confirmedCount > 0 ? (
              <View style={styles.miniConfirmedDot} />
            ) : null}

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

      {/* 4. Full Month Interactive Calendar */}
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

        {/* Weekday Columns */}
        <View style={styles.weekdayRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Text key={day} style={styles.weekdayColText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Days Matrix */}
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

                {!cell.unlocked ? (
                  <View style={styles.lockedMiniIcon}>
                    <Ionicons name="lock-closed" size={9} color="#94A3B8" />
                  </View>
                ) : (
                  <View style={styles.dayDotRow}>
                    {cell.hasPending && <View style={styles.pendingDotMini} />}
                    {cell.hasConfirmed && <View style={styles.confirmedDotMini} />}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.calendarLegendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, { backgroundColor: '#FFFFFF', borderColor: '#006FD8', borderWidth: 1.5 }]} />
            <Text style={styles.legendLabel}>Active (Tap to Open Bus)</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, { backgroundColor: '#F1F5F9' }]} />
            <Text style={styles.legendLabel}>Locked Days</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendLabel}>Pending Reserve</Text>
          </View>
        </View>
      </View>

      {/* 5. Selected Day Direct Action Box */}
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

          {/* Large prominent button to open Bus Seating Window directly */}
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
            {/* Modal Header */}
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

            {/* Scrollable Bus Interior Layout & Form */}
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

              {/* 40-Seat Coach Layout (10 Rows × 4 Seats: Left Pair, Aisle, Right Pair) */}
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
                      {/* Left Pair (Window & Aisle) */}
                      <View style={styles.seatPair}>
                        {renderSeatBtn(s1)}
                        {renderSeatBtn(s2)}
                      </View>

                      {/* Walking Aisle */}
                      <View style={styles.aisleGap}>
                        <Text style={styles.aisleText}>{rowIdx}</Text>
                      </View>

                      {/* Right Pair (Aisle & Window) */}
                      <View style={styles.seatPair}>
                        {renderSeatBtn(s3)}
                        {renderSeatBtn(s4)}
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* SECTION A: WHEN CONDUCTOR SELECTS SEATS -> SHOW CUSTOMER INFO FORM */}
              {selectedSeatsForBooking.length > 0 && (
                <View style={styles.reservationFormBox}>
                  <View style={styles.reservationFormHeader}>
                    <Ionicons name="create-outline" size={18} color="#006FD8" />
                    <Text style={styles.reservationFormTitle}>
                      Reserve Seats: {selectedSeatsForBooking.join(', ')} ({selectedSeatsForBooking.length} Seat{selectedSeatsForBooking.length > 1 ? 's' : ''})
                    </Text>
                  </View>

                  {/* Customer / Caller Name */}
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

                  {/* WhatsApp Mobile Number */}
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

                  {/* Boarding Point */}
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

                  {/* Fare Summary */}
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

                  {/* SUBMIT BUTTON: CONFIRM PENDING & SEND WHATSAPP */}
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

              {/* SECTION B: WHEN CONDUCTOR TAPS AN EXISTING BOOKED / PENDING SEAT */}
              {inspectedSeatReservation && selectedSeatsForBooking.length === 0 && (
                <View
                  style={[
                    styles.inspectedSeatCard,
                    inspectedSeatReservation.status === 'PENDING_PAYMENT'
                      ? styles.inspectedSeatCardPending
                      : styles.inspectedSeatCardConfirmed,
                  ]}
                >
                  <View style={styles.inspectedTopRow}>
                    <View>
                      <Text style={styles.inspectedName}>
                        {inspectedSeatReservation.customerName}
                      </Text>
                      <Text style={styles.inspectedSub}>
                        📞 {inspectedSeatReservation.phone} • {inspectedSeatReservation.pickup}
                      </Text>
                      <Text style={styles.inspectedSeats}>
                        Seats: {inspectedSeatReservation.seats.join(', ')} • Fare: LKR{' '}
                        {inspectedSeatReservation.amount.toLocaleString()}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.inspectedBadge,
                        inspectedSeatReservation.status === 'PENDING_PAYMENT'
                          ? styles.badgePending
                          : styles.badgeConfirmed,
                      ]}
                    >
                      <Text
                        style={
                          inspectedSeatReservation.status === 'PENDING_PAYMENT'
                            ? styles.badgePendingText
                            : styles.badgeConfirmedText
                        }
                      >
                        {inspectedSeatReservation.status === 'PENDING_PAYMENT'
                          ? 'Pending Slip'
                          : 'Permanently Reserved'}
                      </Text>
                    </View>
                  </View>

                  {/* Actions for this inspected reservation */}
                  {inspectedSeatReservation.status === 'PENDING_PAYMENT' ? (
                    <View style={styles.inspectedActionsRow}>
                      <TouchableOpacity
                        style={styles.btnSecondaryWa}
                        onPress={() => {
                          const msg = `🚌 *PNG EXPRESS - BANK DETAILS REMINDER*

Dear ${inspectedSeatReservation.customerName},
Please transfer LKR ${inspectedSeatReservation.amount.toLocaleString()} to our Commercial Bank Account (1000 8492 8821, PNG Express Pvt Ltd) to confirm your Seats ${inspectedSeatReservation.seats.join(
                            ', '
                          )}. Reply with slip to get your digital QR ticket.`;
                          sendWhatsAppMessage(inspectedSeatReservation.phone, msg);
                        }}
                      >
                        <Ionicons name="logo-whatsapp" size={14} color="#006FD8" />
                        <Text style={styles.btnSecondaryWaText}>Re-send Bank Info</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnPrimaryVerify}
                        onPress={() =>
                          handleInitiatePaymentVerification(inspectedSeatReservation)
                        }
                      >
                        <Ionicons name="checkmark-circle" size={15} color="#FFFFFF" />
                        <Text style={styles.btnPrimaryVerifyText}>Verify & Permanent Reserve</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.inspectedActionsRow}>
                      <TouchableOpacity
                        style={styles.btnViewQrSmall}
                        onPress={() => {
                          setActiveConfirmedRes(inspectedSeatReservation);
                          setShowQrModal(true);
                        }}
                      >
                        <Ionicons name="qr-code" size={14} color="#006FD8" />
                        <Text style={styles.btnViewQrSmallText}>View Ticket QR</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnShareQrWa}
                        onPress={() => {
                          const passMsg = `✅ *PNG EXPRESS - CONFIRMED TICKET QR PASS*

Dear ${inspectedSeatReservation.customerName},
Your confirmed ticket for ${formatDisplayDate(selectedDate)}:
• Ticket: *${inspectedSeatReservation.ticketRef}*
• Seats: *Seats ${inspectedSeatReservation.seats.join(', ')}*
• Digital QR Ticket: https://pngexpress.lk/ticket/${inspectedSeatReservation.ticketRef}`;
                          sendWhatsAppMessage(inspectedSeatReservation.phone, passMsg);
                        }}
                      >
                        <Ionicons name="share-social" size={14} color="#059669" />
                        <Text style={styles.btnShareQrWaText}>Send QR to WhatsApp</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* Friendly empty selection hint */}
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

      {/* ============================================================= */}
      {/* POP-UP WINDOW 2: VERIFY PAYMENT & PERMANENTLY RESERVE (QR)     */}
      {/* ============================================================= */}
      <Modal
        visible={showVerifyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVerifyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowVerifyModal(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.modalBusIconCircle, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                  <Ionicons name="checkmark-done" size={18} color="#059669" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Verify Payment & Confirm</Text>
                  <Text style={styles.modalHeaderSub}>Permanent reserve & send QR code</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowVerifyModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {activePendingToVerify && (
              <View style={styles.verificationCardContent}>
                <View style={styles.verifyCustomerBox}>
                  <Text style={styles.verifyCustomerName}>
                    {activePendingToVerify.customerName}
                  </Text>
                  <Text style={styles.verifyCustomerSub}>
                    WhatsApp: {activePendingToVerify.phone} • Date: {formatDisplayDate(selectedDate)}
                  </Text>
                  <Text style={styles.verifySeatsText}>
                    Seats: {activePendingToVerify.seats.join(', ')} • Pickup: {activePendingToVerify.pickup}
                  </Text>
                </View>

                <View style={styles.verifyAmountBox}>
                  <Text style={styles.verifyAmountLabel}>Payment Amount Verified:</Text>
                  <Text style={styles.verifyAmountNumber}>
                    LKR {activePendingToVerify.amount.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Bank Slip / Receipt Reference</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. Commercial Bank Slip #CB-9912"
                    placeholderTextColor="#94A3B8"
                    value={bankSlipRef}
                    onChangeText={setBankSlipRef}
                  />
                </View>

                <View style={styles.qrDispatchNotice}>
                  <Ionicons name="qr-code" size={18} color="#006FD8" />
                  <Text style={styles.qrDispatchNoticeText}>
                    Clicking confirm will permanently lock these seats and automatically dispatch
                    the official Digital Ticket QR Pass to the customer via WhatsApp.
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.btnConfirmPaymentMain}
              onPress={handleConfirmPermanentBooking}
              disabled={isVerifyingPayment}
              activeOpacity={0.85}
            >
              {isVerifyingPayment ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              )}
              <Text style={styles.btnConfirmPaymentMainText}>
                Confirm Permanent Reserve & Send QR Code ➔
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ============================================================= */}
      {/* POP-UP WINDOW 3: VIEW OFFICIAL DIGITAL TICKET & QR CODE PASS  */}
      {/* ============================================================= */}
      <Modal
        visible={showQrModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowQrModal(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.modalBusIconCircle}>
                  <Ionicons name="qr-code" size={18} color="#006FD8" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Digital Ticket Pass</Text>
                  <Text style={styles.modalHeaderSub}>
                    {activeConfirmedRes?.ticketRef || 'Official Ticket'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowQrModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {activeConfirmedRes && (
              <View style={styles.ticketCardContainer}>
                <View style={styles.ticketVerifiedBanner}>
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  <Text style={styles.ticketVerifiedBannerText}>
                    PAID & PERMANENTLY RESERVED (CONDUCTOR VERIFIED)
                  </Text>
                </View>

                {/* QR Code Image */}
                <View style={styles.qrCodeWrapper}>
                  <Image
                    source={{
                      uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://pngexpress.lk/ticket/${activeConfirmedRes.ticketRef}`,
                    }}
                    style={styles.qrCodeImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.qrPassTokenText}>{activeConfirmedRes.ticketRef}</Text>
                </View>

                {/* Info List */}
                <View style={styles.ticketInfoList}>
                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Passenger Name:</Text>
                    <Text style={styles.ticketInfoValueBold}>
                      {activeConfirmedRes.customerName}
                    </Text>
                  </View>

                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Travel Date:</Text>
                    <Text style={styles.ticketInfoValue}>
                      {formatDisplayDate(selectedDate)}
                    </Text>
                  </View>

                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Assigned Seats:</Text>
                    <Text style={styles.ticketInfoValueSeats}>
                      Seats {activeConfirmedRes.seats.join(', ')}
                    </Text>
                  </View>

                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Route & Bus:</Text>
                    <Text style={styles.ticketInfoValue}>Route 87 • NB-4592</Text>
                  </View>

                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Pickup Location:</Text>
                    <Text style={styles.ticketInfoValue}>{activeConfirmedRes.pickup}</Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.btnResendQrMain}
              onPress={() => {
                if (!activeConfirmedRes) return;
                const passMsg = `✅ *PNG EXPRESS - CONFIRMED TICKET & QR PASS*

Dear ${activeConfirmedRes.customerName},
Here is your official digital ticket:
• Ticket Number: *${activeConfirmedRes.ticketRef}*
• Travel Date: *${formatDisplayDate(selectedDate)}*
• Confirmed Seats: *Seats ${activeConfirmedRes.seats.join(', ')}*
• Pickup Location: *${activeConfirmedRes.pickup}*
• Digital Ticket & QR Code: https://pngexpress.lk/ticket/${activeConfirmedRes.ticketRef}

Please show this digital ticket / QR pass to the conductor during boarding. Safe travels!`;
                sendWhatsAppMessage(activeConfirmedRes.phone, passMsg);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.btnResendQrMainText}>
                Share Ticket QR Pass to WhatsApp ➔
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
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

  // 1. Top Bar
  topProfileBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  profileBadgeCol: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  conductorNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  busRouteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  busRouteTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006FD8',
  },

  // 2. Week Notice
  weekNoticeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 12,
  },
  weekNoticeIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNoticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
  },
  weekNoticeSub: {
    fontSize: 11,
    color: '#0284C7',
    marginTop: 2,
    lineHeight: 15,
  },

  // 3. Fast Week Carousel
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
  miniPendingDot: {
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  miniPendingDotText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  miniConfirmedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginTop: 4,
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

  // 4. Calendar Card
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
  dayDotRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  pendingDotMini: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F59E0B',
  },
  confirmedDotMini: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
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
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },

  // 5. Selected Day Card
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

  // BUS SEATING POPUP MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
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
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
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

  // Bus Legend
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

  // Front Cabin
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

  // Coach Body
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

  // Reservation Form Inside Popup
  reservationFormBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginTop: 8,
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
  reservationFormTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
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

  // Inspected Seat Details
  inspectedSeatCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    marginTop: 8,
  },
  inspectedSeatCardPending: {
    backgroundColor: '#FFFDF5',
    borderColor: '#FDE68A',
  },
  inspectedSeatCardConfirmed: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  inspectedTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  inspectedName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  inspectedSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  inspectedSeats: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
    marginTop: 3,
  },
  inspectedBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgePendingText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  badgeConfirmed: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeConfirmedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  inspectedActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  btnSecondaryWa: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnSecondaryWaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#006FD8',
  },
  btnPrimaryVerify: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnPrimaryVerifyText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnViewQrSmall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnViewQrSmallText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#006FD8',
  },
  btnShareQrWa: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  btnShareQrWaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
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

  // Modal Card Generic
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },
  verificationCardContent: {
    marginBottom: 12,
  },
  verifyCustomerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  verifyCustomerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifyCustomerSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  verifySeatsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
    marginTop: 3,
  },
  verifyAmountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 10,
  },
  verifyAmountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  verifyAmountNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#047857',
  },
  qrDispatchNotice: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  qrDispatchNoticeText: {
    fontSize: 10,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 14,
  },
  btnConfirmPaymentMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 6,
  },
  btnConfirmPaymentMainText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // QR Modal
  ticketCardContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  ticketVerifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  ticketVerifiedBannerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  qrCodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 10,
  },
  qrCodeImage: {
    width: 140,
    height: 140,
  },
  qrPassTokenText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  ticketInfoList: {
    gap: 4,
  },
  ticketInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketInfoLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  ticketInfoValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  ticketInfoValueBold: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  ticketInfoValueSeats: {
    fontSize: 11,
    fontWeight: '900',
    color: '#006FD8',
  },
  btnResendQrMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 11,
    borderRadius: 10,
  },
  btnResendQrMainText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
