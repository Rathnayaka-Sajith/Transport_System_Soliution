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

// Waypoint GPS Coordinates
const THALAWA_WAYPOINT = {
  name: 'Thalawa Bus Stand',
  lat: 8.2045,
  lng: 80.3230,
  time: '08:45 PM',
};

const ANURADHAPURA_WAYPOINT = {
  name: 'Anuradhapura New Town Bus Stand',
  lat: 8.3242,
  lng: 80.4072,
  time: '09:20 PM',
};

const JAFFNA_DESTINATION = {
  name: 'Jaffna Central Terminal',
  lat: 9.6615,
  lng: 80.0255,
  time: '02:30 AM',
};

// Haversine formula for live road distance calculation
const calculateDistanceKm = (fromLat, fromLng, toLat, toLng) => {
  if (!fromLat || !fromLng || !toLat || !toLng) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((toLat - fromLat) * Math.PI) / 180;
  const dLng = ((toLng - fromLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((fromLat * Math.PI) / 180) *
      Math.cos((toLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  // Sri Lanka winding road factor (~1.22x straight-line distance)
  return Math.round(straightKm * 1.22 * 10) / 10;
};

export default function DriverDashboardScreen({ user }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBusDetailsModal, setShowBusDetailsModal] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);
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

  // Toggle passenger boarding status
  const handleToggleBoarding = (ticketRef) => {
    setPassengersList((prev) =>
      prev.map((p) =>
        p.ticketRef === ticketRef
          ? { ...p, status: p.status === 'BOARDED' ? 'PENDING' : 'BOARDED' }
          : p
      )
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

  // Open specific waypoint/stop on Google Maps
  const handleOpenLocationOnMap = (lat, lng, label) => {
    const universalUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving&dir_action=navigate`;
    const nativeScheme = Platform.select({
      ios: `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`,
      android: `google.navigation:q=${lat},${lng}&mode=d`,
      default: universalUrl,
    });

    if (Platform.OS !== 'web') {
      Linking.canOpenURL(nativeScheme)
        .then((supported) => {
          if (supported) {
            Linking.openURL(nativeScheme);
          } else {
            Linking.openURL(universalUrl);
          }
        })
        .catch(() => {
          Linking.openURL(universalUrl);
        });
    } else {
      Linking.openURL(universalUrl);
    }
  };

  // Launch official Google Maps app for multi-stop route (Thambuththegama -> Thalawa -> Anuradhapura -> Jaffna)
  const launchGoogleMapsNavigation = async () => {
    const destLat = JAFFNA_DESTINATION.lat;
    const destLng = JAFFNA_DESTINATION.lng;
    const waypoints = `${THALAWA_WAYPOINT.lat},${THALAWA_WAYPOINT.lng}|${ANURADHAPURA_WAYPOINT.lat},${ANURADHAPURA_WAYPOINT.lng}`;

    const universalUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&waypoints=${encodeURIComponent(
      waypoints
    )}&travelmode=driving&dir_action=navigate`;

    const nativeScheme = Platform.select({
      ios: `comgooglemaps://?daddr=${destLat},${destLng}&directionsmode=driving`,
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

  // Start Trip: Activate mobile GPS & trigger Google Maps navigation
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

  // Calculate live dynamic remaining distances from device GPS
  const distanceToNextPickup =
    driverCoords && driverCoords.latitude
      ? calculateDistanceKm(
          driverCoords.latitude,
          driverCoords.longitude,
          THALAWA_WAYPOINT.lat,
          THALAWA_WAYPOINT.lng
        )
      : 12.8;

  const distanceToEndTrip =
    driverCoords && driverCoords.latitude
      ? calculateDistanceKm(
          driverCoords.latitude,
          driverCoords.longitude,
          JAFFNA_DESTINATION.lat,
          JAFFNA_DESTINATION.lng
        )
      : 188.5;

  // -------------------------------------------------------------
  // VIEW 2: In-Transit Live GPS & Booked Passenger Manifest View
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

          {/* TWO PRIMARY DYNAMIC REMAINING DISTANCE CARDS */}
          <View style={styles.remainingDistRow}>
            {/* 1. Remaining Distance to Next Pickup */}
            <View style={styles.remainingDistCardPrimary}>
              <View style={styles.metricIconRow}>
                <Ionicons name="location" size={15} color="#006FD8" />
                <Text style={styles.distCardLabelPrimary}>REMAINING TO NEXT PICKUP</Text>
              </View>
              <View style={styles.distValueRow}>
                <Text style={styles.distNumberBigPrimary}>
                  {(distanceToNextPickup || 12.8).toFixed(1)}
                </Text>
                <Text style={styles.distKmUnitPrimary}>km</Text>
              </View>
              <Text style={styles.distPlaceSubPrimary} numberOfLines={1}>
                Thalawa Bus Stand
              </Text>
              <View style={styles.passengerCountPill}>
                <Text style={styles.passengerCountPillText}>2 Passengers Waiting</Text>
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
                  {(distanceToEndTrip || 188.5).toFixed(1)}
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

          {/* Next Upcoming Passenger Pickup Highlight Card */}
          <View style={styles.nextStopNotice}>
            <View style={styles.nextStopIconCircle}>
              <Ionicons name="location-sharp" size={16} color="#006FD8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextStopNoticeTitle}>Next Pickup: Thalawa Bus Stand</Text>
              <Text style={styles.nextStopNoticeSub}>
                2 Passengers Waiting (Saman Kumara, Dilani Jayasinghe)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.showOnMapBtnSmall}
              onPress={() =>
                handleOpenLocationOnMap(
                  THALAWA_WAYPOINT.lat,
                  THALAWA_WAYPOINT.lng,
                  THALAWA_WAYPOINT.name
                )
              }
              activeOpacity={0.8}
            >
              <Ionicons name="map" size={13} color="#006FD8" />
              <Text style={styles.showOnMapBtnSmallText}>Map</Text>
            </TouchableOpacity>
          </View>

          {/* Main Action: Launch Live Google Maps Navigation */}
          <TouchableOpacity
            style={styles.btnOpenGoogleMaps}
            onPress={launchGoogleMapsNavigation}
            activeOpacity={0.85}
          >
            <Ionicons name="navigate" size={18} color="#FFFFFF" />
            <Text style={styles.btnOpenGoogleMapsText}>
              Open Live Google Maps Navigation
            </Text>
          </TouchableOpacity>

          {/* Quick Pickup Maps Row */}
          <View style={styles.quickMapsRow}>
            <TouchableOpacity
              style={styles.quickMapPill}
              onPress={() =>
                handleOpenLocationOnMap(
                  THALAWA_WAYPOINT.lat,
                  THALAWA_WAYPOINT.lng,
                  THALAWA_WAYPOINT.name
                )
              }
              activeOpacity={0.75}
            >
              <Ionicons name="navigate-outline" size={13} color="#006FD8" />
              <Text style={styles.quickMapPillText}>Show Thalawa on Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickMapPill}
              onPress={() =>
                handleOpenLocationOnMap(
                  ANURADHAPURA_WAYPOINT.lat,
                  ANURADHAPURA_WAYPOINT.lng,
                  ANURADHAPURA_WAYPOINT.name
                )
              }
              activeOpacity={0.75}
            >
              <Ionicons name="navigate-outline" size={13} color="#006FD8" />
              <Text style={styles.quickMapPillText}>Show Anuradhapura on Map</Text>
            </TouchableOpacity>
          </View>

          {/* Trip Controls (Rest Stop / End Trip) */}
          <View style={styles.tripControlsRow}>
            <TouchableOpacity
              style={styles.tripControlBtn}
              onPress={() =>
                Alert.alert(
                  'Rest Stop Logged',
                  'Refreshment rest stop logged at highway depot. Passengers and dispatch notified.'
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

        {/* Scrollable Booked Passengers & Pickup Locations */}
        <ScrollView style={styles.passengerScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.stopsHeaderRow}>
            <Text style={styles.stopsSectionTitle}>Booked Passengers & Pickups</Text>
            <Text style={styles.stopsCountBadge}>6 Waypoints</Text>
          </View>

          {/* Stop 1: Thalawa Bus Stand (Next Pickup - 2 Passengers) */}
          <View style={styles.pickupStopCard}>
            <View style={styles.stopHeader}>
              <View style={[styles.stopIconDot, { backgroundColor: '#10B981' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stopLocationName}>Thalawa Bus Stand (Next Pickup)</Text>
                <Text style={styles.stopTimeText}>
                  ETA: 08:45 PM • 2 Booked Passengers Waiting
                </Text>
              </View>

              <TouchableOpacity
                style={styles.stopMapPillBtn}
                onPress={() =>
                  handleOpenLocationOnMap(
                    THALAWA_WAYPOINT.lat,
                    THALAWA_WAYPOINT.lng,
                    THALAWA_WAYPOINT.name
                  )
                }
                activeOpacity={0.75}
              >
                <Ionicons name="map-outline" size={12} color="#006FD8" />
                <Text style={styles.stopMapPillText}>Map</Text>
              </TouchableOpacity>
            </View>

            {passengersList
              .filter((p) => p.boardingPoint.includes('Thalawa'))
              .map((p) => (
                <View key={p.ticketRef} style={styles.passengerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.passengerNameText}>{p.name}</Text>
                    <Text style={styles.passengerSeatText}>
                      Seats: {p.seats.join(', ')} • Destination: {p.destination}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.callSmallBtn}
                    onPress={() => handleCallPassenger(p.phone, p.name)}
                  >
                    <Feather name="phone" size={13} color="#006FD8" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.boardCheckBtn,
                      p.status === 'BOARDED' && styles.boardCheckBtnDone,
                    ]}
                    onPress={() => handleToggleBoarding(p.ticketRef)}
                  >
                    <Text
                      style={[
                        styles.boardCheckText,
                        p.status === 'BOARDED' && styles.boardCheckTextDone,
                      ]}
                    >
                      {p.status === 'BOARDED' ? '✓ Boarded' : 'Check In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          {/* Stop 2: Anuradhapura New Town Bus Stand (Upcoming Pickup - 2 Passengers) */}
          <View style={styles.pickupStopCard}>
            <View style={styles.stopHeader}>
              <View style={[styles.stopIconDot, { backgroundColor: '#F59E0B' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stopLocationName}>Anuradhapura New Town Bus Stand</Text>
                <Text style={styles.stopTimeText}>
                  Scheduled Pickup: 09:20 PM • 2 Booked Passengers
                </Text>
              </View>

              <TouchableOpacity
                style={styles.stopMapPillBtn}
                onPress={() =>
                  handleOpenLocationOnMap(
                    ANURADHAPURA_WAYPOINT.lat,
                    ANURADHAPURA_WAYPOINT.lng,
                    ANURADHAPURA_WAYPOINT.name
                  )
                }
                activeOpacity={0.75}
              >
                <Ionicons name="map-outline" size={12} color="#006FD8" />
                <Text style={styles.stopMapPillText}>Map</Text>
              </TouchableOpacity>
            </View>

            {passengersList
              .filter((p) => p.boardingPoint.includes('Anuradhapura'))
              .map((p) => (
                <View key={p.ticketRef} style={styles.passengerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.passengerNameText}>{p.name}</Text>
                    <Text style={styles.passengerSeatText}>
                      Seats: {p.seats.join(', ')} • Destination: {p.destination}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.callSmallBtn}
                    onPress={() => handleCallPassenger(p.phone, p.name)}
                  >
                    <Feather name="phone" size={13} color="#006FD8" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.boardCheckBtn,
                      p.status === 'BOARDED' && styles.boardCheckBtnDone,
                    ]}
                    onPress={() => handleToggleBoarding(p.ticketRef)}
                  >
                    <Text
                      style={[
                        styles.boardCheckText,
                        p.status === 'BOARDED' && styles.boardCheckTextDone,
                      ]}
                    >
                      {p.status === 'BOARDED' ? '✓ Boarded' : 'Check In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          {/* Stop 3: Thambuththegama Town (Boarded Earlier - 2 Passengers) */}
          <View style={styles.pickupStopCard}>
            <View style={styles.stopHeader}>
              <View style={[styles.stopIconDot, { backgroundColor: '#64748B' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stopLocationName}>Thambuththegama Town</Text>
                <Text style={styles.stopTimeText}>Departed: 08:15 PM • 2 Passengers Onboard</Text>
              </View>
            </View>

            {passengersList
              .filter((p) => p.boardingPoint.includes('Thambuththegama'))
              .map((p) => (
                <View key={p.ticketRef} style={styles.passengerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.passengerNameText}>{p.name}</Text>
                    <Text style={styles.passengerSeatText}>
                      Seats: {p.seats.join(', ')} • Destination: {p.destination}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.callSmallBtn}
                    onPress={() => handleCallPassenger(p.phone, p.name)}
                  >
                    <Feather name="phone" size={13} color="#006FD8" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.boardCheckBtn, styles.boardCheckBtnDone]}
                    onPress={() => handleToggleBoarding(p.ticketRef)}
                  >
                    <Text style={[styles.boardCheckText, styles.boardCheckTextDone]}>
                      ✓ Boarded
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          {/* Stop 4: Medawachchiya Junction */}
          <View style={styles.pickupStopCard}>
            <View style={styles.stopHeader}>
              <View style={[styles.stopIconDot, { backgroundColor: '#3B82F6' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stopLocationName}>Medawachchiya Junction</Text>
                <Text style={styles.stopTimeText}>Scheduled Halt: 10:15 PM</Text>
              </View>

              <TouchableOpacity
                style={styles.stopMapPillBtn}
                onPress={() => handleOpenLocationOnMap(8.5414, 80.4952, 'Medawachchiya')}
                activeOpacity={0.75}
              >
                <Ionicons name="map-outline" size={12} color="#006FD8" />
                <Text style={styles.stopMapPillText}>Map</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stop 5: Vavuniya Rest Stop */}
          <View style={styles.pickupStopCard}>
            <View style={styles.stopHeader}>
              <View style={[styles.stopIconDot, { backgroundColor: '#8B5CF6' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stopLocationName}>Vavuniya Highway Rest Stop</Text>
                <Text style={styles.stopTimeText}>Halt: 11:30 PM • 20 Mins Refreshment Break</Text>
              </View>

              <TouchableOpacity
                style={styles.stopMapPillBtn}
                onPress={() => handleOpenLocationOnMap(8.7514, 80.4971, 'Vavuniya')}
                activeOpacity={0.75}
              >
                <Ionicons name="map-outline" size={12} color="#006FD8" />
                <Text style={styles.stopMapPillText}>Map</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stop 6: Jaffna Central Terminal */}
          <View style={[styles.pickupStopCard, { marginBottom: 30 }]}>
            <View style={styles.stopHeader}>
              <View style={[styles.stopIconDot, { backgroundColor: '#006FD8' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stopLocationName}>Jaffna Central Terminal</Text>
                <Text style={styles.stopTimeText}>Destination: 02:30 AM • Final Disembarkation</Text>
              </View>

              <TouchableOpacity
                style={styles.stopMapPillBtn}
                onPress={() =>
                  handleOpenLocationOnMap(
                    JAFFNA_DESTINATION.lat,
                    JAFFNA_DESTINATION.lng,
                    JAFFNA_DESTINATION.name
                  )
                }
                activeOpacity={0.75}
              >
                <Ionicons name="map-outline" size={12} color="#006FD8" />
                <Text style={styles.stopMapPillText}>Map</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  passengerCountPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
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

  // Next Stop Notice
  nextStopNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 6,
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
  showOnMapBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  showOnMapBtnSmallText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },

  // Main Action: Launch Live Google Maps Navigation
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
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Quick Maps Row
  quickMapsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickMapPill: {
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
  quickMapPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
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
  stopTimeText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  stopMapPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stopMapPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  passengerNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  passengerSeatText: {
    fontSize: 11,
    color: '#64748B',
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
  },
  boardCheckBtnDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  boardCheckText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006FD8',
  },
  boardCheckTextDone: {
    color: '#059669',
  },
});
