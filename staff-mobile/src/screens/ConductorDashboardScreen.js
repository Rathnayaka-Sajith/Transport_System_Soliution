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
  swiftCode: 'CCEYLKX',
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
        'WhatsApp Alert',
        `Could not open WhatsApp app directly. Formatted message for +${cleanPhone}:\n\n${message}`
      );
    }
  }
};

// Initial Mock Call-In and Online Reservations
const INITIAL_RESERVATIONS = [
  {
    id: 'RES-8812',
    ticketRef: null,
    customerName: 'Chaminda Senanayake',
    phone: '076 554 9911',
    dateKey: '2026-10-31',
    seats: [21, 22],
    seatCount: 2,
    pickup: 'Anuradhapura New Town Bus Stand',
    amount: 4800,
    status: 'PENDING_PAYMENT', // 'PENDING_PAYMENT' | 'CONFIRMED'
    createdAt: '10:15 AM Today',
    bankRef: null,
  },
  {
    id: 'RES-8815',
    ticketRef: null,
    customerName: 'V. Ramanathan',
    phone: '077 341 8820',
    dateKey: '2026-10-31',
    seats: [6, 7],
    seatCount: 2,
    pickup: 'Thalawa Junction',
    amount: 4800,
    status: 'PENDING_PAYMENT',
    createdAt: '09:40 AM Today',
    bankRef: null,
  },
  {
    id: 'RES-8701',
    ticketRef: 'PNG-TKT-1081',
    customerName: 'Kasun Bandara',
    phone: '077 123 9081',
    dateKey: '2026-10-31',
    seats: [1, 2],
    seatCount: 2,
    pickup: 'Thambuththegama Central Depot',
    amount: 4800,
    status: 'CONFIRMED',
    createdAt: 'Yesterday 04:30 PM',
    bankRef: 'Commercial Bank Slip #CB-9941',
  },
  {
    id: 'RES-8702',
    ticketRef: 'PNG-TKT-1082',
    customerName: 'Mohamed Rizwan',
    phone: '077 665 4433',
    dateKey: '2026-10-31',
    seats: [12, 13],
    seatCount: 2,
    pickup: 'Thambuththegama Central Depot',
    amount: 4800,
    status: 'CONFIRMED',
    createdAt: 'Yesterday 06:10 PM',
    bankRef: 'Bank of Ceylon Slip #BOC-1029',
  },
  {
    id: 'RES-8703',
    ticketRef: 'PNG-TKT-1083',
    customerName: 'Sithara Fernando',
    phone: '071 883 1920',
    dateKey: '2026-10-31',
    seats: [5],
    seatCount: 1,
    pickup: 'Thalawa Junction',
    amount: 2400,
    status: 'CONFIRMED',
    createdAt: 'Yesterday 08:20 PM',
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
  const [reservationFilter, setReservationFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'CONFIRMED'

  // Modal 1: Call-in Seat Reservation (Pending Reserve)
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [callerSeatsCount, setCallerSeatsCount] = useState(2);
  const [callerPickup, setCallerPickup] = useState('Thambuththegama Central Depot');
  const [isSubmittingReserve, setIsSubmittingReserve] = useState(false);

  // Modal 2: Verify Payment & Permanently Reserve
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [activePendingRes, setActivePendingRes] = useState(null);
  const [bankSlipRef, setBankSlipRef] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Modal 3: View Confirmed QR Ticket Pass
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeConfirmedRes, setActiveConfirmedRes] = useState(null);

  // Check if a date falls strictly within the current unlocked operational week
  const isDateUnlocked = (testDate) => {
    const t = new Date(testDate).setHours(12, 0, 0, 0);
    return t >= weekStart.getTime() && t <= weekEnd.getTime();
  };

  // Generate 7 days of the current week for quick horizontal carousel
  const currentWeekDays = useMemo(() => {
    const days = [];
    const temp = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const cur = new Date(temp);
      const key = formatDateKey(cur);
      const isSelected = formatDateKey(selectedDate) === key;
      const isTodayDate = formatDateKey(today) === key;

      // Count bookings for this day
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

  // Generate Calendar Matrix for calendarMonth and calendarYear
  const calendarMatrix = useMemo(() => {
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1);
    const lastDayOfMonth = new Date(calendarYear, calendarMonth + 1, 0);

    // Day of week for 1st of month: 0 (Sun) to 6 (Sat)
    // Convert to Monday=0, ..., Sun=6
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();

    const cells = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ empty: true, id: `empty-pre-${i}` });
    }

    // Days of current month
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
        bookingsCount: dayBookings.length,
      });
    }

    // Fill remaining cells to complete grid
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        cells.push({ empty: true, id: `empty-post-${i}` });
      }
    }

    return cells;
  }, [calendarYear, calendarMonth, today, selectedDate, reservations, weekStart, weekEnd]);

  // Filter reservations for the active selected date
  const selectedDateKey = formatDateKey(selectedDate);
  const activeDateReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (r.dateKey !== selectedDateKey) return false;
      if (reservationFilter === 'PENDING') return r.status === 'PENDING_PAYMENT';
      if (reservationFilter === 'CONFIRMED') return r.status === 'CONFIRMED';
      return true;
    });
  }, [reservations, selectedDateKey, reservationFilter]);

  // Overall counts for selected date
  const selectedDateTotal = reservations.filter((r) => r.dateKey === selectedDateKey);
  const selectedDatePending = selectedDateTotal.filter((r) => r.status === 'PENDING_PAYMENT');
  const selectedDateConfirmed = selectedDateTotal.filter((r) => r.status === 'CONFIRMED');
  const totalBookedSeats = selectedDateTotal.reduce((sum, r) => sum + r.seatCount, 0);
  const vacantSeats = Math.max(0, 40 - totalBookedSeats);

  // Determine next available seats to assign for call-in booking
  const getNextAvailableSeats = (quantity) => {
    const bookedSeatSet = new Set();
    selectedDateTotal.forEach((r) => {
      (r.seats || []).forEach((s) => bookedSeatSet.add(s));
    });

    const allocated = [];
    for (let s = 1; s <= 40 && allocated.length < quantity; s++) {
      if (!bookedSeatSet.has(s)) {
        allocated.push(s);
      }
    }
    return allocated;
  };

  // Handle clicking a date on the calendar
  const handleSelectCalendarDate = (cell) => {
    if (!cell.unlocked) {
      Alert.alert(
        'Date Locked',
        `Bookings are restricted strictly to the current operational week (${formatDisplayDate(
          weekStart
        )} - ${formatDisplayDate(weekEnd)}).`
      );
      return;
    }
    setSelectedDate(cell.date);
  };

  // -------------------------------------------------------------
  // STEP 1: CREATE CALL-IN PENDING RESERVATION & SEND BANK INFO VIA WHATSAPP
  // -------------------------------------------------------------
  const handleCreatePendingReserve = async () => {
    if (!callerName.trim()) {
      Alert.alert('Required Field', 'Please enter caller customer name.');
      return;
    }
    if (!callerPhone.trim() || callerPhone.trim().length < 9) {
      Alert.alert('Required Field', 'Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    setIsSubmittingReserve(true);

    const allocatedSeats = getNextAvailableSeats(callerSeatsCount);
    const totalAmount = callerSeatsCount * FARE_PER_SEAT;
    const resId = `RES-${Math.floor(8820 + Math.random() * 900)}`;

    const newReservation = {
      id: resId,
      ticketRef: null,
      customerName: callerName.trim(),
      phone: callerPhone.trim(),
      dateKey: selectedDateKey,
      seats: allocatedSeats,
      seatCount: callerSeatsCount,
      pickup: callerPickup,
      amount: totalAmount,
      status: 'PENDING_PAYMENT',
      createdAt: 'Just now',
      bankRef: null,
    };

    setReservations((prev) => [newReservation, ...prev]);
    setShowReserveModal(false);
    setIsSubmittingReserve(false);

    // Prepare WhatsApp Message with PNG Express Bank Details
    const waMessage = `🚌 *PNG EXPRESS - SEAT RESERVATION (PENDING PAYMENT)*

Dear ${callerName.trim()},
Your provisional seat reservation has been recorded by Conductor ${user?.name || 'Nimal Silva'} (Route 87: Thambuththegama ➔ Jaffna).

📋 *Reservation Details:*
• Ref Number: *${resId}*
• Date of Travel: *${formatDisplayDate(selectedDate)}*
• Reserved Seats: *Seats ${allocatedSeats.join(', ')}* (${callerSeatsCount} Seats)
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

    Alert.alert(
      'Pending Reservation Saved',
      `Seats ${allocatedSeats.join(', ')} held provisionally. Opening WhatsApp now to send PNG bank details to ${callerPhone.trim()}...`,
      [
        {
          text: 'Open WhatsApp ➔',
          onPress: () => sendWhatsAppMessage(callerPhone.trim(), waMessage),
        },
      ]
    );

    // Reset Form
    setCallerName('');
    setCallerPhone('');
    setCallerSeatsCount(2);
  };

  // -------------------------------------------------------------
  // STEP 2: VERIFY PAYMENT & PERMANENTLY RESERVE (SEND QR PASS VIA WHATSAPP)
  // -------------------------------------------------------------
  const handleInitiateVerification = (res) => {
    setActivePendingRes(res);
    setBankSlipRef(`Slip #CB-${Math.floor(1000 + Math.random() * 9000)}`);
    setShowVerifyModal(true);
  };

  const handleConfirmPermanentBooking = async () => {
    if (!activePendingRes) return;

    setIsVerifyingPayment(true);
    const generatedTicketRef = `PNG-TKT-${Math.floor(2000 + Math.random() * 8000)}`;
    const verifiedSlip = bankSlipRef.trim() || 'Direct Online Transfer Verified';

    // Update reservation status to CONFIRMED
    setReservations((prev) =>
      prev.map((r) =>
        r.id === activePendingRes.id
          ? {
              ...r,
              status: 'CONFIRMED',
              ticketRef: generatedTicketRef,
              bankRef: verifiedSlip,
              verifiedAt: 'Just now',
            }
          : r
      )
    );

    const verifiedRes = {
      ...activePendingRes,
      status: 'CONFIRMED',
      ticketRef: generatedTicketRef,
      bankRef: verifiedSlip,
    };

    setShowVerifyModal(false);
    setIsVerifyingPayment(false);

    // Prepare WhatsApp Message with Confirmed Ticket and Digital QR Pass Link
    const qrPassUrl = `https://pngexpress.lk/ticket/${generatedTicketRef}`;
    const waTicketMessage = `✅ *PNG EXPRESS - OFFICIAL CONFIRMED TICKET & QR PASS*

Dear ${activePendingRes.customerName},
Your payment of *LKR ${activePendingRes.amount.toLocaleString()}* has been *VERIFIED* by the bus conductor! Your seats are now *PERMANENTLY RESERVED*.

🎫 *Official Digital Ticket Pass:*
• Ticket Number: *${generatedTicketRef}*
• Passenger: *${activePendingRes.customerName}*
• Date of Travel: *${formatDisplayDate(selectedDate)}*
• Route: *Route 87 (Thambuththegama ➔ Jaffna)*
• Bus Plate: *NB-4592 (Scania Luxury Touring)*
• Assigned Seats: *Seats ${activePendingRes.seats.join(', ')}*
• Boarding Location: *${activePendingRes.pickup}*
• Verification: *PAID & VERIFIED (${verifiedSlip})*

📲 *Your Digital Ticket & QR Code Pass:*
${qrPassUrl}

Please show this digital ticket / QR pass to the bus crew when boarding. Have a safe and pleasant journey with PNG Express!`;

    Alert.alert(
      'Payment Verified & Seats Confirmed',
      `Ticket ${generatedTicketRef} issued. Opening WhatsApp now to dispatch the official QR Pass to ${activePendingRes.phone}...`,
      [
        {
          text: 'Send QR Pass via WhatsApp ➔',
          onPress: () => {
            sendWhatsAppMessage(activePendingRes.phone, waTicketMessage);
            // Also open on-screen QR modal for conductor view
            setActiveConfirmedRes(verifiedRes);
            setShowQrModal(true);
          },
        },
      ]
    );
  };

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Conductor Operational Profile Header */}
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

      {/* 2. Unlocked Week Alert Banner */}
      <View style={styles.weekNoticeCard}>
        <View style={styles.weekNoticeIconCircle}>
          <Ionicons name="calendar" size={18} color="#006FD8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.weekNoticeTitle}>Current Operational Week Unlocked</Text>
          <Text style={styles.weekNoticeSub}>
            Only the active operational week ({formatDisplayDate(weekStart)} –{' '}
            {formatDisplayDate(weekEnd)}) is unlocked for call-in reservations.
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
            onPress={() => setSelectedDate(item.date)}
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

      {/* 4. Full Month Interactive Calendar View */}
      <View style={styles.calendarCard}>
        {/* Month Header & Month Navigation */}
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
              onPress={handlePrevMonth}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={18} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.monthNavBtn}
              onPress={handleNextMonth}
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

        {/* Days Grid */}
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
                onPress={() => handleSelectCalendarDate(cell)}
                activeOpacity={cell.unlocked ? 0.75 : 0.9}
              >
                {/* Day Number */}
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

                {/* Lock or Status Indicators */}
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

        {/* Calendar Footer Legend */}
        <View style={styles.calendarLegendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, { backgroundColor: '#FFFFFF', borderColor: '#006FD8', borderWidth: 1.5 }]} />
            <Text style={styles.legendLabel}>Current Week (Unlocked)</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, { backgroundColor: '#F1F5F9' }]} />
            <Text style={styles.legendLabel}>Locked Days</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendLabel}>Pending Slip</Text>
          </View>
        </View>
      </View>

      {/* 5. Selected Date Summary & Call-In Action Header */}
      <View style={styles.dateActionCard}>
        <View style={styles.dateActionTopRow}>
          <View>
            <Text style={styles.selectedDateHeadline}>
              {formatDisplayDate(selectedDate)}
            </Text>
            <Text style={styles.selectedDateSub}>
              Route 87: Thambuththegama ➔ Jaffna • 40 Seats Total
            </Text>
          </View>

          {/* Call-In Reservation Action Button */}
          <TouchableOpacity
            style={styles.btnOpenCallIn}
            onPress={() => setShowReserveModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="call" size={15} color="#FFFFFF" />
            <Text style={styles.btnOpenCallInText}>New Call-In Booking</Text>
          </TouchableOpacity>
        </View>

        {/* Seat Metrics Row */}
        <View style={styles.seatMetricsRow}>
          <View style={styles.seatMetricBox}>
            <Text style={styles.seatMetricLabel}>Booked Seats</Text>
            <Text style={styles.seatMetricValueBold}>{totalBookedSeats} / 40</Text>
          </View>

          <View style={styles.seatMetricDivider} />

          <View style={styles.seatMetricBox}>
            <Text style={styles.seatMetricLabel}>Vacant Available</Text>
            <Text style={[styles.seatMetricValueBold, { color: '#059669' }]}>
              {vacantSeats} Seats
            </Text>
          </View>

          <View style={styles.seatMetricDivider} />

          <View style={styles.seatMetricBox}>
            <Text style={styles.seatMetricLabel}>Awaiting Bank Slip</Text>
            <Text style={[styles.seatMetricValueBold, { color: '#D97706' }]}>
              {selectedDatePending.length} Callers
            </Text>
          </View>
        </View>
      </View>

      {/* 6. Filter Segment: Pending vs Confirmed */}
      <View style={styles.filterSegmentRow}>
        <TouchableOpacity
          style={[
            styles.filterSegmentBtn,
            reservationFilter === 'ALL' && styles.filterSegmentBtnActive,
          ]}
          onPress={() => setReservationFilter('ALL')}
        >
          <Text
            style={[
              styles.filterSegmentText,
              reservationFilter === 'ALL' && styles.filterSegmentTextActive,
            ]}
          >
            All Bookings ({selectedDateTotal.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterSegmentBtn,
            reservationFilter === 'PENDING' && styles.filterSegmentBtnActive,
          ]}
          onPress={() => setReservationFilter('PENDING')}
        >
          <Text
            style={[
              styles.filterSegmentText,
              reservationFilter === 'PENDING' && styles.filterSegmentTextActive,
            ]}
          >
            ⏳ Pending ({selectedDatePending.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterSegmentBtn,
            reservationFilter === 'CONFIRMED' && styles.filterSegmentBtnActive,
          ]}
          onPress={() => setReservationFilter('CONFIRMED')}
        >
          <Text
            style={[
              styles.filterSegmentText,
              reservationFilter === 'CONFIRMED' && styles.filterSegmentTextActive,
            ]}
          >
            ✅ Confirmed ({selectedDateConfirmed.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 7. Active Reservations List */}
      <View style={styles.reservationsListWrapper}>
        {activeDateReservations.length === 0 ? (
          <View style={styles.emptyBookingsCard}>
            <Ionicons name="clipboard-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyBookingsTitle}>No reservations on this date</Text>
            <Text style={styles.emptyBookingsSub}>
              Tap "New Call-In Booking" to reserve seats for customers calling over the phone.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => setShowReserveModal(true)}
            >
              <Text style={styles.emptyAddBtnText}>+ Create Call-In Booking</Text>
            </TouchableOpacity>
          </View>
        ) : (
          activeDateReservations.map((item) => {
            const isPending = item.status === 'PENDING_PAYMENT';

            return (
              <View
                key={item.id}
                style={[
                  styles.bookingCard,
                  isPending ? styles.bookingCardPending : styles.bookingCardConfirmed,
                ]}
              >
                {/* Booking Card Header */}
                <View style={styles.bookingCardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.customerNameMain}>{item.customerName}</Text>
                      {isPending ? (
                        <View style={styles.badgePending}>
                          <Text style={styles.badgePendingText}>Pending Slip</Text>
                        </View>
                      ) : (
                        <View style={styles.badgeConfirmed}>
                          <Text style={styles.badgeConfirmedText}>Permanently Reserved</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.customerPhoneSub}>
                      📞 {item.phone} • Booked {item.createdAt}
                    </Text>
                  </View>

                  {/* WhatsApp Direct Chat Button */}
                  <TouchableOpacity
                    style={styles.iconChatBtn}
                    onPress={() =>
                      sendWhatsAppMessage(
                        item.phone,
                        `Hello ${item.customerName}, this is PNG Express Conductor ${user?.name || 'Nimal Silva'} regarding your seat booking.`
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                  </TouchableOpacity>
                </View>

                {/* Booking Details Grid */}
                <View style={styles.bookingDetailsBox}>
                  <View style={styles.bookingDetailRow}>
                    <Text style={styles.bookingDetailLabel}>Assigned Seats:</Text>
                    <Text style={styles.bookingDetailValueSeats}>
                      Seats {item.seats.join(', ')} ({item.seatCount} Seat{item.seatCount > 1 ? 's' : ''})
                    </Text>
                  </View>

                  <View style={styles.bookingDetailRow}>
                    <Text style={styles.bookingDetailLabel}>Pickup Point:</Text>
                    <Text style={styles.bookingDetailValue}>{item.pickup}</Text>
                  </View>

                  <View style={styles.bookingDetailRow}>
                    <Text style={styles.bookingDetailLabel}>Total Fare:</Text>
                    <Text style={styles.bookingDetailValueFare}>
                      LKR {item.amount.toLocaleString()}
                    </Text>
                  </View>

                  {!isPending && item.ticketRef && (
                    <View style={styles.bookingDetailRow}>
                      <Text style={styles.bookingDetailLabel}>Ticket Pass #:</Text>
                      <Text style={styles.bookingDetailValueTicket}>{item.ticketRef}</Text>
                    </View>
                  )}
                </View>

                {/* Primary Action Button Based on Status */}
                {isPending ? (
                  <View style={styles.pendingActionRow}>
                    <TouchableOpacity
                      style={styles.btnResendBankInfo}
                      onPress={() => {
                        const msg = `🚌 *PNG EXPRESS - BANK DETAILS REMINDER*

Dear ${item.customerName},
Here are our official bank details to complete your pending seat reservation (Seats ${item.seats.join(
                          ', '
                        )}):

• Bank: ${PNG_BANK_ACCOUNT.bankName}
• Account: ${PNG_BANK_ACCOUNT.accountNo}
• Account Name: ${PNG_BANK_ACCOUNT.accountName}
• Amount: LKR ${item.amount.toLocaleString()}

Please reply with your transfer slip to receive your digital ticket QR code.`;
                        sendWhatsAppMessage(item.phone, msg);
                      }}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="logo-whatsapp" size={15} color="#006FD8" />
                      <Text style={styles.btnResendBankInfoText}>Re-send Bank Details</Text>
                    </TouchableOpacity>

                    {/* KEY ACTION: VERIFY PAYMENT & PERMANENTLY RESERVE */}
                    <TouchableOpacity
                      style={styles.btnVerifyPaymentMain}
                      onPress={() => handleInitiateVerification(item)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                      <Text style={styles.btnVerifyPaymentMainText}>
                        Verify Payment & Reserve
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.confirmedActionRow}>
                    {/* VIEW & RE-SEND QR PASS */}
                    <TouchableOpacity
                      style={styles.btnViewQrPass}
                      onPress={() => {
                        setActiveConfirmedRes(item);
                        setShowQrModal(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="qr-code" size={15} color="#006FD8" />
                      <Text style={styles.btnViewQrPassText}>View Ticket QR Pass</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnResendQrWa}
                      onPress={() => {
                        const passMsg = `✅ *PNG EXPRESS - CONFIRMED TICKET QR PASS*

Dear ${item.customerName},
Your confirmed ticket for ${formatDisplayDate(selectedDate)}:
• Ticket Number: *${item.ticketRef}*
• Seats: *Seats ${item.seats.join(', ')}*
• Pickup: *${item.pickup}*
• Digital Ticket & QR Code: https://pngexpress.lk/ticket/${item.ticketRef}

Please show this to the bus conductor at boarding.`;
                        sendWhatsAppMessage(item.phone, passMsg);
                      }}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="share-social" size={15} color="#059669" />
                      <Text style={styles.btnResendQrWaText}>Send WhatsApp QR</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      <View style={{ height: 40 }} />

      {/* ============================================================= */}
      {/* MODAL 1: CALL-IN SEAT RESERVATION (PENDING RESERVE)           */}
      {/* ============================================================= */}
      <Modal
        visible={showReserveModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReserveModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowReserveModal(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.modalCallIconCircle}>
                  <Ionicons name="call" size={18} color="#006FD8" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Call-In Seat Reservation</Text>
                  <Text style={styles.modalHeaderSub}>
                    Travel Date: {formatDisplayDate(selectedDate)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowReserveModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Input Form */}
            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {/* Customer Name */}
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

              {/* Customer WhatsApp Phone */}
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
                  Bank payment details will be dispatched directly to this WhatsApp number.
                </Text>
              </View>

              {/* Seats Quantity Counter */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Number of Seats to Reserve</Text>
                <View style={styles.counterRow}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setCallerSeatsCount((c) => Math.max(1, c - 1))}
                  >
                    <Feather name="minus" size={16} color="#0F172A" />
                  </TouchableOpacity>

                  <View style={styles.counterDisplay}>
                    <Text style={styles.counterNumberText}>{callerSeatsCount}</Text>
                    <Text style={styles.counterUnitText}>
                      Seat{callerSeatsCount > 1 ? 's' : ''}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setCallerSeatsCount((c) => Math.min(6, c + 1))}
                  >
                    <Feather name="plus" size={16} color="#0F172A" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Pickup Location Selector */}
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

              {/* Automatic Fare & Bank Notice Summary Box */}
              <View style={styles.summaryNoticeBox}>
                <View style={styles.summaryPriceRow}>
                  <Text style={styles.summaryPriceLabel}>Total Provisional Fare:</Text>
                  <Text style={styles.summaryPriceValue}>
                    LKR {(callerSeatsCount * FARE_PER_SEAT).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.summaryBankNoticeRow}>
                  <Ionicons name="information-circle" size={15} color="#006FD8" />
                  <Text style={styles.summaryBankNoticeText}>
                    PNG Commercial Bank account details will automatically open in WhatsApp upon
                    confirming pending reservation.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Confirm Pending Reserve Button */}
            <TouchableOpacity
              style={styles.btnConfirmReserveMain}
              onPress={handleCreatePendingReserve}
              disabled={isSubmittingReserve}
              activeOpacity={0.85}
            >
              {isSubmittingReserve ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              )}
              <Text style={styles.btnConfirmReserveMainText}>
                Confirm Pending Reserve & Send Bank Info ➔
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ============================================================= */}
      {/* MODAL 2: VERIFY PAYMENT & PERMANENTLY RESERVE (SEND QR PASS)  */}
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
                <View style={[styles.modalCallIconCircle, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                  <Ionicons name="checkmark-done" size={18} color="#059669" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Verify Payment & Confirm</Text>
                  <Text style={styles.modalHeaderSub}>
                    Permanent seat issuance & QR dispatch
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowVerifyModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Passenger Info & Verification Details */}
            {activePendingRes && (
              <View style={styles.verificationCardContent}>
                <View style={styles.verifyCustomerBox}>
                  <Text style={styles.verifyCustomerName}>
                    {activePendingRes.customerName}
                  </Text>
                  <Text style={styles.verifyCustomerSub}>
                    WhatsApp: {activePendingRes.phone} • Travel Date:{' '}
                    {formatDisplayDate(selectedDate)}
                  </Text>
                  <Text style={styles.verifySeatsText}>
                    Assigned: Seats {activePendingRes.seats.join(', ')} ({activePendingRes.seatCount} Seat{activePendingRes.seatCount > 1 ? 's' : ''})
                  </Text>
                </View>

                {/* Amount to Verify */}
                <View style={styles.verifyAmountBox}>
                  <Text style={styles.verifyAmountLabel}>Payment Amount to Verify:</Text>
                  <Text style={styles.verifyAmountNumber}>
                    LKR {activePendingRes.amount.toLocaleString()}
                  </Text>
                </View>

                {/* Bank Slip Reference Input */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Bank Transfer Slip / Receipt Reference</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. Commercial Bank Slip #CB-9912"
                    placeholderTextColor="#94A3B8"
                    value={bankSlipRef}
                    onChangeText={setBankSlipRef}
                  />
                  <Text style={styles.inputHelpText}>
                    Enter the slip number or transaction reference sent by the passenger.
                  </Text>
                </View>

                {/* Action notice */}
                <View style={styles.qrDispatchNotice}>
                  <Ionicons name="qr-code" size={18} color="#006FD8" />
                  <Text style={styles.qrDispatchNoticeText}>
                    Upon confirmation, these seats are permanently booked and an official digital
                    ticket with a unique QR code will be dispatched to the customer's WhatsApp.
                  </Text>
                </View>
              </View>
            )}

            {/* Confirm & Send QR Button */}
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
      {/* MODAL 3: VIEW OFFICIAL DIGITAL TICKET & QR CODE PASS          */}
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
                <View style={styles.modalQrIconCircle}>
                  <Ionicons name="qr-code" size={18} color="#006FD8" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Digital Ticket Pass</Text>
                  <Text style={styles.modalHeaderSub}>
                    {activeConfirmedRes?.ticketRef || 'Official QR Pass'}
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

            {/* QR Card Container */}
            {activeConfirmedRes && (
              <View style={styles.ticketCardContainer}>
                {/* Verified Green Banner */}
                <View style={styles.ticketVerifiedBanner}>
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  <Text style={styles.ticketVerifiedBannerText}>
                    PAID & PERMANENTLY RESERVED (CONDUCTOR VERIFIED)
                  </Text>
                </View>

                {/* QR Code Graphic */}
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

                {/* Ticket Details */}
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

                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Payment Slip:</Text>
                    <Text style={styles.ticketInfoValueSlip}>
                      {activeConfirmedRes.bankRef || 'Verified'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Action to share via WhatsApp */}
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

  // 1. Top Profile Bar
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

  // 2. Unlocked Week Notice Card
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

  // 3. Fast Current Week Carousel
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
    position: 'relative',
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

  // 5. Selected Date Summary Card
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
    marginBottom: 12,
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
  btnOpenCallIn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#006FD8',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  btnOpenCallInText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  seatMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  seatMetricBox: {
    alignItems: 'center',
    flex: 1,
  },
  seatMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  seatMetricValueBold: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  seatMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },

  // 6. Filter Segment
  filterSegmentRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  filterSegmentBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  filterSegmentBtnActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  filterSegmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterSegmentTextActive: {
    color: '#006FD8',
  },

  // 7. Booking Cards
  reservationsListWrapper: {
    width: '100%',
  },
  emptyBookingsCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyBookingsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyBookingsSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 14,
  },
  emptyAddBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  emptyAddBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#006FD8',
  },
  bookingCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
  },
  bookingCardPending: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF5',
  },
  bookingCardConfirmed: {
    borderColor: '#E2E8F0',
  },
  bookingCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  customerNameMain: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgePendingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  badgeConfirmed: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeConfirmedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  customerPhoneSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  iconChatBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  bookingDetailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 4,
    marginBottom: 10,
  },
  bookingDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingDetailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  bookingDetailValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  bookingDetailValueSeats: {
    fontSize: 12,
    fontWeight: '900',
    color: '#006FD8',
  },
  bookingDetailValueFare: {
    fontSize: 12,
    fontWeight: '900',
    color: '#059669',
  },
  bookingDetailValueTicket: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6366F1',
  },
  pendingActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnResendBankInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnResendBankInfoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  btnVerifyPaymentMain: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnVerifyPaymentMainText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  confirmedActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnViewQrPass: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnViewQrPassText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  btnResendQrWa: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  btnResendQrWaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  // Modals Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  modalCallIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  modalQrIconCircle: {
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
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalHeaderSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  inputHelpText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 14,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  counterDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  counterNumberText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#006FD8',
  },
  counterUnitText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  pickupPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pickupPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pickupPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#006FD8',
  },
  pickupPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  pickupPillTextActive: {
    color: '#006FD8',
    fontWeight: '800',
  },
  summaryNoticeBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 14,
  },
  summaryPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryPriceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  summaryPriceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0284C7',
  },
  summaryBankNoticeRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  summaryBankNoticeText: {
    fontSize: 10,
    color: '#0284C7',
    flex: 1,
    lineHeight: 14,
  },
  btnConfirmReserveMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  btnConfirmReserveMainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // Verify Modal Content
  verificationCardContent: {
    marginBottom: 12,
  },
  verifyCustomerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  verifyCustomerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifyCustomerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  verifySeatsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#006FD8',
    marginTop: 4,
  },
  verifyAmountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 12,
  },
  verifyAmountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  verifyAmountNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#047857',
  },
  qrDispatchNotice: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  qrDispatchNoticeText: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 15,
  },
  btnConfirmPaymentMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  btnConfirmPaymentMainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // QR Modal Content
  ticketCardContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  ticketVerifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  ticketVerifiedBannerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  qrCodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 12,
  },
  qrCodeImage: {
    width: 150,
    height: 150,
  },
  qrPassTokenText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  ticketInfoList: {
    gap: 5,
  },
  ticketInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketInfoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  ticketInfoValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  ticketInfoValueBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  ticketInfoValueSeats: {
    fontSize: 12,
    fontWeight: '900',
    color: '#006FD8',
  },
  ticketInfoValueSlip: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  btnResendQrMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnResendQrMainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
