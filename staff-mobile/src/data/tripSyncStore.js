// Shared Trip State & Real-time Synchronization Store between Driver and Conductor
import { Platform } from 'react-native';

const INITIAL_SHARED_STOPS = [
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
    status: 'UPCOMING',
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
    id: 'kilinochchi',
    name: 'Kilinochchi Central Halt',
    type: 'HALT',
    lat: 9.3803,
    lng: 80.3990,
    time: '01:45 AM',
    status: 'UPCOMING',
    color: '#06B6D4',
  },
  {
    id: 'jaffna',
    name: 'Jaffna Central Terminal',
    type: 'DESTINATION',
    lat: 9.6615,
    lng: 80.0255,
    time: '03:30 AM',
    status: 'UPCOMING',
    color: '#10B981',
  },
];

const INITIAL_SHARED_PASSENGERS = [
  // 1. Next Pickup Stop: Thalawa Bus Stand
  {
    ticketRef: 'PNG-BK884210',
    stopId: 'thalawa',
    name: 'Saman Kumara',
    phone: '077 334 1122',
    seats: [14, 15],
    boardingPoint: 'Thalawa Bus Stand',
    destination: 'Jaffna',
    fareRs: 4800,
    paymentStatus: 'PAID', // 'PAID' | 'PENDING'
    status: 'PENDING', // 'PENDING' | 'BOARDED' | 'MISSED'
    boardedAt: null,
    checkedInBy: null,
  },
  {
    ticketRef: 'PNG-BK884211',
    stopId: 'thalawa',
    name: 'Dilani Jayasinghe',
    phone: '071 889 4433',
    seats: [16],
    boardingPoint: 'Thalawa Bus Stand',
    destination: 'Jaffna',
    fareRs: 2400,
    paymentStatus: 'PAID',
    status: 'PENDING',
    boardedAt: null,
    checkedInBy: null,
  },
  // 2. Upcoming Stop: Anuradhapura New Town Bus Stand
  {
    ticketRef: 'PNG-BK991204',
    stopId: 'anuradhapura',
    name: 'Chaminda Senanayake',
    phone: '076 554 9911',
    seats: [21, 22],
    boardingPoint: 'Anuradhapura New Town Bus Stand',
    destination: 'Jaffna',
    fareRs: 4800,
    paymentStatus: 'PAID',
    status: 'PENDING',
    boardedAt: null,
    checkedInBy: null,
  },
  {
    ticketRef: 'PNG-BK991205',
    stopId: 'anuradhapura',
    name: 'Fathima Nisreen',
    phone: '070 223 6677',
    seats: [25],
    boardingPoint: 'Anuradhapura New Town Bus Stand',
    destination: 'Jaffna',
    fareRs: 2400,
    paymentStatus: 'PAID',
    status: 'PENDING',
    boardedAt: null,
    checkedInBy: null,
  },
  // 3. Already Boarded at Thambuththegama
  {
    ticketRef: 'PNG-BK771092',
    stopId: 'thambuththegama',
    name: 'Kasun Bandara',
    phone: '077 123 9081',
    seats: [1, 2],
    boardingPoint: 'Thambuththegama Town',
    destination: 'Jaffna',
    fareRs: 4800,
    paymentStatus: 'PAID',
    status: 'BOARDED',
    boardedAt: '08:10 PM',
    checkedInBy: 'Driver Sunil',
  },
  {
    ticketRef: 'PNG-BK771093',
    stopId: 'thambuththegama',
    name: 'Mohamed Rizwan',
    phone: '077 665 4433',
    seats: [12, 13],
    boardingPoint: 'Thambuththegama Town',
    destination: 'Jaffna',
    fareRs: 4800,
    paymentStatus: 'PAID',
    status: 'BOARDED',
    boardedAt: '08:12 PM',
    checkedInBy: 'Conductor Nimal',
  },
];

const STORAGE_KEY = 'PNG_EXPRESS_TRIP_SYNC_V1';

// Initial state: trip is already started by driver as requested
let state = {
  isTripStarted: true,
  busPlate: 'NB-4592',
  routeNo: '87',
  routeName: 'Route 87: Thambuththegama ➔ Jaffna',
  stops: INITIAL_SHARED_STOPS,
  passengers: INITIAL_SHARED_PASSENGERS,
  activeStopId: 'thalawa',
  isWithin50m: true, // Default to true so 50m proximity triggers automatic popup
  lastUpdated: Date.now(),
};

// Try to hydrate from local storage if on web
if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    }
  } catch (e) {
    // Ignore storage parse errors
  }
}

const listeners = new Set();

const notifyListeners = () => {
  state.lastUpdated = Date.now();
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch (e) {}
  });
};

// Cross-tab synchronization for web browsers
if (Platform.OS === 'web' && typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        state = JSON.parse(event.newValue);
        listeners.forEach((listener) => listener(state));
      } catch (e) {}
    }
  });
}

export const tripSyncStore = {
  getState() {
    return state;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setTripStarted(started = true) {
    state.isTripStarted = started;
    notifyListeners();
  },

  setWithin50m(within = true) {
    state.isWithin50m = within;
    notifyListeners();
  },

  checkInPassenger(ticketRef, checkedInBy = 'Staff') {
    const timeNow = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    state.passengers = state.passengers.map((p) => {
      if (p.ticketRef.toUpperCase() === ticketRef.toUpperCase()) {
        const nextStatus = p.status === 'BOARDED' ? 'PENDING' : 'BOARDED';
        return {
          ...p,
          status: nextStatus,
          boardedAt: nextStatus === 'BOARDED' ? timeNow : null,
          checkedInBy: nextStatus === 'BOARDED' ? checkedInBy : null,
        };
      }
      return p;
    });

    notifyListeners();
  },

  markPassengerBoardedDirect(ticketRef, checkedInBy = 'Conductor') {
    const timeNow = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    state.passengers = state.passengers.map((p) => {
      if (p.ticketRef.toUpperCase() === ticketRef.toUpperCase()) {
        return {
          ...p,
          status: 'BOARDED',
          boardedAt: timeNow,
          checkedInBy,
        };
      }
      return p;
    });

    notifyListeners();
  },

  departStop(stopId) {
    state.passengers = state.passengers.map((p) => {
      if (p.stopId === stopId && p.status === 'PENDING') {
        return {
          ...p,
          status: 'MISSED',
        };
      }
      return p;
    });

    let foundCurrent = false;
    let nextActiveId = null;

    state.stops = state.stops.map((stop) => {
      if (stop.id === stopId) {
        foundCurrent = true;
        return { ...stop, status: 'PASSED' };
      }
      if (foundCurrent && !nextActiveId && stop.type !== 'DESTINATION') {
        nextActiveId = stop.id;
        return { ...stop, status: 'ACTIVE' };
      }
      return stop;
    });

    if (nextActiveId) {
      state.activeStopId = nextActiveId;
    } else {
      state.activeStopId = 'jaffna';
    }

    notifyListeners();
  },

  resetTrip() {
    state.stops = INITIAL_SHARED_STOPS;
    state.passengers = INITIAL_SHARED_PASSENGERS;
    state.activeStopId = 'thalawa';
    state.isWithin50m = true;
    notifyListeners();
  },
};
