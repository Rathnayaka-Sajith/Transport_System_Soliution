import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { MOCK_PASSENGERS } from '../data/mockDatabase';

export default function ConductorDashboardScreen({ user }) {
  const [passengers, setPassengers] = useState(MOCK_PASSENGERS);
  const [scanCode, setScanCode] = useState('');
  const [lastScanMessage, setLastScanMessage] = useState(null);

  // Cash Ticket Modal
  const [showCashModal, setShowCashModal] = useState(false);
  const [cashName, setCashName] = useState('');
  const [cashSeat, setCashSeat] = useState('');

  const handleVerifyTicket = (codeToVerify) => {
    const target = (codeToVerify || scanCode).trim().toUpperCase();
    if (!target) return;

    const match = passengers.find((p) => p.ticketRef.toUpperCase() === target);
    if (match) {
      if (match.status === 'BOARDED') {
        setLastScanMessage({
          success: false,
          text: `⚠️ Ticket ${match.ticketRef} was already verified at ${match.boardedAt}!`,
        });
      } else {
        const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        setPassengers((prev) =>
          prev.map((p) =>
            p.ticketRef.toUpperCase() === target ? { ...p, status: 'BOARDED', boardedAt: timeNow } : p
          )
        );
        setLastScanMessage({
          success: true,
          text: `✅ Verified! ${match.name} • Seat ${match.seats.join(', ')} marked as BOARDED!`,
        });
      }
    } else {
      setLastScanMessage({
        success: false,
        text: `❌ Invalid Ticket: "${target}" not found on today's manifest.`,
      });
    }
    setScanCode('');
  };

  const handleIssueCashTicket = () => {
    if (!cashName.trim() || !cashSeat.trim()) {
      Alert.alert('Required', 'Please enter passenger name and assigned seat number.');
      return;
    }

    const newTicket = {
      ticketRef: 'PNG-CASH-' + Math.floor(1000 + Math.random() * 9000),
      name: cashName.trim(),
      phone: 'Onboard Cash',
      seats: [parseInt(cashSeat, 10)],
      boardingPoint: 'En-Route Expressway Halt',
      destination: 'Jaffna',
      status: 'BOARDED',
      boardedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setPassengers([newTicket, ...passengers]);
    setShowCashModal(false);
    setCashName('');
    setCashSeat('');
    Alert.alert('Ticket Issued', `Cash ticket ${newTicket.ticketRef} generated for Seat ${newTicket.seats[0]}.`);
  };

  const boardedCount = passengers.filter((p) => p.status === 'BOARDED').length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>CONDUCTOR OPERATIONS</Text>
        </View>
        <Text style={styles.bannerTitle}>Route 87: Colombo ➔ Jaffna</Text>
        <Text style={styles.bannerSub}>
          Manifest: {boardedCount} Boarded • {passengers.length - boardedCount} Awaiting Boarding
        </Text>
      </View>

      {/* Ticket Scanner Box */}
      <View style={styles.scannerCard}>
        <Text style={styles.scannerTitle}>📷 Live Passenger Ticket Scanner</Text>
        <Text style={styles.scannerSub}>Scan customer QR code or input digital ticket ref:</Text>

        {lastScanMessage ? (
          <View
            style={[
              styles.msgBanner,
              lastScanMessage.success ? styles.msgSuccess : styles.msgWarning,
            ]}
          >
            <Text
              style={[
                styles.msgText,
                lastScanMessage.success ? styles.msgTextSuccess : styles.msgTextWarning,
              ]}
            >
              {lastScanMessage.text}
            </Text>
          </View>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.scanInput}
            placeholder="e.g. PNG-BK884102"
            placeholderTextColor="#94a3b8"
            value={scanCode}
            onChangeText={setScanCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.btnVerify} onPress={() => handleVerifyTicket()}>
            <Text style={styles.btnVerifyText}>Verify</Text>
          </TouchableOpacity>
        </View>

        {/* Quick test chips */}
        <View style={styles.testChipsRow}>
          <Text style={styles.testLabel}>Quick Test:</Text>
          {['PNG-BK884102', 'PNG-BK994123', 'PNG-BK102938'].map((code) => (
            <TouchableOpacity
              key={code}
              style={styles.chip}
              onPress={() => handleVerifyTicket(code)}
            >
              <Text style={styles.chipText}>{code}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Passenger Manifest */}
      <View style={styles.manifestCard}>
        <View style={styles.manifestHeader}>
          <Text style={styles.manifestTitle}>👥 Passenger Boarding Manifest</Text>
          <TouchableOpacity
            style={styles.btnCashTicket}
            onPress={() => setShowCashModal(true)}
          >
            <Text style={styles.btnCashText}>+ Issue Cash</Text>
          </TouchableOpacity>
        </View>

        {passengers.map((p) => (
          <View
            key={p.ticketRef}
            style={[styles.passengerRow, p.status === 'BOARDED' && styles.passengerRowBoarded]}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.passengerTopLine}>
                <Text style={styles.passengerName}>{p.name}</Text>
                <View style={styles.seatBadge}>
                  <Text style={styles.seatBadgeText}>Seat {p.seats.join(', ')}</Text>
                </View>
              </View>
              <Text style={styles.passengerMeta}>
                Ref: {p.ticketRef} • Boarding: {p.boardingPoint}
              </Text>
            </View>

            {p.status === 'BOARDED' ? (
              <View style={styles.boardedPill}>
                <Text style={styles.boardedText}>✓ BOARDED ({p.boardedAt})</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.btnBoardNow}
                onPress={() => handleVerifyTicket(p.ticketRef)}
              >
                <Text style={styles.btnBoardNowText}>Board</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Cash Ticket Modal */}
      <Modal visible={showCashModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Issue Onboard Cash Ticket</Text>
            <Text style={styles.modalSub}>For walk-in passengers boarding en route</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Passenger Full Name"
              placeholderTextColor="#94a3b8"
              value={cashName}
              onChangeText={setCashName}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Assigned Seat No (e.g. 24)"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              value={cashSeat}
              onChangeText={setCashSeat}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setShowCashModal(false)}
              >
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirmCash} onPress={handleIssueCashTicket}>
                <Text style={styles.btnConfirmCashText}>Confirm Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#10b981',
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
    color: '#ecfdf5',
    fontSize: 12,
    marginTop: 2,
  },
  scannerCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  scannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  scannerSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 10,
  },
  msgBanner: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  msgSuccess: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  msgWarning: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  msgText: {
    fontSize: 12,
    fontWeight: '700',
  },
  msgTextSuccess: {
    color: '#065f46',
  },
  msgTextWarning: {
    color: '#991b1b',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scanInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
  },
  btnVerify: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVerifyText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  testChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  testLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  chip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0f172a',
  },
  manifestCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  manifestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  manifestTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  btnCashTicket: {
    backgroundColor: '#046bd2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnCashText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  passengerRowBoarded: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  passengerTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  passengerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  seatBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  seatBadgeText: {
    color: '#046bd2',
    fontSize: 10,
    fontWeight: '800',
  },
  passengerMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  boardedPill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  boardedText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  btnBoardNow: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnBoardNowText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  modalInput: {
    height: 44,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  btnCancel: {
    flex: 1,
    height: 42,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelText: {
    color: '#475569',
    fontWeight: '700',
  },
  btnConfirmCash: {
    flex: 1,
    height: 42,
    backgroundColor: '#046bd2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnConfirmCashText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
