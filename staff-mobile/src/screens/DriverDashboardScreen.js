import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { MOCK_DRIVER_TRIP } from '../data/mockDatabase';

export default function DriverDashboardScreen({ user }) {
  const [tripStatus, setTripStatus] = useState('SCHEDULED'); // 'SCHEDULED' | 'IN_TRANSIT' | 'REST_HALT' | 'COMPLETED'
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [sosReason, setSosReason] = useState('Engine Overheat / Coolant Warning');
  const [sosDispatched, setSosDispatched] = useState(false);

  const handleTripToggle = () => {
    if (tripStatus === 'SCHEDULED') {
      setTripStatus('IN_TRANSIT');
      Alert.alert('Journey Started', 'GPS tracking & passenger telematics live.');
    } else if (tripStatus === 'IN_TRANSIT') {
      setTripStatus('REST_HALT');
      Alert.alert('Rest Halt', 'Coach paused at highway rest stop.');
    } else if (tripStatus === 'REST_HALT') {
      setTripStatus('IN_TRANSIT');
      Alert.alert('Resuming Journey', 'Expressway travel resumed.');
    } else if (tripStatus === 'COMPLETED') {
      Alert.alert('Trip Finished', 'Trip concluded and logged to central dispatch.');
    }
  };

  const handleFinishTrip = () => {
    setTripStatus('COMPLETED');
    Alert.alert('Trip Completed', 'Welcome to Jaffna Central Terminal. Passenger disembarkation complete.');
  };

  const handleDispatchSos = () => {
    setSosDispatched(true);
    setSosModalVisible(false);
    Alert.alert(
      '🚨 EMERGENCY SOS DISPATCHED',
      `Roadside rescue alert broadcasted to PNG Fleet Dispatch!\n\nIssue: ${sosReason}\nCoach: ${MOCK_DRIVER_TRIP.busPlate}\nNearest Lead Mechanic: Kamal Jayawardena (Makumbura Central Depot)\nStatus: Mobile Service Unit En Route (ETA 18m).`,
      [{ text: 'Acknowledged' }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Route & Coach Header Card */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>ROUTE 87 SUPER LUXURY</Text>
        </View>
        <Text style={styles.bannerTitle}>Colombo ➔ Jaffna Town</Text>
        <Text style={styles.bannerSub}>
          Coach: {MOCK_DRIVER_TRIP.busPlate} • {MOCK_DRIVER_TRIP.busModel}
        </Text>
      </View>

      {/* Telemetry Cockpit Gauges */}
      <View style={styles.telemetryCard}>
        <Text style={styles.cardHeaderSmall}>LIVE VEHICLE TELEMETRY & STATUS</Text>
        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryVal}>{tripStatus === 'IN_TRANSIT' ? '68' : '0'}</Text>
            <Text style={styles.telemetryUnit}>km/h</Text>
            <Text style={styles.telemetryLabel}>Speed</Text>
          </View>

          <View style={styles.telemetryBox}>
            <Text style={[styles.telemetryVal, { color: '#006FD8' }]}>38/40</Text>
            <Text style={styles.telemetryUnit}>Seats</Text>
            <Text style={styles.telemetryLabel}>Passengers</Text>
          </View>

          <View style={styles.telemetryBox}>
            <Text style={[styles.telemetryVal, { color: '#8b5cf6' }]}>22m</Text>
            <Text style={styles.telemetryUnit}>Countdown</Text>
            <Text style={styles.telemetryLabel}>Next Halt</Text>
          </View>
        </View>
      </View>

          {/* Trip Control Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>SHIFT OPERATION STATE:</Text>
              <View
                style={[
                  styles.statusPill,
                  tripStatus === 'IN_TRANSIT' && { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
                  tripStatus === 'REST_HALT' && { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
                  tripStatus === 'COMPLETED' && { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    tripStatus === 'IN_TRANSIT' && { color: '#059669' },
                    tripStatus === 'REST_HALT' && { color: '#b45309' },
                  ]}
                >
                  ● {tripStatus}
                </Text>
              </View>
            </View>

            <View style={styles.timeGrid}>
              <View style={styles.timeCol}>
                <Text style={styles.timeLabel}>DEPARTURE</Text>
                <Text style={styles.timeVal}>{MOCK_DRIVER_TRIP.departureTime}</Text>
              </View>
              <View style={styles.timeCol}>
                <Text style={styles.timeLabel}>EST. ARRIVAL</Text>
                <Text style={styles.timeVal}>{MOCK_DRIVER_TRIP.arrivalTime}</Text>
              </View>
              <View style={styles.timeCol}>
                <Text style={styles.timeLabel}>DISTANCE</Text>
                <Text style={styles.timeVal}>{MOCK_DRIVER_TRIP.totalDistance}</Text>
              </View>
            </View>

            {/* Trip Action Buttons */}
            {tripStatus !== 'COMPLETED' ? (
              <View style={styles.tripActionsRow}>
                <TouchableOpacity
                  style={[
                    styles.btnTripToggle,
                    tripStatus === 'IN_TRANSIT' && { backgroundColor: '#f59e0b' },
                    tripStatus === 'REST_HALT' && { backgroundColor: '#059669' },
                  ]}
                  onPress={handleTripToggle}
                >
                  <Text style={styles.btnTripText}>
                    {tripStatus === 'SCHEDULED' && '▶ START EXPRESS TRIP'}
                    {tripStatus === 'IN_TRANSIT' && '☕ PAUSE FOR REST STOP'}
                    {tripStatus === 'REST_HALT' && '▶ RESUME JOURNEY'}
                  </Text>
                </TouchableOpacity>

                {tripStatus === 'IN_TRANSIT' && (
                  <TouchableOpacity
                    style={styles.btnFinish}
                    onPress={handleFinishTrip}
                  >
                    <Text style={styles.btnFinishText}>🏁 Arrived at Jaffna</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>✓ Trip Completed & Logged to Depot</Text>
              </View>
            )}

            {/* SOS Breakdown Alert Trigger */}
            <TouchableOpacity
              style={[styles.btnSos, sosDispatched && styles.btnSosActive]}
              onPress={() => setSosModalVisible(true)}
            >
              <Text style={styles.btnSosText}>
                {sosDispatched ? '🚨 SOS ACTIVE • MECHANIC DISPATCHED' : '🚨 REPORT ROADSIDE BREAKDOWN (SOS)'}
              </Text>
            </TouchableOpacity>
          </View>

      {/* SOS Modal */}
      <Modal
        visible={sosModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSosModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sosModalBox}>
            <Text style={styles.sosModalEmoji}>🚨</Text>
            <Text style={styles.sosModalTitle}>Emergency Roadside Rescue</Text>
            <Text style={styles.sosModalSub}>
              Coach NB-4592 • Route 87 Expressway
            </Text>

            <Text style={styles.sosFieldLabel}>SELECT BREAKDOWN REASON:</Text>
            {[
              'Engine Overheat / Coolant Warning',
              'Tire Blowout / Pressure Loss',
              'Brake Pressure / Hydraulic Failure',
              'Air Suspension / Steering Fault',
              'Electrical / Alternator Breakdown',
            ].map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[styles.sosReasonBtn, sosReason === reason && styles.sosReasonBtnSelected]}
                onPress={() => setSosReason(reason)}
              >
                <Text style={[styles.sosReasonText, sosReason === reason && styles.sosReasonTextSelected]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.btnConfirmSos} onPress={handleDispatchSos}>
              <Text style={styles.btnConfirmSosText}>⚡ BROADCAST DISTRESS TO MECHANICS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancelModal} onPress={() => setSosModalVisible(false)}>
              <Text style={styles.btnCancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  banner: {
    backgroundColor: '#006FD8',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#006FD8',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 6,
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  bannerSub: {
    color: '#E0F2FE',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  // Cockpit Telemetry
  telemetryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeaderSmall: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  telemetryBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  telemetryVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  telemetryUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginTop: -2,
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  // Status Card
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  statusPill: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusPillText: {
    color: '#006FD8',
    fontSize: 11,
    fontWeight: '800',
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  timeCol: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '700',
  },
  timeVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  tripActionsRow: {
    gap: 8,
  },
  btnTripToggle: {
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#006FD8',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  btnTripText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  btnFinish: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnFinishText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  completedBadge: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 8,
  },
  completedBadgeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '800',
  },
  btnSos: {
    marginTop: 10,
    backgroundColor: '#ef4444',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSosActive: {
    backgroundColor: '#b91c1c',
  },
  btnSosText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sosModalBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  sosModalEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  sosModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ef4444',
    textAlign: 'center',
  },
  sosModalSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
  },
  sosFieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  sosReasonBtn: {
    width: '100%',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    marginBottom: 6,
  },
  sosReasonBtnSelected: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  sosReasonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  sosReasonTextSelected: {
    color: '#b91c1c',
    fontWeight: '800',
  },
  btnConfirmSos: {
    width: '100%',
    backgroundColor: '#ef4444',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnConfirmSosText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  btnCancelModal: {
    marginTop: 10,
    paddingVertical: 8,
  },
  btnCancelModalText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
});
