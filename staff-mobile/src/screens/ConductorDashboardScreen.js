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
import { MOCK_PASSENGERS, MOCK_LUGGAGE_REGISTRY } from '../data/mockDatabase';

export default function ConductorDashboardScreen({ user }) {
  const [activeTab, setActiveTab] = useState('seatmap'); // 'seatmap' | 'manifest' | 'cash'
  const [passengers, setPassengers] = useState(MOCK_PASSENGERS);
  const [luggageList, setLuggageList] = useState(MOCK_LUGGAGE_REGISTRY);
  const [scanCode, setScanCode] = useState('');
  const [lastScanMessage, setLastScanMessage] = useState(null);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'BOARDED' | 'PENDING'

  // Cash Ticket Modal
  const [showCashModal, setShowCashModal] = useState(false);
  const [cashName, setCashName] = useState('');
  const [cashSeat, setCashSeat] = useState('');

  // Add Luggage Modal
  const [showLuggageModal, setShowLuggageModal] = useState(false);
  const [luggageSeat, setLuggageSeat] = useState('');
  const [luggagePieces, setLuggagePieces] = useState('1');
  const [luggageCompartment, setLuggageCompartment] = useState('Side Bay A (Left)');

  // Seat Map helper (40 seats)
  const getSeatInfo = (seatNum) => {
    for (const p of passengers) {
      if (p.seats && p.seats.includes(seatNum)) {
        return {
          seat: seatNum,
          status: p.status, // 'BOARDED' | 'PENDING'
          passenger: p,
        };
      }
    }
    return {
      seat: seatNum,
      status: 'AVAILABLE',
      passenger: null,
    };
  };

  const handleSeatPress = (seatNum) => {
    const info = getSeatInfo(seatNum);
    if (info.status === 'AVAILABLE') {
      setCashSeat(seatNum.toString());
      setShowCashModal(true);
    } else if (info.status === 'PENDING') {
      Alert.alert(
        `Seat ${seatNum} - ${info.passenger.name}`,
        `Boarding Point: ${info.passenger.boardingPoint}\nDestination: ${info.passenger.destination}\nTicket: ${info.passenger.ticketRef}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: '✓ Mark as Boarded',
            onPress: () => handleBoardPassenger(info.passenger.ticketRef),
          },
        ]
      );
    } else if (info.status === 'BOARDED') {
      Alert.alert(
        `Seat ${seatNum} - BOARDED`,
        `${info.passenger.name} was verified at ${info.passenger.boardedAt}.\nTicket: ${info.passenger.ticketRef}`
      );
    }
  };

  const handleBoardPassenger = (ticketRef) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setPassengers((prev) =>
      prev.map((p) =>
        p.ticketRef.toUpperCase() === ticketRef.toUpperCase()
          ? { ...p, status: 'BOARDED', boardedAt: timeNow }
          : p
      )
    );
    Alert.alert('Passenger Checked In', `Ticket ${ticketRef} marked as BOARDED.`);
  };

  const handleVerifyTicket = (codeToVerify) => {
    const target = (codeToVerify || scanCode).trim().toUpperCase();
    if (!target) return;

    const match = passengers.find((p) => p.ticketRef.toUpperCase() === target);
    if (match) {
      if (match.status === 'BOARDED') {
        setLastScanMessage({
          success: false,
          text: `⚠️ Ticket ${match.ticketRef} already verified at ${match.boardedAt}!`,
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

    const seatNum = parseInt(cashSeat, 10);
    const existing = getSeatInfo(seatNum);
    if (existing.status !== 'AVAILABLE') {
      Alert.alert('Seat Taken', `Seat ${seatNum} is already occupied by ${existing.passenger?.name}.`);
      return;
    }

    const newTicket = {
      ticketRef: 'PNG-CASH-' + Math.floor(1000 + Math.random() * 9000),
      name: cashName.trim(),
      phone: 'Onboard Cash',
      seats: [seatNum],
      boardingPoint: 'En-Route Expressway Halt',
      destination: 'Jaffna',
      status: 'BOARDED',
      boardedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setPassengers([newTicket, ...passengers]);
    setShowCashModal(false);
    setCashName('');
    setCashSeat('');
    Alert.alert('Ticket Issued', `Cash ticket ${newTicket.ticketRef} generated for Seat ${seatNum}.`);
  };

  const handleAddLuggage = () => {
    if (!luggageSeat.trim()) {
      Alert.alert('Required', 'Please enter the passenger seat number.');
      return;
    }
    const newTag = {
      tagNo: 'LUG-' + Math.floor(8810 + Math.random() * 900),
      seatNo: parseInt(luggageSeat, 10),
      passengerName: 'Passenger (Seat ' + luggageSeat + ')',
      pieces: parseInt(luggagePieces, 10) || 1,
      compartment: luggageCompartment,
      weightKg: (parseInt(luggagePieces, 10) * 12) + ' kg',
    };
    setLuggageList([newTag, ...luggageList]);
    setShowLuggageModal(false);
    setLuggageSeat('');
    Alert.alert('Luggage Tagged', `Tag ${newTag.tagNo} issued for Seat ${luggageSeat}.`);
  };

  const boardedCount = passengers.filter((p) => p.status === 'BOARDED').length;
  const pendingCount = passengers.filter((p) => p.status === 'PENDING').length;
  const cashTicketsCount = passengers.filter((p) => p.ticketRef.startsWith('PNG-CASH')).length;
  const cashTotalRs = cashTicketsCount * 2300; // Rs. 2,300 per seat

  const filteredPassengers = passengers.filter((p) => {
    if (filterMode === 'BOARDED') return p.status === 'BOARDED';
    if (filterMode === 'PENDING') return p.status === 'PENDING';
    return true;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>CONDUCTOR OPERATIONS</Text>
        </View>
        <Text style={styles.bannerTitle}>Route 87: Colombo ➔ Jaffna</Text>
        <Text style={styles.bannerSub}>
          Manifest: {boardedCount} Boarded • {pendingCount} Pending • {40 - (boardedCount + pendingCount)} Vacant Seats
        </Text>
      </View>

      {/* Sub Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'seatmap' && styles.tabBtnActive]}
          onPress={() => setActiveTab('seatmap')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'seatmap' && styles.tabBtnTextActive]}>
            💺 Seat Map (40)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'manifest' && styles.tabBtnActive]}
          onPress={() => setActiveTab('manifest')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'manifest' && styles.tabBtnTextActive]}>
            🎫 QR Scan & List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'cash' && styles.tabBtnActive]}
          onPress={() => setActiveTab('cash')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'cash' && styles.tabBtnTextActive]}>
            💰 Cash & Luggage
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: VISUAL 40-SEAT MAP */}
      {activeTab === 'seatmap' && (
        <View style={styles.seatmapCard}>
          <View style={styles.seatmapHeader}>
            <Text style={styles.seatmapTitle}>🚌 Coach 40-Seat Interactive Layout</Text>
            <Text style={styles.seatmapSub}>
              Tap any seat to check-in booked passengers or sell vacant seats for cash.
            </Text>
          </View>

          {/* Color Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Boarded ({boardedCount})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Booked ({pendingCount})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#e2e8f0', borderColor: '#cbd5e1', borderWidth: 1 }]} />
              <Text style={styles.legendText}>Vacant</Text>
            </View>
          </View>

          {/* Front Driver Cabin Indicator */}
          <View style={styles.driverCabinBox}>
            <Text style={styles.driverCabinText}>🚍 FRONT • DRIVER CABIN & DOOR</Text>
          </View>

          {/* 10 Rows of 4 Seats (2 Left | Aisle | 2 Right) */}
          <View style={styles.busGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rowIdx) => {
              const s1 = (rowIdx - 1) * 4 + 1;
              const s2 = (rowIdx - 1) * 4 + 2;
              const s3 = (rowIdx - 1) * 4 + 3;
              const s4 = (rowIdx - 1) * 4 + 4;

              const renderSeat = (sNum) => {
                const info = getSeatInfo(sNum);
                const isBoarded = info.status === 'BOARDED';
                const isBooked = info.status === 'PENDING';

                return (
                  <TouchableOpacity
                    key={sNum}
                    style={[
                      styles.seatBtn,
                      isBoarded && styles.seatBoarded,
                      isBooked && styles.seatBooked,
                    ]}
                    onPress={() => handleSeatPress(sNum)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.seatNum,
                        (isBoarded || isBooked) && { color: '#ffffff' },
                      ]}
                    >
                      {sNum}
                    </Text>
                    {isBoarded && <Text style={styles.seatIconMini}>✓</Text>}
                    {isBooked && <Text style={styles.seatIconMini}>⏳</Text>}
                  </TouchableOpacity>
                );
              };

              return (
                <View key={rowIdx} style={styles.seatRow}>
                  {/* Left Pair */}
                  <View style={styles.seatPair}>
                    {renderSeat(s1)}
                    {renderSeat(s2)}
                  </View>

                  {/* Aisle */}
                  <View style={styles.aisle}>
                    <Text style={styles.aisleText}>{rowIdx}</Text>
                  </View>

                  {/* Right Pair */}
                  <View style={styles.seatPair}>
                    {renderSeat(s3)}
                    {renderSeat(s4)}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* TAB 2: MANIFEST & QR SCANNER */}
      {activeTab === 'manifest' && (
        <>
          {/* Scanner Card */}
          <View style={styles.scannerCard}>
            <Text style={styles.scannerTitle}>📷 Live Ticket QR Puncher</Text>
            <Text style={styles.scannerSub}>Type or scan passenger ticket reference:</Text>

            {lastScanMessage ? (
              <View
                style={[
                  styles.scanResultBanner,
                  { backgroundColor: lastScanMessage.success ? '#ecfdf5' : '#fef2f2' },
                ]}
              >
                <Text
                  style={[
                    styles.scanResultText,
                    { color: lastScanMessage.success ? '#065f46' : '#991b1b' },
                  ]}
                >
                  {lastScanMessage.text}
                </Text>
              </View>
            ) : null}

            <View style={styles.inputRow}>
              <TextInput
                style={styles.scanInput}
                placeholder="PNG-BK884102 or tap demo"
                placeholderTextColor="#94a3b8"
                value={scanCode}
                onChangeText={setScanCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.btnVerify}
                onPress={() => handleVerifyTicket()}
              >
                <Text style={styles.btnVerifyText}>Verify</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Demo Scan Buttons */}
            <View style={styles.demoPillsRow}>
              <Text style={styles.demoLabel}>Tap to verify:</Text>
              <TouchableOpacity
                style={styles.demoPill}
                onPress={() => handleVerifyTicket('PNG-BK994123')}
              >
                <Text style={styles.demoPillText}>Sithara (Seat 5)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoPill}
                onPress={() => handleVerifyTicket('PNG-BK552910')}
              >
                <Text style={styles.demoPillText}>Ramanathan (6,7)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            {['ALL', 'BOARDED', 'PENDING'].map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, filterMode === f && styles.filterPillActive]}
                onPress={() => setFilterMode(f)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filterMode === f && styles.filterPillTextActive,
                  ]}
                >
                  {f === 'ALL' && `All (${passengers.length})`}
                  {f === 'BOARDED' && `Boarded (${boardedCount})`}
                  {f === 'PENDING' && `Pending (${pendingCount})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Passenger List */}
          {filteredPassengers.map((p) => (
            <View key={p.ticketRef} style={styles.passengerCard}>
              <View style={styles.passengerTopRow}>
                <View>
                  <Text style={styles.passengerName}>{p.name}</Text>
                  <Text style={styles.ticketRef}>{p.ticketRef}</Text>
                </View>

                <View
                  style={[
                    styles.boardedBadge,
                    p.status === 'PENDING' && styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.boardedBadgeText,
                      p.status === 'PENDING' && styles.pendingBadgeText,
                    ]}
                  >
                    {p.status === 'BOARDED' ? '✓ BOARDED' : '⏳ PENDING'}
                  </Text>
                </View>
              </View>

              <View style={styles.passengerDetailsRow}>
                <Text style={styles.detailText}>
                  💺 Seat: <Text style={{ fontWeight: '800' }}>{p.seats.join(', ')}</Text>
                </Text>
                <Text style={styles.detailText}>
                  📍 From: <Text style={{ fontWeight: '800' }}>{p.boardingPoint}</Text>
                </Text>
              </View>

              {p.status === 'PENDING' && (
                <TouchableOpacity
                  style={styles.btnQuickBoard}
                  onPress={() => handleBoardPassenger(p.ticketRef)}
                >
                  <Text style={styles.btnQuickBoardText}>✓ Board Passenger Now</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </>
      )}

      {/* TAB 3: CASH & LUGGAGE REGISTER */}
      {activeTab === 'cash' && (
        <View style={styles.cashCard}>
          <Text style={styles.seatmapTitle}>💰 Conductor Cash Register</Text>
          <Text style={styles.seatmapSub}>
            Accounting for physical cash tickets issued onboard during current journey.
          </Text>

          <View style={styles.cashStatsGrid}>
            <View style={styles.cashStatBox}>
              <Text style={styles.cashStatVal}>Rs. {cashTotalRs.toLocaleString()}</Text>
              <Text style={styles.cashStatLabel}>Cash In Hand</Text>
            </View>

            <View style={styles.cashStatBox}>
              <Text style={[styles.cashStatVal, { color: '#046bd2' }]}>{cashTicketsCount}</Text>
              <Text style={styles.cashStatLabel}>Cash Tickets</Text>
            </View>

            <View style={styles.cashStatBox}>
              <Text style={[styles.cashStatVal, { color: '#8b5cf6' }]}>{luggageList.length}</Text>
              <Text style={styles.cashStatLabel}>Luggage Bays</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnIssueCash}
            onPress={() => setShowCashModal(true)}
          >
            <Text style={styles.btnIssueCashText}>+ Sell Walk-in Cash Ticket (Rs. 2,300)</Text>
          </TouchableOpacity>

          {/* Luggage Section */}
          <View style={styles.luggageHeaderRow}>
            <Text style={styles.seatmapTitle}>🧳 Cargo & Luggage Register</Text>
            <TouchableOpacity
              style={styles.btnAddLuggagePill}
              onPress={() => setShowLuggageModal(true)}
            >
              <Text style={styles.btnAddLuggagePillText}>+ Tag Bag</Text>
            </TouchableOpacity>
          </View>

          {luggageList.map((lug) => (
            <View key={lug.tagNo} style={styles.luggageItem}>
              <View style={styles.luggageLeft}>
                <Text style={styles.luggageTagNo}>{lug.tagNo}</Text>
                <Text style={styles.luggagePassenger}>
                  Seat {lug.seatNo} • {lug.pieces} Pieces ({lug.weightKg})
                </Text>
                <Text style={styles.luggageBay}>{lug.compartment}</Text>
              </View>
              <View style={styles.luggageVerifiedBadge}>
                <Text style={styles.luggageVerifiedText}>STOWED</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Cash Ticket Modal */}
      <Modal
        visible={showCashModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCashModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cashModalBox}>
            <Text style={styles.modalTitle}>Sell Walk-in Cash Ticket</Text>
            <Text style={styles.modalSub}>Colombo ➔ Jaffna Express (Fare: Rs. 2,300)</Text>

            <Text style={styles.modalLabel}>PASSENGER FULL NAME</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Ruwan Silva"
              placeholderTextColor="#94a3b8"
              value={cashName}
              onChangeText={setCashName}
            />

            <Text style={styles.modalLabel}>ASSIGN SEAT NUMBER (1 to 40)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 19"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              value={cashSeat}
              onChangeText={setCashSeat}
            />

            <TouchableOpacity
              style={styles.btnSubmitTicket}
              onPress={handleIssueCashTicket}
            >
              <Text style={styles.btnSubmitTicketText}>Print & Issue Ticket (Rs. 2,300)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancelTicket}
              onPress={() => setShowCashModal(false)}
            >
              <Text style={styles.btnCancelTicketText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Luggage Tag Modal */}
      <Modal
        visible={showLuggageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLuggageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cashModalBox}>
            <Text style={styles.modalTitle}>Tag Cargo / Baggage</Text>
            <Text style={styles.modalSub}>Coach Luggage Compartment Assignment</Text>

            <Text style={styles.modalLabel}>PASSENGER SEAT NUMBER</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 8"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              value={luggageSeat}
              onChangeText={setLuggageSeat}
            />

            <Text style={styles.modalLabel}>NUMBER OF PIECES</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 2"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              value={luggagePieces}
              onChangeText={setLuggagePieces}
            />

            <Text style={styles.modalLabel}>SELECT STORAGE COMPARTMENT</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {['Side Bay A (Left)', 'Side Bay B (Right)'].map((bay) => (
                <TouchableOpacity
                  key={bay}
                  style={[
                    styles.filterPill,
                    luggageCompartment === bay && styles.filterPillActive,
                    { flex: 1, alignItems: 'center' },
                  ]}
                  onPress={() => setLuggageCompartment(bay)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      luggageCompartment === bay && styles.filterPillTextActive,
                    ]}
                  >
                    {bay}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.btnSubmitTicket}
              onPress={handleAddLuggage}
            >
              <Text style={styles.btnSubmitTicketText}>✓ Issue Luggage Tag</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancelTicket}
              onPress={() => setShowLuggageModal(false)}
            >
              <Text style={styles.btnCancelTicketText}>Cancel</Text>
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
  },
  banner: {
    backgroundColor: '#0b1329',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10b981',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  bannerBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  bannerSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#10b981',
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#ffffff',
  },

  // Seat Map
  seatmapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  seatmapHeader: {
    marginBottom: 10,
  },
  seatmapTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  seatmapSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 8,
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  driverCabinBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  driverCabinText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
  },
  busGrid: {
    gap: 8,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatPair: {
    flexDirection: 'row',
    gap: 6,
  },
  aisle: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aisleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  seatBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatBoarded: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  seatBooked: {
    backgroundColor: '#f59e0b',
    borderColor: '#d97706',
  },
  seatNum: {
    fontSize: 13,
    fontWeight: '900',
    color: '#334155',
  },
  seatIconMini: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '900',
    marginTop: -2,
  },

  // Scanner
  scannerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  scannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  scannerSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 10,
  },
  scanResultBanner: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  scanResultText: {
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '700',
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
    fontSize: 13,
    fontWeight: '800',
  },
  demoPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  demoLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  demoPill: {
    backgroundColor: '#eff6ff',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  demoPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#046bd2',
  },

  // Filters & Passenger Cards
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  filterPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#ffffff',
  },
  passengerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  passengerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  passengerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  ticketRef: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  boardedBadge: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  boardedBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  pendingBadge: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  pendingBadgeText: {
    color: '#b45309',
  },
  passengerDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailText: {
    fontSize: 11,
    color: '#475569',
  },
  btnQuickBoard: {
    marginTop: 10,
    backgroundColor: '#10b981',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnQuickBoardText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  // Cash Tab
  cashCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cashStatsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  cashStatBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  cashStatVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#10b981',
  },
  cashStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2,
  },
  btnIssueCash: {
    backgroundColor: '#046bd2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnIssueCashText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  luggageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnAddLuggagePill: {
    backgroundColor: '#0f172a',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  btnAddLuggagePillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  luggageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  luggageLeft: {
    flex: 1,
  },
  luggageTagNo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  luggagePassenger: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  luggageBay: {
    fontSize: 10,
    color: '#046bd2',
    fontWeight: '700',
    marginTop: 1,
  },
  luggageVerifiedBadge: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  luggageVerifiedText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cashModalBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  modalInput: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 12,
  },
  btnSubmitTicket: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  btnSubmitTicketText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  btnCancelTicket: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 6,
  },
  btnCancelTicketText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
});
