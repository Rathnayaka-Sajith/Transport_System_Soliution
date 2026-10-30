import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MOCK_DRIVER_TRIP, MOCK_CHECKLIST } from '../data/mockDatabase';

export default function DriverDashboardScreen({ user }) {
  const [tripStatus, setTripStatus] = useState('SCHEDULED'); // 'SCHEDULED' | 'IN_TRANSIT' | 'REST_HALT' | 'COMPLETED'
  const [checklist, setChecklist] = useState(MOCK_CHECKLIST);
  const [sosActive, setSosActive] = useState(false);

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleTripToggle = () => {
    if (tripStatus === 'SCHEDULED') {
      // Check if all safety items are checked
      const pending = checklist.filter((c) => !c.done);
      if (pending.length > 0) {
        Alert.alert(
          'Checklist Incomplete',
          `Please certify all safety checklist items before departure (${pending.length} pending).`
        );
        return;
      }
      setTripStatus('IN_TRANSIT');
      Alert.alert('Journey Started', 'GPS tracking activated. Have a safe journey!');
    } else if (tripStatus === 'IN_TRANSIT') {
      setTripStatus('REST_HALT');
      Alert.alert('Rest Halt', 'Bus paused at designated rest stop.');
    } else if (tripStatus === 'REST_HALT') {
      setTripStatus('IN_TRANSIT');
      Alert.alert('Resuming Journey', 'Expressway travel resumed.');
    }
  };

  const handleSos = () => {
    setSosActive(true);
    Alert.alert(
      '🚨 BREAKDOWN SOS DISPATCHED',
      `Emergency roadside assistance alert broadcasted to PNG Fleet Dispatch and nearest mechanic (Kamal Jayawardena - Makumbura Depot).\n\nCurrent Coach: ${MOCK_DRIVER_TRIP.busPlate}\nRoute: ${MOCK_DRIVER_TRIP.routeName}`,
      [{ text: 'Acknowledged' }]
    );
  };

  const certifiedCount = checklist.filter((c) => c.done).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>ROUTE 87 SUPER LUXURY</Text>
        </View>
        <Text style={styles.bannerTitle}>Colombo ➔ Jaffna Town</Text>
        <Text style={styles.bannerSub}>
          Coach: {MOCK_DRIVER_TRIP.busPlate} • {MOCK_DRIVER_TRIP.busModel}
        </Text>
      </View>

      {/* Trip Status Bar */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>CURRENT TRIP STATUS:</Text>
          <View
            style={[
              styles.statusPill,
              tripStatus === 'IN_TRANSIT' && { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                tripStatus === 'IN_TRANSIT' && { color: '#059669' },
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

        {/* Action Controls */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.btnMainAction,
              tripStatus === 'IN_TRANSIT' && { backgroundColor: '#f59e0b' },
            ]}
            onPress={handleTripToggle}
          >
            <Text style={styles.btnMainActionText}>
              {tripStatus === 'SCHEDULED' && '🚀 Start Trip Journey'}
              {tripStatus === 'IN_TRANSIT' && '☕ Pause at Rest Stop'}
              {tripStatus === 'REST_HALT' && '▶️ Resume Journey'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSos, sosActive && { backgroundColor: '#7f1d1d' }]}
            onPress={handleSos}
          >
            <Text style={styles.btnSosText}>{sosActive ? '🚨 SOS ACTIVE' : '🚨 SOS'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pre-Trip Vehicle Checklist */}
      <View style={styles.checklistCard}>
        <View style={styles.checklistHeader}>
          <Text style={styles.checklistTitle}>📋 Pre-Trip Safety Inspection</Text>
          <Text style={styles.checklistCounter}>
            {certifiedCount} of {checklist.length} Certified
          </Text>
        </View>

        {checklist.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.checklistItem, item.done && styles.checklistItemDone]}
            onPress={() => toggleChecklistItem(item.id)}
          >
            <Text style={[styles.itemText, item.done && styles.itemTextDone]}>
              {item.title}
            </Text>
            <Text style={[styles.itemBadge, { color: item.done ? '#15803d' : '#dc2626' }]}>
              {item.done ? '✓ CERTIFIED' : '✕ PENDING'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Route Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.checklistTitle}>📍 Route Stops &amp; Waypoints</Text>
        {MOCK_DRIVER_TRIP.stops.map((stop, i) => (
          <View key={i} style={styles.timelineRow}>
            <Text style={styles.timelineDot}>
              {stop.status === 'DEPARTED' ? '🟢' : stop.status === 'CURRENT' ? '🟡' : '⚪'}
            </Text>
            <Text style={styles.timelineName}>{stop.name}</Text>
            <Text style={styles.timelineTime}>{stop.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  banner: {
    backgroundColor: '#046bd2',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  bannerBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  bannerSub: {
    color: '#e0f2fe',
    fontSize: 12,
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusPillText: {
    color: '#046bd2',
    fontSize: 11,
    fontWeight: '800',
  },
  timeGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  timeCol: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
  },
  timeVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnMainAction: {
    flex: 1,
    height: 46,
    backgroundColor: '#046bd2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnMainActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  btnSos: {
    paddingHorizontal: 14,
    height: 46,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSosText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  checklistCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  checklistCounter: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  checklistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 6,
  },
  checklistItemDone: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  itemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  itemTextDone: {
    color: '#15803d',
  },
  itemBadge: {
    fontSize: 10,
    fontWeight: '800',
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  timelineDot: {
    fontSize: 10,
    marginRight: 8,
  },
  timelineName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
});
