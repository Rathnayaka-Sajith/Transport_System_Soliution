import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {
  MOCK_JOB_CARDS,
  MOCK_EMERGENCY_RESCUES,
  MOCK_PARTS_INVENTORY,
  MOCK_FLEET_RECORDS,
} from '../data/mockDatabase';

export default function MechanicDashboardScreen({ user }) {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'sos' | 'diagnostics'
  const [jobCards, setJobCards] = useState(MOCK_JOB_CARDS);
  const [rescueCalls, setRescueCalls] = useState(MOCK_EMERGENCY_RESCUES);
  const [partsList, setPartsList] = useState(MOCK_PARTS_INVENTORY);
  const [searchPlate, setSearchPlate] = useState('NB-4592');

  // Certificate Modal State
  const [certModalVisible, setCertModalVisible] = useState(false);
  const [certBusInfo, setCertBusInfo] = useState(null);

  const toggleTask = (jobId, taskIndex) => {
    setJobCards((prev) =>
      prev.map((card) => {
        if (card.jobId === jobId) {
          const updatedTasks = [...card.tasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            done: !updatedTasks[taskIndex].done,
          };
          return { ...card, tasks: updatedTasks };
        }
        return card;
      })
    );
  };

  const handleOpenCertificateModal = (job) => {
    setCertBusInfo(job);
    setCertModalVisible(true);
  };

  const handleConfirmCertification = () => {
    if (!certBusInfo) return;
    setJobCards((prev) =>
      prev.map((card) =>
        card.jobId === certBusInfo.jobId ? { ...card, status: 'COMPLETED' } : card
      )
    );
    setCertModalVisible(false);
    Alert.alert(
      '✓ Roadworthy Certified',
      `Bus ${certBusInfo.busPlate} certified and released to Active Fleet schedule by ${user?.name || 'Lead Mechanic'}.`
    );
  };

  const handleDeployRescue = (rescueId, busPlate) => {
    setRescueCalls((prev) =>
      prev.map((r) =>
        r.rescueId === rescueId
          ? {
              ...r,
              status: 'DISPATCHED',
              assignedVan: 'Mobile Rescue Van #01 (Makumbura Central)',
              etaMinutes: 15,
            }
          : r
      )
    );
    Alert.alert(
      'Rescue Unit Deployed',
      `Mobile Service Van #01 dispatched to ${busPlate}. Crew equipped with coolant hoses and hydraulic equipment. ETA: 15 mins.`
    );
  };

  const handleResolveRescue = (rescueId) => {
    setRescueCalls((prev) =>
      prev.map((r) => (r.rescueId === rescueId ? { ...r, status: 'RESOLVED' } : r))
    );
    Alert.alert('Rescue Resolved', 'Emergency roadside incident resolved and logged.');
  };

  const activeJobCount = jobCards.filter((j) => j.status !== 'COMPLETED').length;
  const activeSosCount = rescueCalls.filter((r) => r.status !== 'RESOLVED').length;
  const searchedRecord = MOCK_FLEET_RECORDS[searchPlate.trim().toUpperCase()];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>FLEET ENGINEERING & RESCUE</Text>
        </View>
        <Text style={styles.bannerTitle}>Workshop Operations</Text>
        <Text style={styles.bannerSub}>
          Lead Mechanic: {user?.name || 'Staff'} • Central Workshop
        </Text>
      </View>

      {/* Sub Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'jobs' && styles.tabBtnActive]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'jobs' && styles.tabBtnTextActive]}>
            🔧 Job Cards ({activeJobCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'sos' && styles.tabBtnActive]}
          onPress={() => setActiveTab('sos')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'sos' && styles.tabBtnTextActive]}>
            🚨 SOS Rescues ({activeSosCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'diagnostics' && styles.tabBtnActive]}
          onPress={() => setActiveTab('diagnostics')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'diagnostics' && styles.tabBtnTextActive]}>
            📦 Fleet Diagnostics
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: JOB CARDS */}
      {activeTab === 'jobs' && (
        <>
          {/* Fleet Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#046bd2' }]}>138</Text>
              <Text style={styles.statLabel}>Active Fleet</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#f59e0b' }]}>{activeJobCount}</Text>
              <Text style={styles.statLabel}>In Service Bay</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#10b981' }]}>100%</Text>
              <Text style={styles.statLabel}>Safety Score</Text>
            </View>
          </View>

          {jobCards.map((job) => {
            const allTasksDone = job.tasks.every((t) => t.done);
            const isCompleted = job.status === 'COMPLETED';

            return (
              <View
                key={job.jobId}
                style={[styles.jobCard, isCompleted && styles.jobCardCompleted]}
              >
                <View style={styles.jobTopRow}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={styles.jobBadge}>
                        <Text style={styles.jobBadgeText}>{job.jobId}</Text>
                      </View>
                      <Text style={styles.busPlate}>{job.busPlate}</Text>
                    </View>
                    <Text style={styles.busModel}>{job.busModel}</Text>
                  </View>

                  <View
                    style={[
                      styles.priorityPill,
                      job.priority === 'HIGH' && { backgroundColor: '#fee2e2' },
                      job.priority === 'MEDIUM' && { backgroundColor: '#fef3c7' },
                      job.priority === 'LOW' && { backgroundColor: '#f1f5f9' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        job.priority === 'HIGH' && { color: '#dc2626' },
                        job.priority === 'MEDIUM' && { color: '#d97706' },
                        job.priority === 'LOW' && { color: '#64748b' },
                      ]}
                    >
                      {job.priority}
                    </Text>
                  </View>
                </View>

                {/* Issue Box */}
                <View style={styles.issueBox}>
                  <Text style={styles.issueLabel}>REPORTED DEFECT:</Text>
                  <Text style={styles.issueText}>{job.issue}</Text>
                  <Text style={styles.reportedBy}>Reported by: {job.reportedBy} • {job.depot}</Text>
                </View>

                {/* Task Checklist */}
                <Text style={styles.tasksHeader}>REPAIR & OVERHAUL CHECKLIST:</Text>
                {job.tasks.map((task, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.taskItem}
                    onPress={() => !isCompleted && toggleTask(job.jobId, idx)}
                    disabled={isCompleted}
                  >
                    <View style={[styles.taskCheckbox, task.done && styles.taskCheckboxDone]}>
                      <Text style={styles.taskTick}>{task.done ? '✓' : ''}</Text>
                    </View>
                    <Text style={[styles.taskText, task.done && styles.taskTextDone]}>
                      {task.text}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* Action Button */}
                {!isCompleted ? (
                  <TouchableOpacity
                    style={[styles.btnCertify, !allTasksDone && styles.btnCertifyDisabled]}
                    onPress={() => handleOpenCertificateModal(job)}
                  >
                    <Text style={styles.btnCertifyText}>
                      ✓ View & Sign Off Roadworthy Certificate
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.completedTag}>
                    <Text style={styles.completedTagText}>✓ Bus Certified Roadworthy & Dispatched</Text>
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}

      {/* TAB 2: SOS RESCUES */}
      {activeTab === 'sos' && (
        <View style={styles.sosCard}>
          <Text style={styles.sectionTitle}>🚨 Emergency Roadside Distress Calls</Text>
          <Text style={styles.sectionSub}>
            Real-time breakdown alerts broadcasted by express drivers en route.
          </Text>

          {rescueCalls.map((sos) => {
            const isDispatched = sos.status === 'DISPATCHED';
            const isResolved = sos.status === 'RESOLVED';

            return (
              <View key={sos.rescueId} style={[styles.sosItem, isResolved && styles.sosItemResolved]}>
                <View style={styles.sosTopRow}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.sosPlateText}>{sos.busPlate}</Text>
                      <View style={styles.sosRouteBadge}>
                        <Text style={styles.sosRouteText}>{sos.route}</Text>
                      </View>
                    </View>
                    <Text style={styles.sosTimeText}>{sos.timeReported} • {sos.location}</Text>
                  </View>

                  <View
                    style={[
                      styles.sosStatusBadge,
                      isDispatched && { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
                      isResolved && { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sosStatusText,
                        isDispatched && { color: '#046bd2' },
                        isResolved && { color: '#059669' },
                      ]}
                    >
                      {sos.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.sosIssueBox}>
                  <Text style={styles.sosIssueText}>{sos.issueDescription}</Text>
                  <Text style={styles.sosDriverInfo}>
                    Driver: {sos.driverName} • {sos.passengersOnboard} Passengers Onboard
                  </Text>
                </View>

                {isDispatched && (
                  <View style={styles.dispatchPill}>
                    <Text style={styles.dispatchPillText}>
                      🚐 {sos.assignedVan} en route (ETA: {sos.etaMinutes} mins)
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                {!isDispatched && !isResolved && (
                  <TouchableOpacity
                    style={styles.btnDeployVan}
                    onPress={() => handleDeployRescue(sos.rescueId, sos.busPlate)}
                  >
                    <Text style={styles.btnDeployVanText}>
                      ⚡ Deploy Mobile Rescue Van #01
                    </Text>
                  </TouchableOpacity>
                )}

                {isDispatched && (
                  <TouchableOpacity
                    style={styles.btnResolveRescue}
                    onPress={() => handleResolveRescue(sos.rescueId)}
                  >
                    <Text style={styles.btnResolveRescueText}>
                      ✓ Mark Breakdown Resolved & Repaired
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* TAB 3: DIAGNOSTICS & PARTS */}
      {activeTab === 'diagnostics' && (
        <>
          {/* Coach Telematics Search */}
          <View style={styles.searchCard}>
            <Text style={styles.sectionTitle}>🔍 Bus Fleet Health Diagnostic Lookup</Text>
            <Text style={styles.sectionSub}>Enter coach registration plate to view real-time diagnostics:</Text>

            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="e.g. NB-4592, ND-6612, NA-8819"
                placeholderTextColor="#94a3b8"
                value={searchPlate}
                onChangeText={setSearchPlate}
                autoCapitalize="characters"
              />
            </View>

            {searchedRecord ? (
              <View style={styles.recordBox}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordPlate}>{searchedRecord.plate}</Text>
                  <Text style={styles.recordModel}>{searchedRecord.model}</Text>
                </View>

                <View style={styles.recordGrid}>
                  <View style={styles.recordCol}>
                    <Text style={styles.recordLabel}>ODOMETER</Text>
                    <Text style={styles.recordVal}>{searchedRecord.odometerKm}</Text>
                  </View>
                  <View style={styles.recordCol}>
                    <Text style={styles.recordLabel}>ENGINE HOURS</Text>
                    <Text style={styles.recordVal}>{searchedRecord.engineHours} hrs</Text>
                  </View>
                  <View style={styles.recordCol}>
                    <Text style={styles.recordLabel}>BRAKE LINING</Text>
                    <Text style={[styles.recordVal, { color: '#059669' }]}>
                      {searchedRecord.brakeLiningPct}
                    </Text>
                  </View>
                  <View style={styles.recordCol}>
                    <Text style={styles.recordLabel}>BATTERY</Text>
                    <Text style={styles.recordVal}>{searchedRecord.batteryHealth}</Text>
                  </View>
                </View>

                <View style={styles.recordFooter}>
                  <Text style={styles.recordFooterText}>
                    Last Service: {searchedRecord.lastServiceDate} • Next Due: {searchedRecord.nextServiceDueKm}
                  </Text>
                  <Text style={styles.recordPermitText}>Permit: {searchedRecord.activePermitNo}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noRecordText}>No records for "{searchPlate}". Try NB-4592, ND-6612, or NA-8819.</Text>
            )}
          </View>

          {/* Workshop Spare Parts */}
          <View style={styles.partsCard}>
            <Text style={styles.sectionTitle}>📦 Workshop Spare Parts Inventory</Text>
            <Text style={styles.sectionSub}>Critical high-demand coach spare parts stock:</Text>

            {partsList.map((part) => (
              <View key={part.id} style={styles.partItem}>
                <View style={styles.partLeft}>
                  <Text style={styles.partName}>{part.name}</Text>
                  <Text style={styles.partCode}>SKU: {part.code} • Unit: {part.unit}</Text>
                </View>

                <View style={styles.partRight}>
                  <Text style={styles.partStock}>{part.inStock}</Text>
                  <View
                    style={[
                      styles.stockPill,
                      part.status === 'OK' && { backgroundColor: '#ecfdf5' },
                      part.status === 'LOW' && { backgroundColor: '#fffbeb' },
                      part.status === 'OUT_OF_STOCK' && { backgroundColor: '#fef2f2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockPillText,
                        part.status === 'OK' && { color: '#059669' },
                        part.status === 'LOW' && { color: '#d97706' },
                        part.status === 'OUT_OF_STOCK' && { color: '#dc2626' },
                      ]}
                    >
                      {part.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Roadworthy Certificate Modal */}
      <Modal
        visible={certModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.certBox}>
            <View style={styles.certHeader}>
              <Text style={styles.certHeaderSub}>NATIONAL TRANSPORT COMMISSION • SRI LANKA</Text>
              <Text style={styles.certHeaderTitle}>EXPRESSWAY ROADWORTHY CERTIFICATE</Text>
            </View>

            <View style={styles.certBody}>
              <Text style={styles.certStamp}>APPROVED ✓</Text>
              <Text style={styles.certBusText}>COACH: {certBusInfo?.busPlate}</Text>
              <Text style={styles.certModelText}>{certBusInfo?.busModel}</Text>

              <View style={styles.certDetailsList}>
                <Text style={styles.certDetailLine}>• Hydraulic & Air Brake Deceleration: PASSED</Text>
                <Text style={styles.certDetailLine}>• Dual Climate Air Conditioning: PASSED</Text>
                <Text style={styles.certDetailLine}>• Expressway Speed Limiter Calibration: 100 km/h</Text>
                <Text style={styles.certDetailLine}>• Emergency Exit System & Safety Glass: VERIFIED</Text>
              </View>

              <View style={styles.certSignBox}>
                <Text style={styles.certSignLabel}>CERTIFIED BY LEAD FLEET MECHANIC:</Text>
                <Text style={styles.certSignName}>{user?.name || 'Lead Fleet Mechanic'}</Text>
                <Text style={styles.certSignDepot}>Workshop: {user?.mechanicDetails?.workshop || 'Central Fleet Depot'}</Text>
                <Text style={styles.certSignDate}>Date: {new Date().toLocaleDateString()}</Text>
              </View>

              <TouchableOpacity
                style={styles.btnSignCertificate}
                onPress={handleConfirmCertification}
              >
                <Text style={styles.btnSignCertificateText}>✓ Sign & Release Bus to Active Fleet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCancelCert}
                onPress={() => setCertModalVisible(false)}
              >
                <Text style={styles.btnCancelCertText}>Cancel</Text>
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
    backgroundColor: '#f59e0b',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  bannerBadgeText: {
    color: '#0b1329',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
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
    backgroundColor: '#f59e0b',
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  // Job Cards
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  jobCardCompleted: {
    borderColor: '#a7f3d0',
    backgroundColor: '#f8fafc',
  },
  jobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobBadge: {
    backgroundColor: '#eff6ff',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  jobBadgeText: {
    color: '#046bd2',
    fontSize: 10,
    fontWeight: '800',
  },
  busPlate: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  busModel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  priorityPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  issueBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  issueLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  issueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  reportedBy: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  tasksHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  taskTick: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  taskText: {
    fontSize: 12,
    color: '#0f172a',
    flex: 1,
  },
  taskTextDone: {
    color: '#64748b',
    textDecorationLine: 'line-through',
  },
  btnCertify: {
    backgroundColor: '#10b981',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  btnCertifyDisabled: {
    opacity: 0.5,
  },
  btnCertifyText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  completedTag: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  completedTagText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
  },

  // SOS Card
  sosCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
  },
  sosItem: {
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  sosItemResolved: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  sosTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sosPlateText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#b91c1c',
  },
  sosRouteBadge: {
    backgroundColor: '#fee2e2',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  sosRouteText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#dc2626',
  },
  sosTimeText: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2,
  },
  sosStatusBadge: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  sosStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#dc2626',
  },
  sosIssueBox: {
    marginVertical: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
  },
  sosIssueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a202c',
  },
  sosDriverInfo: {
    fontSize: 10,
    color: '#718096',
    marginTop: 4,
  },
  dispatchPill: {
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  dispatchPillText: {
    color: '#046bd2',
    fontSize: 11,
    fontWeight: '700',
  },
  btnDeployVan: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDeployVanText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  btnResolveRescue: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnResolveRescueText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  // Diagnostics & Parts
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  searchRow: {
    marginVertical: 10,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  recordBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recordHeader: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
  },
  recordPlate: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
  },
  recordModel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  recordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  recordCol: {
    width: '47%',
  },
  recordLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  recordVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  recordFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  recordFooterText: {
    fontSize: 10,
    color: '#64748b',
  },
  recordPermitText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#046bd2',
    marginTop: 2,
  },
  noRecordText: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 4,
  },
  partsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  partLeft: {
    flex: 1,
    paddingRight: 10,
  },
  partName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  partCode: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  partRight: {
    alignItems: 'flex-end',
  },
  partStock: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  stockPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 2,
  },
  stockPillText: {
    fontSize: 9,
    fontWeight: '800',
  },

  // Certificate Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  certBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  certHeader: {
    backgroundColor: '#0b1329',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#10b981',
  },
  certHeaderSub: {
    color: '#10b981',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  certHeaderTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  certBody: {
    padding: 20,
    alignItems: 'center',
  },
  certStamp: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 2,
    borderWidth: 2,
    borderColor: '#059669',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 10,
  },
  certBusText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  certModelText: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 12,
  },
  certDetailsList: {
    width: '100%',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    gap: 6,
    marginBottom: 14,
  },
  certDetailLine: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  certSignBox: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    marginBottom: 14,
  },
  certSignLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
  },
  certSignName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  certSignDepot: {
    fontSize: 10,
    color: '#64748b',
  },
  certSignDate: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  btnSignCertificate: {
    width: '100%',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSignCertificateText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  btnCancelCert: {
    paddingVertical: 8,
    marginTop: 8,
  },
  btnCancelCertText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
});
