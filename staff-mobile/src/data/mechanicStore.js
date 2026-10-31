// Reactive Mechanic & Fleet Maintenance Store
// Synchronizes Driver Defect Reports, Mechanic Scheduling, and Monthly Fleet Inspections

const INITIAL_FLEET = [
  {
    plate: 'NB-4592',
    model: 'Scania Touring HD Luxury',
    year: 2023,
    depot: 'Thambuththegama Central Depot',
    assignedRoute: 'Route 87 (Thambuththegama ➔ Jaffna)',
    latestTestDate: '2026-10-28',
    inspectionCertNo: 'NTC-CERT-2026-8812',
    inspectorName: 'Sunil Perera (Lead Mechanic)',
    inspectionNotes: 'Passed NTC Roadworthiness, Dual-Air Brakes & Safety Audit',
    status: 'OPERATIONAL', // 'OPERATIONAL' | 'IN_SERVICE' | 'INSPECTION_DUE'
  },
  {
    plate: 'ND-6612',
    model: 'Yutong Grand Cruiser',
    year: 2022,
    depot: 'Makumbura Central Depot',
    assignedRoute: 'Route 99 (Colombo ➔ Badulla)',
    latestTestDate: '2026-10-02',
    inspectionCertNo: 'NTC-CERT-2026-6640',
    inspectorName: 'Kamal Jayasinghe',
    inspectionNotes: 'Passed brake test. 30-day monthly inspection due soon.',
    status: 'IN_SERVICE',
  },
  {
    plate: 'NA-8819',
    model: 'Higer Luxury Express',
    year: 2021,
    depot: 'Kandy Central Depot',
    assignedRoute: 'Route 01 (Colombo ➔ Kandy)',
    latestTestDate: '2026-09-24',
    inspectionCertNo: 'NTC-CERT-2026-4419',
    inspectorName: 'Dhammika Bandara',
    inspectionNotes: 'Overdue for monthly mandatory 30-day safety check.',
    status: 'INSPECTION_DUE',
  },
  {
    plate: 'NC-7730',
    model: 'King Long XMQ6127 Super Luxury',
    year: 2023,
    depot: 'Galle Super Depot',
    assignedRoute: 'Route EX-1 (Makumbura ➔ Galle)',
    latestTestDate: '2026-10-15',
    inspectionCertNo: 'NTC-CERT-2026-7731',
    inspectorName: 'Sunil Perera (Lead Mechanic)',
    inspectionNotes: 'Passed 40-point pneumatic suspension & emergency brake check.',
    status: 'OPERATIONAL',
  },
  {
    plate: 'WP-CAD-4410',
    model: 'Volvo B11R 9400 Luxury',
    year: 2024,
    depot: 'Colombo Bastian Mawatha',
    assignedRoute: 'Route 87 (Colombo ➔ Jaffna)',
    latestTestDate: '2026-10-22',
    inspectionCertNo: 'NTC-CERT-2026-4410',
    inspectorName: 'Kusal Mendis',
    inspectionNotes: 'Passed full computerized diagnostics & emissions test.',
    status: 'OPERATIONAL',
  },
  {
    plate: 'WP-NB-5521',
    model: 'Scania Metrolink HD',
    year: 2022,
    depot: 'Matara Expressway Terminal',
    assignedRoute: 'Route EX-2 (Kadawatha ➔ Matara)',
    latestTestDate: '2026-09-28',
    inspectionCertNo: 'NTC-CERT-2026-5521',
    inspectorName: 'Sunil Perera (Lead Mechanic)',
    inspectionNotes: 'Overdue for monthly 30-day chassis check.',
    status: 'INSPECTION_DUE',
  },
];

const INITIAL_REQUESTS = [
  {
    id: 'REQ-2026-101',
    busPlate: 'ND-6612',
    driverName: 'Kamal Jayawardena',
    driverPhone: '+94 77 234 5678',
    reportedAt: '31 Oct 2026, 09:15 AM',
    issue: 'Dual Climate AC Compressor Low Pressure, weak cooling in rear cabin',
    urgency: 'HIGH', // 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    status: 'SCHEDULED', // 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
    assignedMechanic: 'Sunil Perera (Lead Mechanic)',
    scheduledTime: 'Today, 08:30 PM (Post-Trip)',
    mechanicNotes: 'Reserved Bay 2. Manifold pressure gauge and R134a refrigerant prepared.',
    completedAt: null,
  },
  {
    id: 'REQ-2026-102',
    busPlate: 'NA-8819',
    driverName: 'Sampath Wickramasinghe',
    driverPhone: '+94 71 889 2244',
    reportedAt: '31 Oct 2026, 11:40 AM',
    issue: 'Slight steering vibration when braking from 70 km/h on expressway',
    urgency: 'MEDIUM',
    status: 'PENDING',
    assignedMechanic: null,
    scheduledTime: null,
    mechanicNotes: '',
    completedAt: null,
  },
];

let state = {
  fleet: INITIAL_FLEET,
  requests: INITIAL_REQUESTS,
  notificationsCount: 1, // 1 unread pending request
};

const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener({ ...state });
    } catch (e) {
      console.warn('Listener error:', e);
    }
  });
};

// Helper: Calculate days between test date and reference date (default 31 Oct 2026)
export const calculateDaysSinceTest = (testDateStr, referenceDate = new Date('2026-10-31T10:00:00')) => {
  if (!testDateStr) return 999;
  const testDate = new Date(testDateStr);
  const diffMs = referenceDate.getTime() - testDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

// Helper: Calculate monthly inspection status (Must be checked once every 30 days)
export const getMonthlyInspectionStatus = (testDateStr, referenceDate = new Date('2026-10-31T10:00:00')) => {
  const daysAgo = calculateDaysSinceTest(testDateStr, referenceDate);
  if (daysAgo <= 24) {
    return {
      status: 'VALID',
      label: 'Inspected this month',
      color: '#059669',
      badgeBg: '#F0FDF4',
      badgeBorder: '#BBF7D0',
      daysAgo,
      daysRemaining: 30 - daysAgo,
    };
  }
  if (daysAgo <= 30) {
    return {
      status: 'DUE_SOON',
      label: `Due in ${30 - daysAgo} days`,
      color: '#D97706',
      badgeBg: '#FFFBEB',
      badgeBorder: '#FDE68A',
      daysAgo,
      daysRemaining: 30 - daysAgo,
    };
  }
  return {
    status: 'OVERDUE',
    label: `Overdue by ${daysAgo - 30} days`,
    color: '#DC2626',
    badgeBg: '#FEF2F2',
    badgeBorder: '#FECACA',
    daysAgo,
    daysRemaining: 0,
  };
};

export const mechanicStore = {
  getState() {
    return { ...state };
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // 1. Driver creates an issue request for their bus
  submitDriverIssue({ busPlate, driverName, driverPhone, issue, urgency = 'MEDIUM' }) {
    const newId = `REQ-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newRequest = {
      id: newId,
      busPlate: busPlate || 'NB-4592',
      driverName: driverName || 'Assigned Driver',
      driverPhone: driverPhone || '+94 77 123 4567',
      reportedAt: nowStr,
      issue: (issue || '').trim(),
      urgency,
      status: 'PENDING',
      assignedMechanic: null,
      scheduledTime: null,
      mechanicNotes: '',
      completedAt: null,
    };

    state.requests = [newRequest, ...state.requests];
    state.notificationsCount += 1;
    notifyListeners();
    return newRequest;
  },

  // 2. Mechanic claims request and sets an inspection time
  scheduleInspection(requestId, { mechanicName, scheduledTime, notes = '' }) {
    state.requests = state.requests.map((req) => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'SCHEDULED',
          assignedMechanic: mechanicName || 'Workshop Mechanic',
          scheduledTime: scheduledTime || 'Today, 09:00 PM (Post-Trip)',
          mechanicNotes: notes,
        };
      }
      return req;
    });

    if (state.notificationsCount > 0) {
      state.notificationsCount -= 1;
    }

    notifyListeners();
  },

  // 3. Mechanic completes inspection & renews the final test date of that vehicle
  completeInspectionAndRenewDate(requestId, { busPlate, mechanicName, newTestDate, inspectionNotes }) {
    const dateToSet = newTestDate || '2026-10-31';
    const inspector = mechanicName || 'Sunil Perera (Lead Mechanic)';
    const notes = inspectionNotes || 'Passed full roadworthiness, brake test & monthly safety check';
    const newCertNo = `NTC-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update fleet vehicle record
    state.fleet = state.fleet.map((bus) => {
      if (bus.plate === busPlate) {
        return {
          ...bus,
          latestTestDate: dateToSet,
          inspectionCertNo: newCertNo,
          inspectorName: inspector,
          inspectionNotes: notes,
          status: 'OPERATIONAL',
        };
      }
      return bus;
    });

    // Mark request as completed if associated with a request
    if (requestId) {
      const nowStr = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      state.requests = state.requests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'COMPLETED',
            assignedMechanic: inspector,
            completedAt: nowStr,
            mechanicNotes: `${req.mechanicNotes ? req.mechanicNotes + '\n' : ''}Inspection passed. Final test date renewed to ${dateToSet}.`,
          };
        }
        return req;
      });
    }

    notifyListeners();
  },

  // 4. Monthly direct inspection renewal for any fleet vehicle
  renewVehicleMonthlyInspection(busPlate, { mechanicName, newTestDate, inspectionNotes }) {
    this.completeInspectionAndRenewDate(null, {
      busPlate,
      mechanicName,
      newTestDate,
      inspectionNotes,
    });
  },

  // Get single vehicle details
  getBusRecord(plate) {
    return state.fleet.find((b) => b.plate === plate) || state.fleet[0];
  },
};
