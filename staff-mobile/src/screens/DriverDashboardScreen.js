import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { MOCK_PASSENGERS } from '../data/mockDatabase';

// Initial Route Stops Configuration
const INITIAL_STOPS = [
  {
    id: 'thalawa',
    name: 'Thalawa Bus Stand',
    type: 'PICKUP',
    lat: 8.2045,
    lng: 80.3230,
    time: '08:45 PM',
    status: 'ACTIVE', // 'ACTIVE' | 'PASSED'
    color: '#006FD8',
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura New Town Bus Stand',
    type: 'PICKUP',
    lat: 8.3242,
    lng: 80.4072,
    time: '09:20 PM',
    status: 'UPCOMING', // 'UPCOMING' | 'ACTIVE' | 'PASSED'
    color: '#F59E0B',
  },
  {
    id: 'medawachchiya',
    name: 'Medawachchiya Junction',
    type: 'HALT',
    lat: 8.5414,
    lng: 80.4952,
    time: '10:15 PM',
    status: 'UPCOMING',
    color: '#3B82F6',
  },
  {
    id: 'vavuniya',
    name: 'Vavuniya Highway Rest Stop',
    type: 'REST',
    lat: 8.7514,
    lng: 80.4971,
    time: '11:30 PM',
    status: 'UPCOMING',
    color: '#8B5CF6',
  },
  {
    id: 'jaffna',
    name: 'Jaffna Central Terminal',
    type: 'DESTINATION',
    lat: 9.6615,
    lng: 80.0255,
    time: '02:30 AM',
    status: 'UPCOMING',
    color: '#10B981',
  },
  {
    id: 'thambuththegama',
    name: 'Thambuththegama Town',
    type: 'DEPARTED_ORIGIN',
    lat: 8.1465,
    lng: 80.2917,
    time: '08:15 PM',
    status: 'PASSED',
    color: '#64748B',
  },
];

// Distance calculation functions
const calculateDistanceMeters = (fromLat, fromLng, toLat, toLng) => {
  if (!fromLat || !fromLng || !toLat || !toLng) return 999999;
  const R = 6371e3; // Earth radius in meters
  const dLat = ((toLat - fromLat) * Math.PI) / 180;
  const dLng = ((toLng - fromLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((fromLat * Math.PI) / 180) *
      Math.cos((toLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const calculateDistanceKm = (fromLat, fromLng, toLat, toLng) => {
  if (!fromLat || !fromLng || !toLat || !toLng) return null;
  const meters = calculateDistanceMeters(fromLat, fromLng, toLat, toLng);
  // Sri Lanka winding road factor (~1.22x straight-line distance)
  return Math.round((meters / 1000) * 1.22 * 10) / 10;
};

export default function DriverDashboardScreen({ user }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBusDetailsModal, setShowBusDetailsModal] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [stops, setStops] = useState(INITIAL_STOPS);
  const [passengersList, setPassengersList] = useState(MOCK_PASSENGERS);

  // Live GPS tracking states
  const [driverCoords, setDriverCoords] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('STANDBY'); // 'STANDBY' | 'ACQUIRING' | 'ACTIVE' | 'PERMISSION_DENIED' | 'ERROR'
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const locationWatcherRef = useRef(null);

  const tripTime = '08:45 PM';
  const routeName = 'Route 87: Thambuththegama ➔ Jaffna (Via Thalawa & Anuradhapura)';
  const busPlate = 'NB-4592';

  // Live real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cleanup location watcher on unmount
  useEffect(() => {
    return () => {
      if (locationWatcherRef.current) {
        locationWatcherRef.current.remove();
        locationWatcherRef.current = null;
      }
    };
  }, []);

  const formatHoursMinutes = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatSeconds = (date) => {
    return date.toLocaleTimeString('en-US', {
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Determine currently active stop (the first non-passed stop)
  const activeStop = stops.find((s) => s.status !== 'PASSED') || stops[stops.length - 1];

  // Calculate live distance to active stop in meters and km
  const distToActiveStopMeters =
    driverCoords && driverCoords.latitude && activeStop
      ? calculateDistanceMeters(
          driverCoords.latitude,
          driverCoords.longitude,
          activeStop.lat,
          activeStop.lng
        )
      : 999999;

  const isWithin50m = distToActiveStopMeters <= 50;

  const distanceToNextPickupKm =
    driverCoords && driverCoords.latitude && activeStop
      ? calculateDistanceKm(
          driverCoords.latitude,
          driverCoords.longitude,
          activeStop.lat,
          activeStop.lng
        )
      : activeStop.id === 'thalawa'
      ? 12.8
      : 24.5;

  const distanceToEndTripKm =
    driverCoords && driverCoords.latitude
      ? calculateDistanceKm(
          driverCoords.latitude,
          driverCoords.longitude,
          9.6615,
          80.0255
        )
      : 188.5;

  // Active stop passengers
  const activeStopPassengers = passengersList.filter((p) => p.stopId === activeStop.id);
  const allActivePassengersBoarded =
    activeStopPassengers.length > 0 &&
    activeStopPassengers.every((p) => p.status === 'BOARDED');
  const pendingCountAtActiveStop = activeStopPassengers.filter(
    (p) => p.status === 'PENDING'
  ).length;

  // Toggle passenger boarding (Only allowed if stop is NOT passed)
  const handleToggleBoarding = (ticketRef, stopStatus) => {
    if (stopStatus === 'PASSED') {
      Alert.alert(
        'Stop Already Departed',
        'This pickup stop has already passed. Passenger boarding is locked and cannot be changed.'
      );
      return;
    }

    setPassengersList((prev) =>
      prev.map((p) => {
        if (p.ticketRef === ticketRef) {
          const newStatus = p.status === 'BOARDED' ? 'PENDING' : 'BOARDED';
          return {
            ...p,
            status: newStatus,
            boardedAt: newStatus === 'BOARDED' ? formatHoursMinutes(new Date()) : null,
          };
        }
        return p;
      })
    );
  };

  // Depart / Pass stop:
  // 1. Any PENDING passenger at this stop becomes "MISSED" (Missed Trip)
  // 2. Stop status becomes "PASSED"
  // 3. Stop moves to bottom of list
  // 4. Next stop automatically becomes active
  const handleDepartStop = (stopId) => {
    const departingStop = stops.find((s) => s.id === stopId);
    const stopName = departingStop ? departingStop.name : 'Stop';

    // 1. Update passengers: any un-boarded passenger at this stop misses the trip
    setPassengersList((prev) =>
      prev.map((p) => {
        if (p.stopId === stopId) {
          if (p.status === 'PENDING') {
            return { ...p, status: 'MISSED' };
          }
        }
        return p;
      })
    );

    // 2. Mark this stop as PASSED and activate the next upcoming stop
    setStops((prevStops) => {
      const updated = prevStops.map((s) => {
        if (s.id === stopId) {
          return { ...s, status: 'PASSED' };
        }
        return s;
      });

      // Find the next non-passed stop and make it ACTIVE
      const nextNonPassed = updated.find((s) => s.status !== 'PASSED');
      if (nextNonPassed) {
        return updated.map((s) =>
          s.id === nextNonPassed.id ? { ...s, status: 'ACTIVE' } : s
        );
      }
      return updated;
    });

    Alert.alert(
      'Departed Stop',
      `${stopName} has been passed. Un-checked passengers marked as "Missed Trip". Next pickup stop is now active.`
    );
  };

  // Turn on mobile GPS chip and start tracking
  const startLiveGpsTracking = async () => {
    setIsGpsLoading(true);
    setGpsStatus('ACQUIRING');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsStatus('PERMISSION_DENIED');
        setIsGpsLoading(false);
        Alert.alert(
          'Location Permission Required',
          'PNG Express needs your device GPS permission to track bus navigation in real-time.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Fetch immediate current location from mobile GPS
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setDriverCoords(initialLocation.coords);
      setGpsStatus('ACTIVE');
      setIsGpsLoading(false);

      // Subscribe to real-time location stream as the bus drives
      if (locationWatcherRef.current) {
        locationWatcherRef.current.remove();
      }

      locationWatcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 4000,
          distanceInterval: 10,
        },
        (loc) => {
          setDriverCoords(loc.coords);
          setGpsStatus('ACTIVE');
        }
      );

      return true;
    } catch (error) {
      console.warn('GPS location error:', error);
      setGpsStatus('ERROR');
      setIsGpsLoading(false);
      return false;
    }
  };

  // Launch official Google Maps app with MULTIPLE STOPS:
  // Destination: Jaffna Central Terminal (9.6615, 80.0255)
  // Stop 1: Thalawa Bus Stand (8.2045, 80.3230)
  // Stop 2: Anuradhapura New Town Bus Stand (8.3242, 80.4072)
  const launchGoogleMapsNavigation = async () => {
    const destLat = 9.6615;
    const destLng = 80.0255; // Jaffna
    const waypoints = '8.2045,80.3230|8.3242,80.4072'; // Stop 1: Thalawa | Stop 2: Anuradhapura

    const universalUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&waypoints=${encodeURIComponent(
      waypoints
    )}&travelmode=driving&dir_action=navigate`;

    const nativeScheme = Platform.select({
      ios: `comgooglemaps://?daddr=${destLat},${destLng}&waypoints=8.2045,80.3230+to:8.3242,80.4072&directionsmode=driving`,
      android: `google.navigation:q=${destLat},${destLng}&mode=d`,
      default: universalUrl,
    });

    if (Platform.OS !== 'web') {
      try {
        const canOpen = await Linking.canOpenURL(nativeScheme);
        if (canOpen) {
          await Linking.openURL(nativeScheme);
          return;
        }
      } catch (e) {
        // Fallback
      }
    }

    Linking.openURL(universalUrl).catch(() => {
      Alert.alert(
        'Google Maps Navigation',
        'Could not open Google Maps. Please ensure Google Maps is installed on your mobile phone.'
      );
    });
  };

  // Start Trip: Activate mobile GPS & trigger Google Maps multi-stop navigation
  const handleStartTripWithGps = async () => {
    setIsTripStarted(true);
    await startLiveGpsTracking();
    launchGoogleMapsNavigation();
  };

  // End Trip confirmation
  const handleEndTrip = () => {
    Alert.alert(
      'Complete Trip',
      'Are you sure you want to conclude Route 87 to Jaffna Central Terminal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Conclude Trip',
          style: 'destructive',
          onPress: () => {
            if (locationWatcherRef.current) {
              locationWatcherRef.current.remove();
              locationWatcherRef.current = null;
            }
            setGpsStatus('STANDBY');
            setIsTripStarted(false);
          },
        },
      ]
    );
  };

  // Call passenger
  const handleCallPassenger = (phone, name) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Passenger', `Contact ${name} at ${phone}`);
    });
  };

  // Sorted stops: active / upcoming stops first, passed stops sorted to the bottom
  const sortedStops = [...stops].sort((a, b) => {
    if (a.status === 'PASSED' && b.status !== 'PASSED') return 1;
    if (a.status !== 'PASSED' && b.status === 'PASSED') return -1;
    return 0;
  });

  // -------------------------------------------------------------
  // VIEW 2: In-Transit Live GPS & Dynamic Waypoint Manifest View
  // -------------------------------------------------------------
  if (isTripStarted) {
    return (
      <View style={styles.navContainer}>
        {/* Top Active Bar */}
        <View style={styles.navHeaderBar}>
          <TouchableOpacity
            style={styles.navBackBtn}
            onPress={() => setIsTripStarted(false)}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#0F172A" />
            <Text style={styles.navBackBtnText}>Overview</Text>
          </TouchableOpacity>

          <View style={styles.navStatusPill}>
            <View style={styles.navPulseDot} />
            <Text style={styles.navStatusPillText}>IN-TRANSIT • ROUTE 87</Text>
          </View>

          <TouchableOpacity
            style={styles.openExternalMapsBtn}
            onPress={launchGoogleMapsNavigation}
            activeOpacity={0.8}
          >
            <Feather name="navigation" size={14} color="#006FD8" />
            <Text style={styles.openExternalMapsText}>Maps App</Text>
          </TouchableOpacity>
        </View>

        {/* Live GPS Telematics Card */}
        <View style={styles.telematicsCard}>
          {/* Status & Live GPS Coordinates Header */}
          <View style={styles.telematicsHeader}>
            <View style={styles.telematicsStatusRow}>
              <View
                style={[
                  styles.gpsStatusDot,
                  gpsStatus === 'ACTIVE'
                    ? styles.gpsDotGreen
                    : gpsStatus === 'ACQUIRING'
                    ? styles.gpsDotYellow
                    : styles.gpsDotRed,
                ]}
              />
              <Text style={styles.gpsStatusTitle}>
                {gpsStatus === 'ACTIVE'
                  ? 'LIVE MOBILE GPS ACTIVE'
                  : gpsStatus === 'ACQUIRING'
                  ? 'ACQUIRING SATELLITE FIX...'
                  : gpsStatus === 'PERMISSION_DENIED'
                  ? 'GPS PERMISSION REQUIRED'
                  : 'GPS READY'}
              </Text>
            </View>

            <View style={styles.gpsBadge}>
              <Ionicons name="navigate-circle" size={13} color="#006FD8" />
              <Text style={styles.gpsBadgeText}>
                {driverCoords
                  ? `${driverCoords.latitude.toFixed(4)}°, ${driverCoords.longitude.toFixed(4)}°`
                  : 'High Precision'}
              </Text>
            </View>
          </View>

          {/* TWO PRIMARY DYNAMIC REMAINING DISTANCE METRICS */}
          <View style={styles.remainingDistRow}>
            {/* 1. Remaining Distance to Next Pickup */}
            <View style={styles.remainingDistCardPrimary}>
              <View style={styles.metricIconRow}>
                <Ionicons name="location" size={15} color="#006FD8" />
                <Text style={styles.distCardLabelPrimary}>REMAINING TO NEXT PICKUP</Text>
              </View>
              <View style={styles.distValueRow}>
                <Text style={styles.distNumberBigPrimary}>
                  {(distanceToNextPickupKm || 12.8).toFixed(1)}
                </Text>
                <Text style={styles.distKmUnitPrimary}>km</Text>
              </View>
              <Text style={styles.distPlaceSubPrimary} numberOfLines={1}>
                {activeStop.name}
              </Text>
              <View
                style={[
                  styles.passengerCountPill,
                  isWithin50m && styles.passengerCountPillArrived,
                ]}
              >
                <Text
                  style={[
                    styles.passengerCountPillText,
                    isWithin50m && styles.passengerCountPillArrivedText,
                  ]}
                >
                  {isWithin50m
                    ? '📍 Within 50m of stop!'
                    : `${pendingCountAtActiveStop} Waiting to Board`}
                </Text>
              </View>
            </View>

            {/* 2. Remaining Distance to End Trip */}
            <View style={styles.remainingDistCardSecondary}>
              <View style={styles.metricIconRow}>
                <Ionicons name="flag" size={14} color="#475569" />
                <Text style={styles.distCardLabelSecondary}>REMAINING TO END TRIP</Text>
              </View>
              <View style={styles.distValueRow}>
                <Text style={styles.distNumberBigSecondary}>
                  {(distanceToEndTripKm || 188.5).toFixed(1)}
                </Text>
                <Text style={styles.distKmUnitSecondary}>km</Text>
              </View>
              <Text style={styles.distPlaceSubSecondary} numberOfLines={1}>
                Jaffna Central Terminal
              </Text>
              <View style={styles.routeTagPill}>
                <Text style={styles.routeTagPillText}>Final Destination</Text>
              </View>
            </View>
          </View>

          {/* Active Pickup Place Action Banner */}
          <View
            style={[
              styles.nextStopNotice,
              isWithin50m && styles.nextStopNoticeArrived,
              allActivePassengersBoarded && styles.nextStopNoticeAllDone,
            ]}
          >
            <View style={styles.nextStopIconCircle}>
              <Ionicons
                name={allActivePassengersBoarded ? 'checkmark-circle' : 'location-sharp'}
                size={16}
                color={allActivePassengersBoarded ? '#10B981' : '#006FD8'}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.nextStopNoticeTitle}>
                {isWithin50m ? '📍 Arrived at: ' : 'Active Pickup: '}
                {activeStop.name}
              </Text>
              <Text style={styles.nextStopNoticeSub}>
                {allActivePassengersBoarded
                  ? 'All passengers boarded! Ready to depart.'
                  : `${pendingCountAtActiveStop} passenger(s) pending check-in`}
              </Text>
            </View>

            {/* Depart / Pass Stop Button */}
            {activeStop.status !== 'PASSED' && activeStop.type === 'PICKUP' && (
              <TouchableOpacity
                style={[
                  styles.departStopBtn,
                  allActivePassengersBoarded && styles.departStopBtnReady,
                ]}
                onPress={() => handleDepartStop(activeStop.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.departStopBtnText,
                    allActivePassengersBoarded && styles.departStopBtnReadyText,
                  ]}
                >
                  {allActivePassengersBoarded ? 'Depart Stop ➔' : 'Pass Stop ➔'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Main Action: Multi-stop Google Maps Navigation */}
          <TouchableOpacity
            style={styles.btnOpenGoogleMaps}
            onPress={launchGoogleMapsNavigation}
            activeOpacity={0.85}
          >
            <Ionicons name="navigate" size={18} color="#FFFFFF" />
            <Text style={styles.btnOpenGoogleMapsText}>
              Open Live Google Maps Navigation (Via Stops ➔ Jaffna)
            </Text>
          </TouchableOpacity>

          {/* Trip Controls (Rest Stop / End Trip) */}
          <View style={styles.tripControlsRow}>
            <TouchableOpacity
              style={styles.tripControlBtn}
              onPress={() =>
                Alert.alert(
                  'Rest Stop Logged',
                  'Refreshment rest stop logged. Passengers and operations notified.'
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons name="cafe-outline" size={16} color="#475569" />
              <Text style={styles.tripControlBtnText}>Rest Stop</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tripControlBtn, styles.tripControlBtnEnd]}
              onPress={handleEndTrip}
              activeOpacity={0.7}
            >
              <Ionicons name="flag-outline" size={16} color="#EF4444" />
              <Text style={[styles.tripControlBtnText, styles.tripControlBtnEndText]}>
                End Trip
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Waypoint & Booked Passenger Manifest */}
        <ScrollView style={styles.passengerScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.stopsHeaderRow}>
            <Text style={styles.stopsSectionTitle}>Pickup Stoppages & Manifest</Text>
            <Text style={styles.stopsCountBadge}>Auto-sorted by arrival</Text>
          </View>

          {/* Render Stops in Sorted Order (Active/Upcoming on Top, Passed at the Bottom) */}
          {sortedStops.map((stop) => {
            const stopPassengers = passengersList.filter((p) => p.stopId === stop.id);
            const isPassed = stop.status === 'PASSED';
            const isActive = stop.id === activeStop.id && !isPassed;

            return (
              <View
                key={stop.id}
                style={[
                  styles.pickupStopCard,
                  isPassed && styles.pickupStopCardPassed,
                  isActive && styles.pickupStopCardActive,
                ]}
              >
                {/* Stop Header */}
                <View style={styles.stopHeader}>
                  <View
                    style={[
                      styles.stopIconDot,
                      {
                        backgroundColor: isPassed
                          ? '#94A3B8'
                          : isActive
                          ? '#006FD8'
                          : stop.color,
                      },
                    ]}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.stopLocationName,
                        isPassed && styles.stopLocationNamePassed,
                      ]}
                    >
                      {stop.name}
                    </Text>
                    <Text style={styles.stopTimeText}>
                      {isPassed
                        ? 'Departed & Passed'
                        : `Scheduled: ${stop.time} • ${stopPassengers.length} Booked Passengers`}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  <View
                    style={[
                      styles.stopStatusBadge,
                      isPassed
                        ? styles.stopStatusBadgePassed
                        : isActive
                        ? styles.stopStatusBadgeActive
                        : styles.stopStatusBadgeUpcoming,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stopStatusBadgeText,
                        isPassed
                          ? styles.stopStatusBadgePassedText
                          : isActive
                          ? styles.stopStatusBadgeActiveText
                          : styles.stopStatusBadgeUpcomingText,
                      ]}
                    >
                      {isPassed ? 'PASSED' : isActive ? 'NEXT STOP' : 'UPCOMING'}
                    </Text>
                  </View>
                </View>

                {/* Passenger list for this stop */}
                {stopPassengers.length > 0 ? (
                  stopPassengers.map((p) => {
                    const isBoarded = p.status === 'BOARDED';
                    const isMissed = p.status === 'MISSED';

                    return (
                      <View
                        key={p.ticketRef}
                        style={[
                          styles.passengerRow,
                          isMissed && styles.passengerRowMissed,
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            {isMissed && (
                              <View style={styles.missedTripTag}>
                                <Text style={styles.missedTripTagText}>⚠️ Missed Trip</Text>
                              </View>
                            )}
                            <Text
                              style={[
                                styles.passengerNameText,
                                isMissed && styles.passengerNameTextMissed,
                              ]}
                            >
                              {p.name}
                            </Text>
                          </View>

                          <Text style={styles.passengerSeatText}>
                            Seats: {p.seats.join(', ')} • {p.destination}
                            {isBoarded && p.boardedAt ? ` • In at ${p.boardedAt}` : ''}
                          </Text>
                        </View>

                        {/* Call Passenger */}
                        <TouchableOpacity
                          style={styles.callSmallBtn}
                          onPress={() => handleCallPassenger(p.phone, p.name)}
                          activeOpacity={0.7}
                        >
                          <Feather name="phone" size={13} color="#006FD8" />
                        </TouchableOpacity>

                        {/* Check-In / Boarded / Missed Button */}
                        {isPassed ? (
                          // Unclickable / disabled state once stop is passed
                          <View
                            style={[
                              styles.boardCheckBtn,
                              styles.boardCheckBtnDisabled,
                              isBoarded && styles.boardCheckBtnDone,
                              isMissed && styles.boardCheckBtnMissed,
                            ]}
                          >
                            <Text
                              style={[
                                styles.boardCheckText,
                                isBoarded && styles.boardCheckTextDone,
                                isMissed && styles.boardCheckTextMissed,
                              ]}
                            >
                              {isBoarded ? '✓ Boarded' : 'Missed'}
                            </Text>
                          </View>
                        ) : (
                          // Clickable toggle button when stop is active/upcoming
                          <TouchableOpacity
                            style={[
                              styles.boardCheckBtn,
                              isBoarded && styles.boardCheckBtnDone,
                            ]}
                            onPress={() => handleToggleBoarding(p.ticketRef, stop.status)}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.boardCheckText,
                                isBoarded && styles.boardCheckTextDone,
                              ]}
                            >
                              {isBoarded ? '✓ Boarded' : 'Check In'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noPassengersText}>
                    {stop.type === 'REST'
                      ? '20 Mins Refreshment & Tea Halt'
                      : stop.type === 'DESTINATION'
                      ? 'Final Terminal Disembarkation'
                      : 'Scheduled Transit Halt'}
                  </Text>
                )}
              </View>
            );
          })}

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: Main Clean Pre-Trip Dashboard
  // -------------------------------------------------------------
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Live Digital Clock Section */}
      <View style={styles.clockSection}>
        <Text style={styles.dateLabel}>{formatDate(currentTime)}</Text>
        <View style={styles.timeRow}>
          <Text style={styles.timeMainText}>{formatHoursMinutes(currentTime)}</Text>
          <Text style={styles.timeSecondsText}>{formatSeconds(currentTime)}</Text>
        </View>
      </View>

      {/* 2. Professional Trip Notice Box */}
      <View style={styles.tripNoticeBox}>
        {/* Core Headline: You have trip at xx.xx */}
        <Text style={styles.tripHeadline}>
          You have trip at {tripTime}
        </Text>

        {/* Route Details */}
        <View style={styles.routeDetailBox}>
          <View style={styles.routeDetailItem}>
            <Feather name="map-pin" size={16} color="#006FD8" />
            <Text style={styles.routeDetailText}>{routeName}</Text>
          </View>

          {/* Assigned Bus (Clickable with Bus Icon) */}
          <TouchableOpacity
            style={styles.assignedBusBtn}
            onPress={() => setShowBusDetailsModal(true)}
            activeOpacity={0.75}
          >
            <View style={styles.busIconWrapper}>
              <Ionicons name="bus" size={17} color="#006FD8" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.assignedBusLabel}>Assigned bus</Text>
              <Text style={styles.assignedBusPlateText}>
                {busPlate} • Scania Touring HD
              </Text>
            </View>

            <View style={styles.tapViewBadge}>
              <Text style={styles.tapViewBadgeText}>Details</Text>
              <Feather name="chevron-right" size={14} color="#006FD8" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.btnStartTrip}
          onPress={handleStartTripWithGps}
          activeOpacity={0.85}
        >
          {isGpsLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Feather name="play" size={18} color="#FFFFFF" />
          )}
          <Text style={styles.btnStartTripText}>
            {isGpsLoading ? 'Activating GPS...' : 'Start Trip'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Assigned Bus Details Modal */}
      <Modal
        visible={showBusDetailsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBusDetailsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBusDetailsModal(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalBusIconCircle}>
                  <Ionicons name="bus" size={18} color="#006FD8" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Assigned Bus: {busPlate}</Text>
                  <Text style={styles.modalHeaderSub}>Scania Super Luxury Express</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowBusDetailsModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Info Cards */}
            <View style={styles.modalInfoList}>
              {/* Assigned Conductor */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconCol}>
                  <Feather name="user-check" size={18} color="#006FD8" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>ASSIGNED CONDUCTOR</Text>
                  <Text style={styles.infoValueMain}>Nimal Silva</Text>
                  <Text style={styles.infoSubText}>ID: PNG-EMP-103 • Tel: +94 76 345 8821</Text>
                </View>
              </View>

              {/* Seats Filled */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconCol}>
                  <Feather name="users" size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>SEAT OCCUPANCY</Text>
                  <Text style={styles.infoValueMain}>
                    38 / 40 Seats Filled <Text style={{ color: '#10B981', fontSize: 13 }}>(95% Full)</Text>
                  </Text>
                  <Text style={styles.infoSubText}>2 seats remaining for onboard cash booking</Text>
                </View>
              </View>

              {/* Latest Test Date */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconCol}>
                  <Feather name="check-circle" size={18} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>LATEST TEST DATE & INSPECTION</Text>
                  <Text style={styles.infoValueMain}>28 Oct 2026</Text>
                  <Text style={styles.infoSubText}>
                    Passed NTC Roadworthiness, Dual-Air Brakes & Safety Audit
                  </Text>
                </View>
              </View>

              {/* Fleet Depot */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconCol}>
                  <Feather name="shield" size={18} color="#6366F1" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>FLEET REGISTRATION</Text>
                  <Text style={styles.infoValueMain}>Thambuththegama Central Depot</Text>
                  <Text style={styles.infoSubText}>Expressway Highway Permit #NTC-WP-8812</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowBusDetailsModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeModalBtnText}>Done</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    flexGrow: 1,
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 500,
          width: '100%',
          alignSelf: 'center',
        }
      : {}),
  },

  // 1. Clock Section
  clockSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  timeMainText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1.5,
  },
  timeSecondsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006FD8',
    marginLeft: 6,
  },

  // 2. Trip Notice Box
  tripNoticeBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    shadowColor: '#006FD8',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
  },
  tripHeadline: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 16,
    textAlign: 'center',
  },
  routeDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  routeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDetailText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },

  // Assigned Bus Clickable Item
  assignedBusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  busIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignedBusLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  assignedBusPlateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  tapViewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tapViewBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },

  // Start Trip Button
  btnStartTrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#006FD8',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  btnStartTripText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Modal: Assigned Bus Details
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 390,
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalHeaderSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  modalInfoList: {
    paddingVertical: 14,
    gap: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  infoIconCol: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  infoValueMain: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  infoSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeModalBtn: {
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  closeModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // -------------------------------------------------------------
  // Live Map & Direction View Styles
  // -------------------------------------------------------------
  navContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 500,
          alignSelf: 'center',
        }
      : {}),
  },
  navHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navBackBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  navStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  navPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  navStatusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.4,
  },
  openExternalMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  openExternalMapsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },

  // Live GPS Telematics Card
  telematicsCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    shadowColor: '#006FD8',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  telematicsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  telematicsStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gpsStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gpsDotGreen: {
    backgroundColor: '#10B981',
  },
  gpsDotYellow: {
    backgroundColor: '#F59E0B',
  },
  gpsDotRed: {
    backgroundColor: '#EF4444',
  },
  gpsStatusTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  gpsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#006FD8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Remaining Distance Row & Cards
  remainingDistRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  remainingDistCardPrimary: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  distCardLabelPrimary: {
    fontSize: 9,
    fontWeight: '900',
    color: '#006FD8',
    letterSpacing: 0.5,
  },
  distValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 2,
  },
  distNumberBigPrimary: {
    fontSize: 26,
    fontWeight: '900',
    color: '#006FD8',
    letterSpacing: -0.5,
  },
  distKmUnitPrimary: {
    fontSize: 13,
    fontWeight: '800',
    color: '#006FD8',
    marginLeft: 3,
  },
  distPlaceSubPrimary: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  passengerCountPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  passengerCountPillArrived: {
    backgroundColor: '#DCFCE7',
  },
  passengerCountPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  passengerCountPillArrivedText: {
    color: '#15803D',
  },

  remainingDistCardSecondary: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  distCardLabelSecondary: {
    fontSize: 9,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  distNumberBigSecondary: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  distKmUnitSecondary: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    marginLeft: 3,
  },
  distPlaceSubSecondary: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
  },
  routeTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  routeTagPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },

  // Active Next Stop Notice Banner
  nextStopNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginVertical: 6,
  },
  nextStopNoticeArrived: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  nextStopNoticeAllDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#6EE7B7',
  },
  nextStopIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStopNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  nextStopNoticeSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  departStopBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  departStopBtnReady: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  departStopBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  departStopBtnReadyText: {
    color: '#FFFFFF',
  },

  // Main Action: Multi-Stop Google Maps Navigation
  btnOpenGoogleMaps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: '#006FD8',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  btnOpenGoogleMapsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Trip Secondary Controls
  tripControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  tripControlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tripControlBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  tripControlBtnEnd: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  tripControlBtnEndText: {
    color: '#EF4444',
  },

  // Waypoints & Booked Passenger Manifest
  passengerScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stopsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stopsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  stopsCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  pickupStopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  pickupStopCardActive: {
    borderColor: '#93C5FD',
    backgroundColor: '#FFFFFF',
    shadowColor: '#006FD8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  pickupStopCardPassed: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stopIconDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stopLocationName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  stopLocationNamePassed: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  stopTimeText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  stopStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  stopStatusBadgeActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stopStatusBadgeActiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#006FD8',
  },
  stopStatusBadgeUpcoming: {
    backgroundColor: '#F1F5F9',
  },
  stopStatusBadgeUpcomingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  stopStatusBadgePassed: {
    backgroundColor: '#F1F5F9',
  },
  stopStatusBadgePassedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  passengerRowMissed: {
    opacity: 0.85,
  },
  passengerNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  passengerNameTextMissed: {
    color: '#991B1B',
  },
  missedTripTag: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  missedTripTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B91C1C',
  },
  passengerSeatText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  callSmallBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  boardCheckBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  boardCheckBtnDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  boardCheckBtnMissed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  boardCheckBtnDisabled: {
    opacity: 0.7,
  },
  boardCheckText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  boardCheckTextDone: {
    color: '#059669',
  },
  boardCheckTextMissed: {
    color: '#DC2626',
  },
  noPassengersText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#94A3B8',
    paddingVertical: 4,
  },
});
