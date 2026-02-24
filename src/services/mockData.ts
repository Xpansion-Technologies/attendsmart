export const INITIAL_STUDENTS = [
  { id: 1, name: 'Rahul Sharma', class: '5A', guardian: 'Parent One', bus: 'BUS-101', nfc: 'RCWXIQBDGE' },
  { id: 2, name: 'Mohan Shukla', class: '1A', guardian: 'Parent One', bus: 'BUS-101', nfc: 'DPTRYN5VL3' },
  { id: 3, name: 'Student 2', class: '1A', guardian: 'Parent Two', bus: 'BUS-101', nfc: 'WAL5CIGDQO' },
  { id: 4, name: 'Student 3', class: '1A', guardian: 'Parent Three', bus: 'BUS-101', nfc: '5CQYZLDAGN' },
  { id: 5, name: 'Student 4', class: '1A', guardian: 'Parent Four', bus: 'BUS-101', nfc: 'PRDSTSCDLP' },
  { id: 6, name: 'Student 5', class: '1A', guardian: 'Parent Five', bus: 'BUS-101', nfc: 'AJSG9YYTBQ' },
];

export const INITIAL_BUSES = [
  { id: 1, busNumber: 'BUS-101', shift: 'Morning', driver: 'Sanjay Kumar', route: 'Sector 15 - Sector 62' },
  { id: 2, busNumber: 'BUS-102', shift: 'Morning', driver: 'Amit Singh', route: 'Indirapuram - Vaishali' },
  { id: 3, busNumber: 'BUS-103', shift: 'Evening', driver: 'Ramesh Pal', route: 'Noida City Center - Crossing Republik' },
  { id: 4, busNumber: 'BUS-104', shift: 'Morning', driver: 'Vijay Tyagi', route: 'Greater Noida West - Pari Chowk' },
  { id: 5, busNumber: 'BUS-105', shift: 'Afternoon', driver: 'Rajesh Sharma', route: 'Delhi Border - Noida Expressway' },
];

export const INITIAL_PARENTS = [
  { id: 1, name: 'Parent One', email: 'parent1@example.com', phone: '+91 98123 45678', address: 'B-12, Sector 15, Noida' },
  { id: 2, name: 'Parent Two', email: 'parent2@example.com', phone: '+91 98123 45679', address: 'C-45, Indirapuram, Ghaziabad' },
  { id: 3, name: 'Parent Three', email: 'parent3@example.com', phone: '+91 98123 45680', address: 'Flat 201, Green View Apartments, Sector 62' },
  { id: 4, name: 'Parent Four', email: 'parent4@example.com', phone: '+91 98123 45681', address: 'D-89, Crossing Republik, Ghaziabad' },
  { id: 5, name: 'Parent Five', email: 'parent5@example.com', phone: '+91 98123 45682', address: 'House 12, Alpha 1, Greater Noida' },
];

export const INITIAL_DRIVERS = [
  { id: 1, name: 'Sanjay Kumar', username: 'sanjay.k', password: 'password123', phone: '+91 98765 43210' },
  { id: 2, name: 'Amit Singh', username: 'amit.s', password: 'password123', phone: '+91 98765 43211' },
  { id: 3, name: 'Ramesh Pal', username: 'ramesh.p', password: 'password123', phone: '+91 98765 43212' },
  { id: 4, name: 'Vijay Tyagi', username: 'vijay.t', password: 'password123', phone: '+91 98765 43213' },
  { id: 5, name: 'Rajesh Sharma', username: 'rajesh.s', password: 'password123', phone: '+91 98765 43214' },
];

export const INITIAL_TRIPS = [
  { 
    id: 1, 
    firstStop: 'Sector 15', 
    lastStop: 'Sector 62', 
    buses: ['BUS-101', 'BUS-102'],
    stops: ['Sector 15', 'Noida City Center', 'Sector 62'],
    students: ['Rahul Sharma', 'Mohan Shukla', 'Student 2'],
  },
  { 
    id: 2, 
    firstStop: 'Indirapuram', 
    lastStop: 'Vaishali', 
    buses: ['BUS-102'],
    stops: ['Indirapuram', 'Shipra Sun City', 'Vaishali'],
    students: ['Student 3', 'Student 4'],
  },
];
