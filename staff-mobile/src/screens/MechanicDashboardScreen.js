import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  mechanicStore,
  getMonthlyInspectionStatus,
  calculateDaysSinceTest,
} from '../data/mechanicStore';
import {
  MOCK_JOB_CARDS,
  MOCK_EMERGENCY_RESCUES,
  MOCK_PARTS_INVENTORY,
  MOCK_FLEET_RECORDS,
} from '../data/mockDatabase';

export default function MechanicDashboardScreen({ user }) {
  // Main tabs: 'requests' (Driver Issue Requests) | 'monthly' (1x/Month Fleet Inspection) | 'jobs' | 'sos' | 'diagnostics'
  const [activeTab, setActiveTab] = useState('requests');

  // Shared store state
  const [mechanicData, setMechanicData] = useState(mechanicStore.getState());
  const [requestFilter, setRequestFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'SCHEDULED' | 'COMPLETED'

  // Job Cards & Rescues legacy state
  const [jobCards, setJobCards] = useState(MOCK_JOB_CARDS);
  const [rescueCalls, setRescueCalls] = useState(MOCK_EMERGENCY_RESCUES);
  const [partsList, setPartsList] = useState(MOCK_PARTS_INVENTORY);
  const [searchPlate, setSearchPlate] = useState('NB-4592');

  // Subscribe to real-time mechanicStore updates (Driver defect submissions & renewals)
  useEffect(() => {
    const unsub = mechanicStore.subscribe((newState) => {
      setMechanicData({ ...newState });
    });
    return unsub;
  }, []);

  // -------------------------------------------------------------
  // MODAL 1: SCHEDULE MAINTENANCE & GIVE TIME
  // -------------------------------------------------------------
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedRequestToSchedule, setSelectedRequestToSchedule] = useState(null);
  const [scheduledTimeInput, setScheduledTimeInput] = useState('');
  const [scheduleNotesInput, setScheduleNotesInput] = useState('');

  const handleOpenScheduleModal = (req) => {
    setSelectedRequestToSchedule(req);
    setScheduledTimeInput(req.scheduledTime || 'Today, 08:30 PM (Post-Trip Depot Halt)');
    setScheduleNotesInput(req.mechanicNotes || '');
    setScheduleModalVisible(true);
  };

  const handleConfirmSchedule = () => {
    if (!selectedRequestToSchedule) return;
    if (!scheduledTimeInput.trim()) {
      Alert.alert('Required', 'Please enter or select a maintenance time slot.');
      return;
    }

    mechanicStore.scheduleInspection(selectedRequestToSchedule.id, {
      mechanicName: user?.name || 'Sunil Perera (Lead Mechanic)',
      scheduledTime: scheduledTimeInput.trim(),
      notes: scheduleNotesInput.trim(),
    });

    setScheduleModalVisible(false);
    Alert.alert(
      'Maintenance Time Assigned',
      `Inspection for bus ${selectedRequestToSchedule.busPlate} scheduled for "${scheduledTimeInput}". Driver has been notified on their dashboard.`
    );
  };

  // -------------------------------------------------------------
  // MODAL 2: INSPECT VEHICLE & RENEW FINAL TEST DATE
  // -------------------------------------------------------------
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [selectedBusForRenew, setSelectedBusForRenew] = useState(null);
  const [associatedReqId, setAssociatedReqId] = useState(null);
  const [newTestDateInput, setNewTestDateInput] = useState('2026-10-31');
  const [inspectionNotesInput, setInspectionNotesInput] = useState(
    'Passed NTC 40-point safety check, dual-air brakes, suspension & roadworthiness audit'
  );
  const [checklist, setChecklist] = useState({
    brakes: true,
    steering: true,
    tires: true,
    emissions: true,
    emergency: true,
  });

  const handleOpenRenewalModal = (bus, reqId = null) => {
    setSelectedBusForRenew(bus);
    setAssociatedReqId(reqId);
    setNewTestDateInput('2026-10-31');
    setInspectionNotesInput(
      'Passed NTC 40-point safety check, dual-air brakes, suspension & roadworthiness audit'
    );
    setChecklist({
      brakes: true,
      steering: true,
      tires: true,
      emissions: true,
      emergency: true,
    });
    setRenewModalVisible(true);
  };

  const handleConfirmRenewal = () => {
    if (!selectedBusForRenew) return;

    mechanicStore.completeInspectionAndRenewDate(associatedReqId, {
      busPlate: selectedBusForRenew.plate,
      mechanicName: user?.name || 'Sunil Perera (Lead Mechanic)',
      newTestDate: newTestDateInput.trim(),
      inspectionNotes: inspectionNotesInput.trim(),
    });

    setRenewModalVisible(false);
    Alert.alert(
      '✓ Final Test Date Renewed',
      `Bus ${selectedBusForRenew.plate} has been certified roadworthy until next month. New Final Test Date: ${newTestDateInput}. Synchronized with Driver's cockpit.`
    );
  };

  // Job Cards toggle
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

  // Emergency SOS deployment
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

  // Computed metrics
  const pendingRequestsCount = mechanicData.requests.filter((r) => r.status === 'PENDING').length;
  const activeJobCount = jobCards.filter((j) => j.status !== 'COMPLETED').length;
  const activeSosCount = rescueCalls.filter((r) => r.status !== 'RESOLVED').length;

  // Monthly Fleet Inspection metrics
  const totalFleetCount = mechanicData.fleet.length;
  const validBusesCount = mechanicData.fleet.filter(
    (b) => getMonthlyInspectionStatus(b.latestTestDate).status === 'VALID'
  ).length;
  const dueOrOverdueCount = totalFleetCount - validBusesCount;
  const compliancePct = Math.round((validBusesCount / totalFleetCount) * 100);

  // Filtered driver requests
  const filteredRequests = mechanicData.requests.filter((r) => {
    if (requestFilter === 'PENDING') return r.status === 'PENDING';
    if (requestFilter === 'SCHEDULED') return r.status === 'SCHEDULED';
    if (requestFilter === 'COMPLETED') return r.status === 'COMPLETED';
    return true;
  });

  const searchedRecord = MOCK_FLEET_RECORDS[searchPlate.trim().toUpperCase()];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Workshop Operations Header */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>FLEET ENGINEERING & WORKSHOP</Text>
        </View>
        <Text style={styles.bannerTitle}>Workshop Operations</Text>
        <Text style={styles.bannerSub}>
          Lead Mechanic: {user?.name || 'Sunil Perera'} • Central Depot Workshop
        </Text>
      </View>

      {/* TOP NOTIFICATION ALERT: When new pending requests exist from Drivers */}
      {pendingRequestsCount > 0 && (
        <TouchableOpacity
          style={styles.notificationAlertBanner}
          onPress={() => {
            setActiveTab('requests');
            setRequestFilter('PENDING');
          }}
          activeOpacity={0.85}
        >
          <View style={styles.bellIconCircle}>
            <Ionicons name="notifications" size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.notifAlertTitle}>
              {pendingRequestsCount} New Vehicle Defect Report{pendingRequestsCount > 1 ? 's' : ''}!
            </Text>
            <Text style={styles.notifAlertSub}>
              Driver reported issue awaiting mechanic pickup & time schedule.
            </Text>
          </View>
          <View style={styles.notifAlertPill}>
            <Text style={styles.notifAlertPillText}>View ➔</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Main Navigation Sub Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarScroll}
        style={styles.tabBarWrapper}
      >
        {/* Tab 1: Driver Requests */}
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={15}
            color={activeTab === 'requests' ? '#006FD8' : '#64748B'}
          />
          <Text style={[styles.tabBtnText, activeTab === 'requests' && styles.tabBtnTextActive]}>
            Driver Requests
          </Text>
          {pendingRequestsCount > 0 && (
            <View style={styles.tabBadgeRed}>
              <Text style={styles.tabBadgeRedText}>{pendingRequestsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Tab 2: Monthly Fleet Inspections */}
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'monthly' && styles.tabBtnActive]}
          onPress={() => setActiveTab('monthly')}
        >
          <Ionicons
            name="calendar-outline"
            size={15}
            color={activeTab === 'monthly' ? '#006FD8' : '#64748B'}
          />
          <Text style={[styles.tabBtnText, activeTab === 'monthly' && styles.tabBtnTextActive]}>
            Monthly Inspections
          </Text>
          {dueOrOverdueCount > 0 && (
            <View style={styles.tabBadgeAmber}>
              <Text style={styles.tabBadgeAmberText}>{dueOrOverdueCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Tab 3: Workshop Job Cards */}
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'jobs' && styles.tabBtnActive]}
          onPress={() => setActiveTab('jobs')}
        >
          <Ionicons
            name="construct-outline"
            size={15}
            color={activeTab === 'jobs' ? '#006FD8' : '#64748B'}
          />
          <Text style={[styles.tabBtnText, activeTab === 'jobs' && styles.tabBtnTextActive]}>
            Job Cards ({activeJobCount})
          </Text>
        </TouchableOpacity>

        {/* Tab 4: SOS Highway Rescues */}
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'sos' && styles.tabBtnActive]}
          onPress={() => setActiveTab('sos')}
        >
          <Ionicons
            name="warning-outline"
            size={15}
            color={activeTab === 'sos' ? '#006FD8' : '#64748B'}
          />
          <Text style={[styles.tabBtnText, activeTab === 'sos' && styles.tabBtnTextActive]}>
            SOS Rescues ({activeSosCount})
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Fleet Diagnostics */}
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'diagnostics' && styles.tabBtnActive]}
          onPress={() => setActiveTab('diagnostics')}
        >
          <Ionicons
            name="speedometer-outline"
            size={15}
            color={activeTab === 'diagnostics' ? '#006FD8' : '#64748B'}
          />
          <Text style={[styles.tabBtnText, activeTab === 'diagnostics' && styles.tabBtnTextActive]}>
            Diagnostics & Parts
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ============================================================= */}
      {/* TAB 1: DRIVER DEFECT REQUESTS (NOTIFICATIONS & SCHEDULING)   */}
      {/* ============================================================= */}
      {activeTab === 'requests' && (
        <View style={{ width: '100%' }}>
          {/* Section Description */}
          <View style={styles.sectionHeaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="chatbubbles" size={18} color="#006FD8" />
              <Text style={styles.sectionHeaderTitle}>Driver Vehicle Defect Requests</Text>
            </View>
            <Text style={styles.sectionHeaderSub}>
              Drivers report defects directly from their vehicle cockpit. Mechanics claim requests, assign inspection times, and renew test dates.
            </Text>

            {/* Filter Pills */}
            <View style={styles.filterChipsRow}>
              {[
                { id: 'ALL', label: `All (${mechanicData.requests.length})` },
                { id: 'PENDING', label: `Pending Pickup (${pendingRequestsCount})` },
                {
                  id: 'SCHEDULED',
                  label: `Scheduled (${
                    mechanicData.requests.filter((r) => r.status === 'SCHEDULED').length
                  })`,
                },
                {
                  id: 'COMPLETED',
                  label: `Completed (${
                    mechanicData.requests.filter((r) => r.status === 'COMPLETED').length
                  })`,
                },
              ].map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterChipBtn, requestFilter === f.id && styles.filterChipBtnActive]}
                  onPress={() => setRequestFilter(f.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      requestFilter === f.id && styles.filterChipTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* List of Requests */}
          {filteredRequests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isScheduled = req.status === 'SCHEDULED';
            const isCompleted = req.status === 'COMPLETED';
            const busInfo = mechanicStore.getBusRecord(req.busPlate);

            return (
              <View
                key={req.id}
                style={[
                  styles.driverRequestCard,
                  isPending && styles.driverRequestCardPending,
                  isScheduled && styles.driverRequestCardScheduled,
                  isCompleted && styles.driverRequestCardCompleted,
                ]}
              >
                {/* Top Row: Bus Plate & Status Badge */}
                <View style={styles.reqTopRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={styles.busPlateBadge}>
                      <Ionicons name="bus" size={15} color="#006FD8" />
                      <Text style={styles.busPlateText}>{req.busPlate}</Text>
                    </View>
                    <Text style={styles.reqModelText}>{busInfo.model}</Text>
                  </View>

                  <View
                    style={[
                      styles.reqStatusBadge,
                      isPending && styles.reqStatusBadgePending,
                      isScheduled && styles.reqStatusBadgeScheduled,
                      isCompleted && styles.reqStatusBadgeCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.reqStatusBadgeText,
                        isPending && styles.reqStatusBadgeTextPending,
                        isScheduled && styles.reqStatusBadgeTextScheduled,
                        isCompleted && styles.reqStatusBadgeTextCompleted,
                      ]}
                    >
                      {isPending ? '⏳ Awaiting Pickup' : isScheduled ? '📅 Scheduled' : '✓ Completed'}
                    </Text>
                  </View>
                </View>

                {/* Driver Info & Time */}
                <View style={styles.driverInfoRow}>
                  <Feather name="user" size={13} color="#64748B" />
                  <Text style={styles.driverInfoText}>
                    Reported by: <Text style={{ fontWeight: '700' }}>{req.driverName}</Text> • {req.reportedAt}
                  </Text>
                </View>

                {/* Reported Issue Content */}
                <View style={styles.reqIssueBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.reqIssueLabel}>REPORTED DEFECT:</Text>
                    <View
                      style={[
                        styles.urgencyTag,
                        req.urgency === 'HIGH' && { backgroundColor: '#FEE2E2' },
                        req.urgency === 'URGENT' && { backgroundColor: '#FEE2E2' },
                        req.urgency === 'MEDIUM' && { backgroundColor: '#FEF3C7' },
                        req.urgency === 'LOW' && { backgroundColor: '#F1F5F9' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.urgencyTagText,
                          req.urgency === 'HIGH' && { color: '#DC2626' },
                          req.urgency === 'URGENT' && { color: '#991B1B' },
                          req.urgency === 'MEDIUM' && { color: '#D97706' },
                          req.urgency === 'LOW' && { color: '#64748B' },
                        ]}
                      >
                        {req.urgency} PRIORITY
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.reqIssueText}>"{req.issue}"</Text>
                </View>

                {/* Scheduled Time Banner (If scheduled) */}
                {isScheduled && (
                  <View style={styles.scheduledInfoBanner}>
                    <Ionicons name="time" size={16} color="#006FD8" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.scheduledInfoTitle}>
                        Inspection Time: {req.scheduledTime}
                      </Text>
                      <Text style={styles.scheduledInfoSub}>
                        Assigned Mechanic: {req.assignedMechanic}
                        {req.mechanicNotes ? ` • Note: ${req.mechanicNotes}` : ''}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Completed Details */}
                {isCompleted && (
                  <View style={styles.completedInfoBanner}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.completedInfoTitle}>
                        Inspection Completed & Final Test Date Renewed!
                      </Text>
                      <Text style={styles.completedInfoSub}>
                        Latest Test Date: {busInfo.latestTestDate} • Inspected by {req.assignedMechanic}
                      </Text>
                    </View>
                  </View>
                )}

                {/* ACTION BUTTONS BASED ON STATE */}
                {isPending && (
                  <TouchableOpacity
                    style={styles.btnClaimRequest}
                    onPress={() => handleOpenScheduleModal(req)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="construct" size={16} color="#FFFFFF" />
                    <Text style={styles.btnClaimRequestText}>
                      Claim Request & Give Maintenance Time ➔
                    </Text>
                  </TouchableOpacity>
                )}

                {isScheduled && (
                  <View style={styles.actionRowScheduled}>
                    <TouchableOpacity
                      style={styles.btnRescheduleSmall}
                      onPress={() => handleOpenScheduleModal(req)}
                      activeOpacity={0.7}
                    >
                      <Feather name="clock" size={14} color="#006FD8" />
                      <Text style={styles.btnRescheduleSmallText}>Adjust Time</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnInspectAndRenew}
                      onPress={() => handleOpenRenewalModal(busInfo, req.id)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                      <Text style={styles.btnInspectAndRenewText}>
                        Complete Check & Renew Test Date ➔
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* ============================================================= */}
      {/* TAB 2: MONTHLY FLEET INSPECTIONS (1 TIME PER MONTH PER BUS)    */}
      {/* ============================================================= */}
      {activeTab === 'monthly' && (
        <View style={{ width: '100%' }}>
          {/* Monthly Regulation Header Card */}
          <View style={styles.monthlySummaryCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="shield-checkmark" size={20} color="#006FD8" />
              <Text style={styles.monthlySummaryTitle}>Monthly Mandatory Fleet Inspections</Text>
            </View>
            <Text style={styles.monthlySummaryNotice}>
              National Transport Commission (NTC) Safety Mandate: All commercial passenger express buses must undergo comprehensive roadworthiness inspection once every 30 days.
            </Text>

            {/* Metrics Grid */}
            <View style={styles.monthlyMetricsRow}>
              <View style={styles.monthlyMetricBox}>
                <Text style={[styles.monthlyMetricNum, { color: '#006FD8' }]}>
                  {totalFleetCount}
                </Text>
                <Text style={styles.monthlyMetricLabel}>Total Fleet</Text>
              </View>

              <View style={styles.monthlyMetricBox}>
                <Text style={[styles.monthlyMetricNum, { color: '#059669' }]}>
                  {validBusesCount}
                </Text>
                <Text style={styles.monthlyMetricLabel}>Valid This Month</Text>
              </View>

              <View style={styles.monthlyMetricBox}>
                <Text
                  style={[
                    styles.monthlyMetricNum,
                    { color: dueOrOverdueCount > 0 ? '#DC2626' : '#059669' },
                  ]}
                >
                  {dueOrOverdueCount}
                </Text>
                <Text style={styles.monthlyMetricLabel}>Inspection Due</Text>
              </View>

              <View style={styles.monthlyMetricBox}>
                <Text style={[styles.monthlyMetricNum, { color: '#6366F1' }]}>
                  {compliancePct}%
                </Text>
                <Text style={styles.monthlyMetricLabel}>Compliance</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.complianceBarTrack}>
              <View style={[styles.complianceBarFill, { width: `${compliancePct}%` }]} />
            </View>
          </View>

          {/* List of All Fleet Buses and Their Monthly Test Status */}
          <Text style={styles.fleetListHeaderTitle}>Fleet Buses Monthly Inspection Status:</Text>

          {mechanicData.fleet.map((bus) => {
            const monthlyStatus = getMonthlyInspectionStatus(bus.latestTestDate);
            const isValid = monthlyStatus.status === 'VALID';
            const isDueSoon = monthlyStatus.status === 'DUE_SOON';
            const isOverdue = monthlyStatus.status === 'OVERDUE';

            return (
              <View key={bus.plate} style={styles.fleetBusCard}>
                <View style={styles.fleetCardTop}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.fleetBusPlate}>{bus.plate}</Text>
                      <View
                        style={[
                          styles.monthlyStatusBadge,
                          {
                            backgroundColor: monthlyStatus.badgeBg,
                            borderColor: monthlyStatus.badgeBorder,
                          },
                        ]}
                      >
                        <Text style={[styles.monthlyStatusBadgeText, { color: monthlyStatus.color }]}>
                          {monthlyStatus.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.fleetBusModel}>{bus.model} • {bus.year}</Text>
                  </View>
                </View>

                {/* Depot & Route */}
                <View style={styles.fleetRouteRow}>
                  <Feather name="map-pin" size={13} color="#64748B" />
                  <Text style={styles.fleetRouteText}>
                    {bus.depot} • <Text style={{ color: '#0F172A', fontWeight: '600' }}>{bus.assignedRoute}</Text>
                  </Text>
                </View>

                {/* Test Dates & Certificate Details */}
                <View style={styles.testDateBox}>
                  <View style={styles.testDateItem}>
                    <Text style={styles.testDateLabel}>Latest Test Date:</Text>
                    <Text style={styles.testDateValue}>{bus.latestTestDate}</Text>
                    <Text style={styles.testDateSub}>
                      ({monthlyStatus.daysAgo} days ago)
                    </Text>
                  </View>

                  <View style={styles.testDateItem}>
                    <Text style={styles.testDateLabel}>Next Check Due:</Text>
                    <Text
                      style={[
                        styles.testDateValue,
                        isOverdue && { color: '#DC2626' },
                        isDueSoon && { color: '#D97706' },
                        isValid && { color: '#059669' },
                      ]}
                    >
                      {isValid ? `In ${monthlyStatus.daysRemaining} days` : isDueSoon ? `Due soon!` : 'OVERDUE!'}
                    </Text>
                    <Text style={styles.testDateSub}>30-Day Rule</Text>
                  </View>
                </View>

                {/* Audit Certificate Information */}
                <Text style={styles.certAuditNotes}>
                  Cert: <Text style={{ fontWeight: '700' }}>{bus.inspectionCertNo}</Text> • {bus.inspectionNotes}
                </Text>

                {/* Perform Inspection & Renew Button */}
                <TouchableOpacity
                  style={[
                    styles.btnRenewTestDate,
                    isOverdue && styles.btnRenewTestDateOverdue,
                  ]}
                  onPress={() => handleOpenRenewalModal(bus)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="checkbox-outline" size={17} color="#FFFFFF" />
                  <Text style={styles.btnRenewTestDateText}>
                    Perform Monthly Inspection & Renew Test Date ➔
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      {/* ============================================================= */}
      {/* TAB 3: WORKSHOP JOB CARDS (OVERHAUL CHECKLIST)                */}
      {/* ============================================================= */}
      {activeTab === 'jobs' && (
        <View style={{ width: '100%' }}>
          {jobCards.map((job) => {
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
              </View>
            );
          })}
        </View>
      )}

      {/* ============================================================= */}
      {/* TAB 4: SOS RESCUES                                            */}
      {/* ============================================================= */}
      {activeTab === 'sos' && (
        <View style={{ width: '100%' }}>
          {rescueCalls.map((sos) => {
            const isDispatched = sos.status === 'DISPATCHED';
            const isResolved = sos.status === 'RESOLVED';

            return (
              <View
                key={sos.rescueId}
                style={[
                  styles.sosCard,
                  isDispatched && styles.sosCardDispatched,
                  isResolved && styles.sosCardResolved,
                ]}
              >
                <View style={styles.sosTopRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={styles.sosPulseDot} />
                    <Text style={styles.sosPlate}>{sos.busPlate}</Text>
                  </View>
                  <View
                    style={[
                      styles.sosStatusBadge,
                      isDispatched && { backgroundColor: '#eff6ff' },
                      isResolved && { backgroundColor: '#f0fdf4' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sosStatusText,
                        isDispatched && { color: '#006FD8' },
                        isResolved && { color: '#059669' },
                      ]}
                    >
                      {sos.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sosModel}>{sos.busModel}</Text>
                <Text style={styles.sosDriver}>Driver: {sos.driverName} • Tel: {sos.driverPhone}</Text>
                <Text style={styles.sosLocation}>📍 {sos.locationName} (GPS: {sos.coordinates})</Text>

                <View style={styles.breakdownNotice}>
                  <Text style={styles.breakdownLabel}>BREAKDOWN DEFECT:</Text>
                  <Text style={styles.breakdownText}>{sos.breakdownType}</Text>
                </View>

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

      {/* ============================================================= */}
      {/* TAB 5: DIAGNOSTICS & PARTS                                    */}
      {/* ============================================================= */}
      {activeTab === 'diagnostics' && (
        <View style={{ width: '100%' }}>
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

          {/* Parts inventory */}
          <View style={styles.partsCard}>
            <Text style={styles.sectionTitle}>📦 Workshop Spare Parts Inventory</Text>
            {partsList.map((part) => (
              <View key={part.id} style={styles.partItem}>
                <View style={styles.partLeft}>
                  <Text style={styles.partName}>{part.name}</Text>
                  <Text style={styles.partCode}>SKU: {part.code} • Unit: {part.unit}</Text>
                </View>
                <View style={styles.partRight}>
                  <Text style={styles.partStock}>{part.inStock}</Text>
                  <Text style={styles.partStockLabel}>In Stock</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ============================================================= */}
      {/* MODAL 1: CLAIM REQUEST & ASSIGN INSPECTION TIME               */}
      {/* ============================================================= */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setScheduleModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalIconCircleBlue}>
                  <Ionicons name="time" size={18} color="#006FD8" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Schedule Maintenance Time</Text>
                  <Text style={styles.modalHeaderSub}>
                    Bus {selectedRequestToSchedule?.busPlate} • Driver {selectedRequestToSchedule?.driverName}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setScheduleModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              {/* Reported Defect Summary */}
              <View style={styles.modalIssueSummaryBox}>
                <Text style={styles.modalIssueSummaryLabel}>DRIVER'S REPORTED DEFECT:</Text>
                <Text style={styles.modalIssueSummaryText}>"{selectedRequestToSchedule?.issue}"</Text>
              </View>

              {/* Quick Time Preset Buttons */}
              <Text style={styles.inputSectionLabel}>Select Maintenance Time Slot:</Text>
              <View style={styles.timePresetsGrid}>
                {[
                  'Today, 08:30 PM (Post-Trip Depot Halt)',
                  'Today, 10:30 PM (After Jaffna Return)',
                  'Tomorrow, 06:30 AM (Morning Pre-Trip)',
                  'Tomorrow, 01:00 PM (Midday Service Bay)',
                ].map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timePresetBtn,
                      scheduledTimeInput === slot && styles.timePresetBtnSelected,
                    ]}
                    onPress={() => setScheduledTimeInput(slot)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="alarm-outline"
                      size={14}
                      color={scheduledTimeInput === slot ? '#006FD8' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.timePresetBtnText,
                        scheduledTimeInput === slot && styles.timePresetBtnTextSelected,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Time Slot Input */}
              <Text style={styles.inputSectionLabel}>Or Enter Custom Schedule Time:</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="E.g. Today 09:15 PM, Bay 2"
                placeholderTextColor="#94A3B8"
                value={scheduledTimeInput}
                onChangeText={setScheduledTimeInput}
              />

              {/* Workshop Notes */}
              <Text style={styles.inputSectionLabel}>Technician Notes for Driver:</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="E.g., Park at Bay 2 after arrival, technician assigned..."
                placeholderTextColor="#94A3B8"
                value={scheduleNotesInput}
                onChangeText={setScheduleNotesInput}
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.btnConfirmModalAction}
              onPress={handleConfirmSchedule}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-done" size={17} color="#FFFFFF" />
              <Text style={styles.btnConfirmModalActionText}>
                Confirm & Send Scheduled Time to Driver
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ============================================================= */}
      {/* MODAL 2: ROADWORTHINESS CHECK & RENEW FINAL TEST DATE         */}
      {/* ============================================================= */}
      <Modal
        visible={renewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenewModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRenewModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalIconCircleGreen}>
                  <Ionicons name="shield-checkmark" size={18} color="#059669" />
                </View>
                <View>
                  <Text style={styles.modalHeaderTitle}>Renew Final Test Date</Text>
                  <Text style={styles.modalHeaderSub}>
                    Bus {selectedBusForRenew?.plate} • {selectedBusForRenew?.model}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setRenewModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              {/* Mandatory Checklist Items */}
              <Text style={styles.inputSectionLabel}>NTC 5-Point Safety & Roadworthy Inspection:</Text>
              {[
                { key: 'brakes', label: 'Dual-Air Brakes & Retarder Stopping Performance' },
                { key: 'steering', label: 'Pneumatic Air Suspension & Steering Linkage' },
                { key: 'tires', label: 'Heavy Highway Radial Tires Tread Depth (>4.5mm)' },
                { key: 'emissions', label: 'Engine Smoke Emissions, Oil & Coolant Pressure' },
                { key: 'emergency', label: 'Passenger Emergency Doors, Hammer & Fire Safety' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.modalCheckItem}
                  onPress={() =>
                    setChecklist((c) => ({ ...c, [item.key]: !c[item.key] }))
                  }
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.modalCheckbox,
                      checklist[item.key] && styles.modalCheckboxChecked,
                    ]}
                  >
                    <Text style={styles.modalCheckTick}>{checklist[item.key] ? '✓' : ''}</Text>
                  </View>
                  <Text style={styles.modalCheckItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              {/* Final Test Date to Renew */}
              <Text style={styles.inputSectionLabel}>Renewed Final Test Date (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="2026-10-31"
                placeholderTextColor="#94A3B8"
                value={newTestDateInput}
                onChangeText={setNewTestDateInput}
              />

              {/* Inspector Certification Notes */}
              <Text style={styles.inputSectionLabel}>Inspection Audit Remarks:</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Passed full NTC roadworthiness, brake test & monthly check"
                placeholderTextColor="#94A3B8"
                value={inspectionNotesInput}
                onChangeText={setInspectionNotesInput}
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.btnConfirmRenewal}
              onPress={handleConfirmRenewal}
              activeOpacity={0.85}
            >
              <Ionicons name="ribbon" size={18} color="#FFFFFF" />
              <Text style={styles.btnConfirmRenewalText}>
                ✓ Certify Roadworthy & Renew Test Date
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
          maxWidth: 540,
          width: '100%',
          alignSelf: 'center',
        }
      : {}),
  },

  // Workshop Banner
  banner: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  bannerBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  bannerSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },

  // Top Notification Alert Banner
  notificationAlertBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  bellIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
  },
  notifAlertSub: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 1,
  },
  notifAlertPill: {
    backgroundColor: '#DC2626',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  notifAlertPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // Tab Bar Scroll
  tabBarWrapper: {
    width: '100%',
    marginBottom: 14,
  },
  tabBarScroll: {
    gap: 8,
    paddingRight: 10,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#006FD8',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#006FD8',
  },
  tabBadgeRed: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tabBadgeRedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  tabBadgeAmber: {
    backgroundColor: '#D97706',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tabBadgeAmberText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // Section Header Card
  sectionHeaderCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionHeaderSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 15,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  filterChipBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterChipBtnActive: {
    backgroundColor: '#006FD8',
    borderColor: '#006FD8',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Driver Request Cards
  driverRequestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  driverRequestCardPending: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF5',
  },
  driverRequestCardScheduled: {
    borderColor: '#BFDBFE',
    backgroundColor: '#FAFCFF',
  },
  driverRequestCardCompleted: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F7FEFA',
  },
  reqTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  busPlateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  busPlateText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#006FD8',
  },
  reqModelText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  reqStatusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  reqStatusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  reqStatusBadgeScheduled: {
    backgroundColor: '#EFF6FF',
  },
  reqStatusBadgeCompleted: {
    backgroundColor: '#ECFDF5',
  },
  reqStatusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  reqStatusBadgeTextPending: {
    color: '#B45309',
  },
  reqStatusBadgeTextScheduled: {
    color: '#006FD8',
  },
  reqStatusBadgeTextCompleted: {
    color: '#059669',
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  driverInfoText: {
    fontSize: 11,
    color: '#64748B',
  },
  reqIssueBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  reqIssueLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  urgencyTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  urgencyTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  reqIssueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
    lineHeight: 17,
  },
  scheduledInfoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 10,
  },
  scheduledInfoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#006FD8',
  },
  scheduledInfoSub: {
    fontSize: 11,
    color: '#1E40AF',
    marginTop: 2,
  },
  completedInfoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 6,
  },
  completedInfoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  completedInfoSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  btnClaimRequest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  btnClaimRequestText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  actionRowScheduled: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  btnRescheduleSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  btnRescheduleSmallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006FD8',
  },
  btnInspectAndRenew: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  btnInspectAndRenewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Monthly Summary Card
  monthlySummaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  monthlySummaryTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  monthlySummaryNotice: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 16,
  },
  monthlyMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  monthlyMetricBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  monthlyMetricNum: {
    fontSize: 18,
    fontWeight: '900',
  },
  monthlyMetricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  complianceBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  complianceBarFill: {
    height: '100%',
    backgroundColor: '#059669',
  },
  fleetListHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },

  // Fleet Bus Card
  fleetBusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  fleetCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fleetBusPlate: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  fleetBusModel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  monthlyStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  monthlyStatusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  fleetRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  fleetRouteText: {
    fontSize: 11,
    color: '#64748B',
  },
  testDateBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  testDateItem: {
    flex: 1,
  },
  testDateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  testDateValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  testDateSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  certAuditNotes: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
    marginBottom: 10,
  },
  btnRenewTestDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 11,
    borderRadius: 10,
  },
  btnRenewTestDateOverdue: {
    backgroundColor: '#DC2626',
  },
  btnRenewTestDateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Job Cards & Legacy Styles
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  jobCardCompleted: {
    backgroundColor: '#F8FAFC',
    opacity: 0.85,
  },
  jobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  jobBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#006FD8',
  },
  busPlate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  busModel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  priorityPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  issueBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  issueLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  issueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  reportedBy: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  tasksHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  taskCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  taskTick: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  taskText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },

  // SOS Cards
  sosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    marginBottom: 12,
  },
  sosCardDispatched: {
    borderColor: '#93C5FD',
  },
  sosCardResolved: {
    borderColor: '#A7F3D0',
    opacity: 0.85,
  },
  sosTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sosPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  sosPlate: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  sosStatusBadge: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  sosStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  sosModel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  sosDriver: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  sosLocation: {
    fontSize: 11,
    color: '#006FD8',
    fontWeight: '600',
    marginBottom: 8,
  },
  breakdownNotice: {
    backgroundColor: '#FFF1F2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  breakdownLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#BE123C',
  },
  breakdownText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#881337',
    marginTop: 2,
  },
  btnDeployVan: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDeployVanText: {
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Diagnostics & Parts
  searchCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10,
  },
  searchRow: {
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  recordBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  recordPlate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#006FD8',
  },
  recordModel: {
    fontSize: 12,
    color: '#64748B',
  },
  recordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  recordCol: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    padding: 6,
    borderRadius: 6,
  },
  recordLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  recordVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  recordFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  recordFooterText: {
    fontSize: 10,
    color: '#64748B',
  },
  recordPermitText: {
    fontSize: 10,
    color: '#006FD8',
    fontWeight: '600',
    marginTop: 2,
  },
  noRecordText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  partsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  partLeft: {
    flex: 1,
  },
  partName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  partCode: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  partRight: {
    alignItems: 'flex-end',
  },
  partStock: {
    fontSize: 14,
    fontWeight: '800',
    color: '#006FD8',
  },
  partStockLabel: {
    fontSize: 9,
    color: '#64748B',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalIconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconCircleGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalHeaderSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  modalIssueSummaryBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  modalIssueSummaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  modalIssueSummaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
    marginTop: 2,
  },
  inputSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  timePresetsGrid: {
    gap: 6,
    marginBottom: 6,
  },
  timePresetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timePresetBtnSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#006FD8',
  },
  timePresetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  timePresetBtnTextSelected: {
    color: '#006FD8',
    fontWeight: '800',
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
  },
  btnConfirmModalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006FD8',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  btnConfirmModalActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modalCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  modalCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCheckboxChecked: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  modalCheckTick: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  modalCheckItemText: {
    fontSize: 12,
    color: '#1E293B',
    flex: 1,
    fontWeight: '600',
  },
  btnConfirmRenewal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 14,
  },
  btnConfirmRenewalText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
