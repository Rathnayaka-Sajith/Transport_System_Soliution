// Mock Database for PNG Express Staff Mobile App (iOS & Android)

export const INITIAL_STAFF_USERS = [
  {
    id: 'emp-001',
    employeeId: 'PNG-EMP-101',
    name: 'Sunil Rathnayaka',
    email: 'sunil.driver@pngexpress.lk',
    password: 'password123',
    phone: '+94 77 123 4567',
    nic: '198214502391',
    avatar: '👨‍✈️',
    // Multi-role: Sunil works as both Driver and Conductor
    roles: ['driver', 'conductor'],
    driverDetails: {
      licenseNo: 'B-9923841-DL',
      licenseExpiry: '2028-11-20',
      experienceYears: 12,
    },
    conductorDetails: {
      badgeNo: 'COND-WP-8841',
      depot: 'Pettah Central Bus Stand',
    },
    mechanicDetails: null,
  },
  {
    id: 'emp-002',
    employeeId: 'PNG-EMP-102',
    name: 'Kamal Jayawardena',
    email: 'kamal.multi@pngexpress.lk',
    password: 'password123',
    phone: '+94 71 889 2314',
    nic: '198829103940',
    avatar: '👨‍🔧',
    // Multi-role: Kamal works as both Driver and Mechanic
    roles: ['driver', 'mechanic'],
    driverDetails: {
      licenseNo: 'B-7719203-DL',
      licenseExpiry: '2027-04-15',
      experienceYears: 8,
    },
    conductorDetails: null,
    mechanicDetails: {
      specialization: 'Air Suspension & Hydraulic Brakes',
      workshop: 'Makumbura Central Fleet Depot',
    },
  },
  {
    id: 'emp-003',
    employeeId: 'PNG-EMP-103',
    name: 'Nimal Silva',
    email: 'nimal.conductor@pngexpress.lk',
    password: 'password123',
    phone: '+94 76 345 8821',
    nic: '199210293847',
    avatar: '🎫',
    // Single-role: Conductor only
    roles: ['conductor'],
    driverDetails: null,
    conductorDetails: {
      badgeNo: 'COND-WP-9920',
      depot: 'Makumbura MMC Platform',
    },
    mechanicDetails: null,
  },
  {
    id: 'emp-004',
    employeeId: 'PNG-EMP-104',
    name: 'Priyantha Bandara',
    email: 'priyantha.mechanic@pngexpress.lk',
    password: 'password123',
    phone: '+94 70 443 1928',
    nic: '198539201948',
    avatar: '🔧',
    // Single-role: Mechanic only
    roles: ['mechanic'],
    driverDetails: null,
    conductorDetails: null,
    mechanicDetails: {
      specialization: 'Dual Climate AC Systems & Electrical',
      workshop: 'Peliyagoda Central Engineering Hub',
    },
  },
  {
    id: 'emp-005',
    employeeId: 'PNG-EMP-105',
    name: 'Anura Kumara',
    email: 'anura.all@pngexpress.lk',
    password: 'password123',
    phone: '+94 77 990 1122',
    nic: '197938491029',
    avatar: '⭐',
    // Multi-role: All 3 roles!
    roles: ['driver', 'conductor', 'mechanic'],
    driverDetails: {
      licenseNo: 'B-1029384-DL',
      licenseExpiry: '2029-08-10',
      experienceYears: 15,
    },
    conductorDetails: {
      badgeNo: 'COND-WP-7710',
      depot: 'Colombo Central Fleet Depot',
    },
    mechanicDetails: {
      specialization: 'General Fleet Overhaul & Emergency Roadside Rescue',
      workshop: 'Colombo Central Fleet Depot',
    },
  },
];

export const ROLE_DEFINITIONS = [
  {
    id: 'driver',
    title: 'Bus Driver',
    icon: '🚌',
    color: '#046bd2',
    bgColor: '#eff6ff',
    badge: 'Heavy Vehicle Certified',
    description: 'Assigned coach route navigation, pre-trip safety checklist, and emergency breakdown SOS alerts.',
  },
  {
    id: 'conductor',
    title: 'Bus Conductor',
    icon: '🎫',
    color: '#10b981',
    bgColor: '#ecfdf5',
    badge: 'Ticket Operations',
    description: 'Live QR digital ticket scanning, 40-seat passenger manifest, and onboard cash booking.',
  },
  {
    id: 'mechanic',
    title: 'Fleet Mechanic',
    icon: '🔧',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    badge: 'Engineering & Maintenance',
    description: 'Roadside breakdown rescue requests, workshop maintenance job cards, and roadworthy sign-off.',
  },
];

export const MOCK_DRIVER_TRIP = {
  tripId: 'TRIP-2026-8701',
  routeNo: 'Route 87',
  routeName: 'Thambuththegama ➔ Jaffna (Via Thalawa & Anuradhapura)',
  busPlate: 'NB-4592',
  busModel: 'Scania Super Luxury Express',
  departureTime: '08:45 PM',
  arrivalTime: '02:30 AM',
  currentStop: 'Thambuththegama Station Bay',
  totalDistance: '202 km',
  duration: '5h 15m',
  stops: [
    { name: 'Thambuththegama Town', time: '08:15 PM', status: 'DEPARTED' },
    { name: 'Thalawa Bus Stand', time: '08:45 PM', status: 'UPCOMING' },
    { name: 'Anuradhapura New Town Bus Stand', time: '09:20 PM', status: 'UPCOMING' },
    { name: 'Medawachchiya Junction', time: '10:15 PM', status: 'UPCOMING' },
    { name: 'Vavuniya Highway Rest Stop', time: '11:30 PM', status: 'UPCOMING' },
    { name: 'Jaffna Central Terminal', time: '02:30 AM', status: 'UPCOMING' },
  ],
};

export const MOCK_CHECKLIST = [
  { id: 'brakes', title: 'Air & Hydraulic Brake Pressure', done: true },
  { id: 'tires', title: 'Tire Pressure & Tread Depth (All 6 wheels)', done: true },
  { id: 'lights', title: 'Headlights, Indicators & Fog Lights', done: true },
  { id: 'wipers', title: 'Windshield Wipers & Washer Fluid', done: true },
  { id: 'ac', title: 'Dual Climate AC & Blower Function', done: true },
  { id: 'emergency_door', title: 'Emergency Exit Door & Safety Hammer', done: true },
  { id: 'telematics', title: 'Live GPS Telematics Link', done: true },
  { id: 'first_aid', title: 'First Aid Kit & Fire Extinguisher', done: true },
];

export const MOCK_PASSENGERS = [
  // 1. Next Pickup Stop: Thalawa Bus Stand (2 Passengers)
  {
    ticketRef: 'PNG-BK884210',
    stopId: 'thalawa',
    name: 'Saman Kumara',
    phone: '+94 77 334 1122',
    seats: [14, 15],
    boardingPoint: 'Thalawa Bus Stand',
    destination: 'Jaffna',
    status: 'PENDING',
    boardedAt: null,
  },
  {
    ticketRef: 'PNG-BK884211',
    stopId: 'thalawa',
    name: 'Dilani Jayasinghe',
    phone: '+94 71 889 4433',
    seats: [16],
    boardingPoint: 'Thalawa Bus Stand',
    destination: 'Jaffna',
    status: 'PENDING',
    boardedAt: null,
  },
  // 2. Upcoming Stop: Anuradhapura New Town Bus Stand (2 Passengers)
  {
    ticketRef: 'PNG-BK991204',
    stopId: 'anuradhapura',
    name: 'Chaminda Senanayake',
    phone: '+94 76 554 9911',
    seats: [21, 22],
    boardingPoint: 'Anuradhapura New Town Bus Stand',
    destination: 'Jaffna',
    status: 'PENDING',
    boardedAt: null,
  },
  {
    ticketRef: 'PNG-BK991205',
    stopId: 'anuradhapura',
    name: 'Fathima Nisreen',
    phone: '+94 70 223 6677',
    seats: [25],
    boardingPoint: 'Anuradhapura New Town Bus Stand',
    destination: 'Jaffna',
    status: 'PENDING',
    boardedAt: null,
  },
  // 3. Boarded earlier at Thambuththegama
  {
    ticketRef: 'PNG-BK771092',
    stopId: 'thambuththegama',
    name: 'Kasun Bandara',
    phone: '+94 77 123 9081',
    seats: [1, 2],
    boardingPoint: 'Thambuththegama Town',
    destination: 'Jaffna',
    status: 'BOARDED',
    boardedAt: '08:10 PM',
  },
  {
    ticketRef: 'PNG-BK771093',
    stopId: 'thambuththegama',
    name: 'Mohamed Rizwan',
    phone: '+94 77 665 4433',
    seats: [12, 13],
    boardingPoint: 'Thambuththegama Town',
    destination: 'Jaffna',
    status: 'BOARDED',
    boardedAt: '08:12 PM',
  },
];

export const MOCK_JOB_CARDS = [
  {
    jobId: 'JOB-2026-081',
    busPlate: 'ND-6612',
    busModel: 'Yutong Grand Cruiser (Route 99)',
    issue: 'Dual Climate AC Compressor Low Pressure',
    priority: 'HIGH',
    reportedBy: 'Driver Kamal J. (Makumbura)',
    status: 'IN_PROGRESS',
    depot: 'Makumbura Central Depot',
    tasks: [
      { text: 'Check refrigerant pressure with manifold gauge', done: true },
      { text: 'Inspect AC serpentine belt & tensioner', done: true },
      { text: 'Vacuum leak detection test', done: false },
      { text: 'Recharge R134a refrigerant to 1.8 kg', done: false },
    ],
  },
  {
    jobId: 'JOB-2026-082',
    busPlate: 'NC-3190',
    busModel: 'Ashok Leyland Semi-Luxury (Route 17)',
    issue: 'Front Axle Brake Pad Wear Indicator Alert',
    priority: 'MEDIUM',
    reportedBy: 'Driver Sunil R. (Panadura)',
    status: 'PENDING',
    depot: 'Panadura Depot Workshop',
    tasks: [
      { text: 'Remove front road wheels & drums', done: false },
      { text: 'Measure brake lining thickness', done: false },
      { text: 'Install genuine replacement brake shoes', done: false },
      { text: 'Road safety test & decelerometer measurement', done: false },
    ],
  },
  {
    jobId: 'JOB-2026-080',
    busPlate: 'NB-4592',
    busModel: 'King Long Luxury (Route 87)',
    issue: 'Scheduled 15,000 km Lubrication & Diagnostic Service',
    priority: 'LOW',
    reportedBy: 'Routine Fleet Scheduler',
    status: 'COMPLETED',
    depot: 'Pettah Fleet Workshop',
    tasks: [
      { text: 'Drain engine oil & replace heavy-duty oil filter', done: true },
      { text: 'Inspect transmission fluid level', done: true },
      { text: 'Grease propeller shaft universal joints', done: true },
      { text: 'Sign off digital roadworthy certificate', done: true },
    ],
  },
];

// Active Emergency Breakdown Calls for Fleet Mechanics
export const MOCK_EMERGENCY_RESCUES = [
  {
    rescueId: 'SOS-2026-901',
    busPlate: 'NA-8819',
    route: 'Route 04 (Colombo ➔ Mannar)',
    location: 'A3 Highway near Puttalam Wind Farm (Km 128)',
    issueDescription: 'Coolant hose burst, radiator overheating & high temperature warning',
    driverName: 'Ranjith Perera (+94 77 881 2930)',
    passengersOnboard: 39,
    status: 'DISPATCHED', // 'OPEN' | 'DISPATCHED' | 'RESOLVED'
    priority: 'CRITICAL',
    timeReported: '12 mins ago',
    assignedVan: 'Mobile Rescue Van #02 (Makumbura)',
    etaMinutes: 18,
  },
  {
    rescueId: 'SOS-2026-902',
    busPlate: 'ND-2041',
    route: 'Route 48 (Colombo ➔ Polonnaruwa)',
    location: 'Habarana Junction Overpass',
    issueDescription: 'Rear right outer dual tire puncture, air suspension pressure warning',
    driverName: 'Saman Jayasuriya (+94 71 332 9911)',
    passengersOnboard: 41,
    status: 'OPEN',
    priority: 'HIGH',
    timeReported: '4 mins ago',
    assignedVan: null,
    etaMinutes: null,
  },
];

// Spare Parts & Consumables Inventory for Mechanic Workshop
export const MOCK_PARTS_INVENTORY = [
  { id: 'part-01', code: 'BP-KL-40', name: 'King Long Heavy Ceramic Front Brake Pads', inStock: 14, minLevel: 6, unit: 'Sets', status: 'OK' },
  { id: 'part-02', code: 'AC-BELT-88', name: 'Dual Compressor Serpentine Drive Belt 8PK-1850', inStock: 3, minLevel: 5, unit: 'Pieces', status: 'LOW' },
  { id: 'part-03', code: 'OIL-15W40', name: 'Shell Rimula R4 X 15W-40 Heavy Diesel Oil', inStock: 480, minLevel: 200, unit: 'Litres', status: 'OK' },
  { id: 'part-04', code: 'AIR-FIL-YT', name: 'Yutong Grand Cruiser Cylindrical Air Filter', inStock: 2, minLevel: 4, unit: 'Pieces', status: 'LOW' },
  { id: 'part-05', code: 'TUBE-295-80', name: 'Tubeless Radial Highway Tire 295/80 R22.5', inStock: 8, minLevel: 4, unit: 'Tires', status: 'OK' },
  { id: 'part-06', code: 'RAD-CAP-13', name: 'Pressurized Heavy Radiator Cap 1.3 Bar', inStock: 0, minLevel: 3, unit: 'Pieces', status: 'OUT_OF_STOCK' },
];

// Bus Fleet Diagnostic Health Lookup Records
export const MOCK_FLEET_RECORDS = {
  'NB-4592': {
    plate: 'NB-4592',
    model: 'King Long XMQ6127 Super Luxury',
    year: 2023,
    engineHours: 4210,
    odometerKm: '184,290 km',
    lastServiceDate: '2026-10-18',
    nextServiceDueKm: '195,000 km',
    frontTireTread: '8.4 mm (Good)',
    rearTireTread: '7.9 mm (Good)',
    brakeLiningPct: '82%',
    batteryHealth: '12.8V (Healthy)',
    activePermitNo: 'NTC-EXP-WP-2026-4412',
    safetyRating: 'Grade A+ (Expressway Approved)',
  },
  'ND-6612': {
    plate: 'ND-6612',
    model: 'Yutong ZK6122HD Luxury Cruiser',
    year: 2022,
    engineHours: 6150,
    odometerKm: '262,400 km',
    lastServiceDate: '2026-10-02',
    nextServiceDueKm: '270,000 km',
    frontTireTread: '5.1 mm (Fair)',
    rearTireTread: '5.8 mm (Fair)',
    brakeLiningPct: '54%',
    batteryHealth: '12.4V (Moderate)',
    activePermitNo: 'NTC-EXP-WP-2026-1904',
    safetyRating: 'Grade B+ (Requires Service)',
  },
  'NA-8819': {
    plate: 'NA-8819',
    model: 'Higer KLQ6129 Luxury Express',
    year: 2021,
    engineHours: 7800,
    odometerKm: '318,120 km',
    lastServiceDate: '2026-09-14',
    nextServiceDueKm: '325,000 km',
    frontTireTread: '6.2 mm (Fair)',
    rearTireTread: '6.0 mm (Fair)',
    brakeLiningPct: '68%',
    batteryHealth: '12.6V (Healthy)',
    activePermitNo: 'NTC-EXP-WP-2026-0881',
    safetyRating: 'Grade A (Operational)',
  },
};

// Baggage Cargo Records for Conductor
export const MOCK_LUGGAGE_REGISTRY = [
  { tagNo: 'LUG-8801', seatNo: 1, passengerName: 'Kasun Bandara', pieces: 2, compartment: 'Side Bay A (Left)', weightKg: '28 kg' },
  { tagNo: 'LUG-8802', seatNo: 12, passengerName: 'Mohamed Rizwan', pieces: 3, compartment: 'Side Bay B (Right)', weightKg: '42 kg' },
  { tagNo: 'LUG-8803', seatNo: 5, passengerName: 'Sithara Fernando', pieces: 1, compartment: 'Side Bay A (Left)', weightKg: '14 kg' },
];
