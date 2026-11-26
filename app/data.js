// Willow House — seed data for the Alvarez household, November 2026.
// One job: the facts. Every figure the site shows is computed from this file,
// so the dashboard, budgets, bills, goals and reports can never disagree.
export const HOUSEHOLD = {
  name: 'Willow House',
  family: 'The Alvarez family',
  members: ['Maya', 'Dan', 'Sofia', 'Leo'],
  month: '2026-11',
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1d4a38' },
  { id: 'groceries', label: 'Groceries', color: '#4d9e57' },
  { id: 'utilities', label: 'Utilities', color: '#3f7fb5' },
  { id: 'transport', label: 'Transport', color: '#d99a2b' },
  { id: 'dining', label: 'Dining Out', color: '#d96c3f' },
  { id: 'kids', label: 'Kids & School', color: '#8a6fc0' },
  { id: 'fun', label: 'Fun & Streaming', color: '#e06a9a' },
  { id: 'health', label: 'Health', color: '#2fa39a' },
  { id: 'clothing', label: 'Clothing', color: '#7a6a58' },
  { id: 'home', label: 'Home & Garden', color: '#7fae3f' },
  { id: 'unbudgeted', label: 'Unbudgeted', color: '#9aa39d' },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[10];

// Monthly envelope assignments for November 2026. `rollover` carries last
// month's leftover into this month's envelope.
export const ENVELOPES = [
  { category: 'housing', assigned: 1850, rollover: 0 },
  { category: 'groceries', assigned: 720, rollover: 42 },
  { category: 'utilities', assigned: 310, rollover: 0 },
  { category: 'transport', assigned: 310, rollover: 18 },
  { category: 'dining', assigned: 220, rollover: 0 },
  { category: 'kids', assigned: 280, rollover: 35 },
  { category: 'fun', assigned: 120, rollover: 0 },
  { category: 'health', assigned: 150, rollover: 12 },
  { category: 'clothing', assigned: 110, rollover: 0 },
  { category: 'home', assigned: 130, rollover: 0 },
];

// Recurring bills. `paid` is the November state; Pay flips it.
export const BILLS = [
  { id: 'b-rent', name: 'Willow House rent', amount: 1850, due: '2026-11-01', autopay: true, paid: true, category: 'housing' },
  { id: 'b-electric', name: 'City Power — electricity', amount: 128, due: '2026-11-08', autopay: true, paid: true, category: 'utilities' },
  { id: 'b-water', name: 'City Water', amount: 46, due: '2026-11-12', autopay: true, paid: true, category: 'utilities' },
  { id: 'b-internet', name: 'NorthNet internet', amount: 65, due: '2026-11-10', autopay: true, paid: true, category: 'utilities' },
  { id: 'b-phone', name: 'Mobile plan — 2 lines', amount: 58, due: '2026-11-15', autopay: true, paid: true, category: 'utilities' },
  { id: 'b-stream', name: 'Stream bundle (2 services)', amount: 32, due: '2026-11-18', autopay: true, paid: true, category: 'fun' },
  { id: 'b-gym', name: 'Riverside Gym — family', amount: 54, due: '2026-11-20', autopay: false, paid: true, category: 'health' },
  { id: 'b-piano', name: 'Piano lessons — Sofia', amount: 95, due: '2026-11-22', autopay: false, paid: true, category: 'kids' },
  { id: 'b-insurance', name: 'Home insurance', amount: 186, due: '2026-11-28', autopay: false, paid: false, category: 'housing' },
  { id: 'b-sofa-fund', name: 'Sofa savings transfer', amount: 100, due: '2026-11-29', autopay: true, paid: false, category: 'home' },
];

// Savings goals. `saved` is the balance on 26 Nov 2026.
export const GOALS = [
  { id: 'g-emergency', name: 'Emergency fund', target: 12000, saved: 8450, monthly: 300, note: 'Six months of essentials, for peace of mind.' },
  { id: 'g-holiday', name: 'Summer holiday', target: 3200, saved: 1875, monthly: 150, note: 'Two weeks by the lake next July.' },
  { id: 'g-sofa', name: 'New sofa', target: 1400, saved: 620, monthly: 100, note: 'The old one has survived two kids and one dog.' },
  { id: 'g-college', name: 'College fund', target: 25000, saved: 6300, monthly: 150, note: 'A little every month beats a lot later.' },
];

// Past months, for the trend chart on Reports. November matches the ledger.
export const HISTORY = [
  { month: '2026-06', label: 'Jun', income: 6800, spent: 4120 },
  { month: '2026-07', label: 'Jul', income: 6850, spent: 3980 },
  { month: '2026-08', label: 'Aug', income: 6850, spent: 4310 },
  { month: '2026-09', label: 'Sep', income: 6900, spent: 3890 },
  { month: '2026-10', label: 'Oct', income: 6850, spent: 4055 },
  { month: '2026-11', label: 'Nov', income: 6850, spent: 3951.43 },
];

// The November ledger. Amounts are signed: income positive, spending negative.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', merchant: 'Maya — monthly pay', category: 'unbudgeted', member: 'Maya', amount: 3900, kind: 'income', note: 'Salary, after tax' },
  { id: 't02', date: '2026-11-01', merchant: 'Willow House rent', category: 'housing', member: 'Household', amount: -1850, kind: 'expense', note: 'Monthly rent' },
  { id: 't03', date: '2026-11-02', merchant: 'GreenMart', category: 'groceries', member: 'Maya', amount: -142.3, kind: 'expense', note: 'Weekly shop' },
  { id: 't04', date: '2026-11-03', merchant: 'Nonna’s Pizza', category: 'dining', member: 'Household', amount: -38.5, kind: 'expense', note: 'Friday pizza night' },
  { id: 't05', date: '2026-11-04', merchant: 'FuelStop', category: 'transport', member: 'Dan', amount: -58.2, kind: 'expense', note: 'Petrol' },
  { id: 't06', date: '2026-11-05', merchant: 'City Power', category: 'utilities', member: 'Household', amount: -128, kind: 'expense', note: 'Electricity bill' },
  { id: 't07', date: '2026-11-06', merchant: 'GreenMart', category: 'groceries', member: 'Dan', amount: -86.4, kind: 'expense', note: 'Top-up shop' },
  { id: 't08', date: '2026-11-06', merchant: 'Paper & Pens', category: 'kids', member: 'Sofia', amount: -48.25, kind: 'expense', note: 'School supplies' },
  { id: 't09', date: '2026-11-07', merchant: 'Taco Truck', category: 'dining', member: 'Dan', amount: -24, kind: 'expense', note: 'Lunch with Leo' },
  { id: 't10', date: '2026-11-07', merchant: 'Stream bundle', category: 'fun', member: 'Household', amount: -32, kind: 'expense', note: 'Two services' },
  { id: 't11', date: '2026-11-08', merchant: 'City Water', category: 'utilities', member: 'Household', amount: -46, kind: 'expense', note: 'Water bill' },
  { id: 't12', date: '2026-11-09', merchant: 'GreenMart', category: 'groceries', member: 'Maya', amount: -118.75, kind: 'expense', note: 'Weekly shop' },
  { id: 't13', date: '2026-11-09', merchant: 'Corner Pharmacy', category: 'health', member: 'Household', amount: -42.8, kind: 'expense', note: 'Prescriptions' },
  { id: 't14', date: '2026-11-10', merchant: 'NorthNet', category: 'utilities', member: 'Household', amount: -65, kind: 'expense', note: 'Internet bill' },
  { id: 't15', date: '2026-11-10', merchant: 'FuelStop', category: 'transport', member: 'Maya', amount: -61.4, kind: 'expense', note: 'Petrol' },
  { id: 't16', date: '2026-11-11', merchant: 'Sakura Sushi', category: 'dining', member: 'Maya', amount: -52.75, kind: 'expense', note: 'Dinner with Dan' },
  { id: 't17', date: '2026-11-11', merchant: 'FixIt Hardware', category: 'home', member: 'Dan', amount: -34.6, kind: 'expense', note: 'Bulbs and tools' },
  { id: 't18', date: '2026-11-12', merchant: 'City Transit', category: 'transport', member: 'Leo', amount: -42, kind: 'expense', note: 'Monthly pass' },
  { id: 't19', date: '2026-11-12', merchant: 'Piano lessons', category: 'kids', member: 'Sofia', amount: -95, kind: 'expense', note: 'November lessons' },
  { id: 't20', date: '2026-11-13', merchant: 'GreenMart', category: 'groceries', member: 'Maya', amount: -64.2, kind: 'expense', note: 'Top-up shop' },
  { id: 't21', date: '2026-11-13', merchant: 'Cinema Rex', category: 'fun', member: 'Household', amount: -28.5, kind: 'expense', note: 'Family movie night' },
  { id: 't22', date: '2026-11-14', merchant: 'Corner Bakery', category: 'dining', member: 'Household', amount: -18.9, kind: 'expense', note: 'Coffee and pastries' },
  { id: 't23', date: '2026-11-14', merchant: 'Shoe Barn', category: 'clothing', member: 'Dan', amount: -58, kind: 'expense', note: 'Work shoes' },
  { id: 't24', date: '2026-11-15', merchant: 'Dan — monthly pay', category: 'unbudgeted', member: 'Dan', amount: 2950, kind: 'income', note: 'Salary, after tax' },
  { id: 't25', date: '2026-11-15', merchant: 'NorthTel Mobile', category: 'utilities', member: 'Household', amount: -58, kind: 'expense', note: 'Two lines' },
  { id: 't26', date: '2026-11-15', merchant: 'Gift shop — Ana', category: 'unbudgeted', member: 'Maya', amount: -45, kind: 'expense', note: 'Birthday gift' },
  { id: 't27', date: '2026-11-16', merchant: 'GreenMart', category: 'groceries', member: 'Dan', amount: -98.55, kind: 'expense', note: 'Weekly shop' },
  { id: 't28', date: '2026-11-16', merchant: 'BrightSmile Dental', category: 'health', member: 'Maya', amount: -60, kind: 'expense', note: 'Check-up copay' },
  { id: 't29', date: '2026-11-17', merchant: 'FuelStop', category: 'transport', member: 'Dan', amount: -55.6, kind: 'expense', note: 'Petrol' },
  { id: 't31', date: '2026-11-18', merchant: 'Burger Joint', category: 'dining', member: 'Household', amount: -42.3, kind: 'expense', note: 'Dinner out' },
  { id: 't32', date: '2026-11-18', merchant: 'Garden Centre', category: 'home', member: 'Maya', amount: -18.75, kind: 'expense', note: 'Plant pots' },
  { id: 't33', date: '2026-11-19', merchant: 'School Canteen', category: 'kids', member: 'Leo', amount: -32.5, kind: 'expense', note: 'Lunch money' },
  { id: 't34', date: '2026-11-19', merchant: 'City Parking', category: 'transport', member: 'Dan', amount: -20, kind: 'expense', note: 'Downtown parking' },
  { id: 't35', date: '2026-11-20', merchant: 'GreenMart', category: 'groceries', member: 'Maya', amount: -74.1, kind: 'expense', note: 'Top-up shop' },
  { id: 't36', date: '2026-11-20', merchant: 'Game Shelf', category: 'fun', member: 'Leo', amount: -35.49, kind: 'expense', note: 'Board game' },
  { id: 't37', date: '2026-11-21', merchant: 'Thai Takeaway', category: 'dining', member: 'Household', amount: -28.4, kind: 'expense', note: 'Saturday takeaway' },
  { id: 't38', date: '2026-11-21', merchant: 'Cozy Corner', category: 'clothing', member: 'Sofia', amount: -29.99, kind: 'expense', note: 'Winter jacket' },
  { id: 't39', date: '2026-11-22', merchant: 'Field trip — museum', category: 'kids', member: 'Sofia', amount: -38, kind: 'expense', note: 'School trip' },
  { id: 't40', date: '2026-11-23', merchant: 'GreenMart', category: 'groceries', member: 'Maya', amount: -56.8, kind: 'expense', note: 'Weekly shop' },
  { id: 't41', date: '2026-11-23', merchant: 'VitaStore', category: 'health', member: 'Household', amount: -29.4, kind: 'expense', note: 'Vitamins' },
  { id: 't42', date: '2026-11-24', merchant: 'Sunny Brunch', category: 'dining', member: 'Household', amount: -41.6, kind: 'expense', note: 'Family brunch' },
  { id: 't43', date: '2026-11-24', merchant: 'Curtain House', category: 'home', member: 'Dan', amount: -20.5, kind: 'expense', note: 'Curtain rod' },
  { id: 't44', date: '2026-11-25', merchant: 'FuelStop', category: 'transport', member: 'Dan', amount: -30.9, kind: 'expense', note: 'Petrol' },
];

// October's ledger, so the month switcher shows a real second month.
// Its spending sums to the October history figure, $4,055.00.
export const TRANSACTIONS_OCT = [
  { id: 'o01', date: '2026-10-01', merchant: 'Maya — monthly pay', category: 'unbudgeted', member: 'Maya', amount: 3900, kind: 'income', note: 'Salary, after tax' },
  { id: 'o02', date: '2026-10-01', merchant: 'Willow House rent', category: 'housing', member: 'Household', amount: -1850, kind: 'expense', note: 'Monthly rent' },
  { id: 'o03', date: '2026-10-03', merchant: 'GreenMart', category: 'groceries', member: 'Maya', amount: -168.4, kind: 'expense', note: 'Weekly shop' },
  { id: 'o04', date: '2026-10-05', merchant: 'City Power', category: 'utilities', member: 'Household', amount: -141, kind: 'expense', note: 'Electricity bill' },
  { id: 'o05', date: '2026-10-07', merchant: 'FuelStop', category: 'transport', member: 'Dan', amount: -62.3, kind: 'expense', note: 'Petrol' },
  { id: 'o06', date: '2026-10-08', merchant: 'GreenMart', category: 'groceries', member: 'Dan', amount: -122.75, kind: 'expense', note: 'Weekly shop' },
  { id: 'o07', date: '2026-10-10', merchant: 'Sakura Sushi', category: 'dining', member: 'Maya', amount: -64.9, kind: 'expense', note: 'Anniversary dinner' },
  { id: 'o08', date: '2026-10-12', merchant: 'NorthNet', category: 'utilities', member: 'Household', amount: -65, kind: 'expense', note: 'Internet bill' },
  { id: 'o09', date: '2026-10-13', merchant: 'Piano lessons', category: 'kids', member: 'Sofia', amount: -95, kind: 'expense', note: 'October lessons' },
  { id: 'o10', date: '2026-10-15', merchant: 'Dan — monthly pay', category: 'unbudgeted', member: 'Dan', amount: 2950, kind: 'income', note: 'Salary, after tax' },
  { id: 'o11', date: '2026-10-15', merchant: 'NorthTel Mobile', category: 'utilities', member: 'Household', amount: -58, kind: 'expense', note: 'Two lines' },
  { id: 'o12', date: '2026-10-16', merchant: 'GreenMart', category: 'groceries', member: 'Maya', amount: -104.6, kind: 'expense', note: 'Weekly shop' },
  { id: 'o13', date: '2026-10-17', merchant: 'Cinema Rex', category: 'fun', member: 'Household', amount: -31, kind: 'expense', note: 'Movie night' },
  { id: 'o14', date: '2026-10-19', merchant: 'FuelStop', category: 'transport', member: 'Maya', amount: -57.8, kind: 'expense', note: 'Petrol' },
  { id: 'o15', date: '2026-10-20', merchant: 'GreenMart', category: 'groceries', member: 'Dan', amount: -88.2, kind: 'expense', note: 'Top-up shop' },
  { id: 'o16', date: '2026-10-21', merchant: 'Corner Pharmacy', category: 'health', member: 'Household', amount: -36.5, kind: 'expense', note: 'Prescriptions' },
  { id: 'o17', date: '2026-10-22', merchant: 'FixIt Hardware', category: 'home', member: 'Dan', amount: -52.4, kind: 'expense', note: 'Garden tools' },
  { id: 'o18', date: '2026-10-24', merchant: 'Burger Joint', category: 'dining', member: 'Household', amount: -47.6, kind: 'expense', note: 'Dinner out' },
  { id: 'o19', date: '2026-10-26', merchant: 'GreenMart', category: 'groceries', member: 'Maya', amount: -97.35, kind: 'expense', note: 'Weekly shop' },
  { id: 'o20', date: '2026-10-27', merchant: 'Cozy Corner', category: 'clothing', member: 'Sofia', amount: -44.99, kind: 'expense', note: 'School shoes' },
  { id: 'o21', date: '2026-10-28', merchant: 'Thai Takeaway', category: 'dining', member: 'Household', amount: -33.2, kind: 'expense', note: 'Takeaway' },
  { id: 'o22', date: '2026-10-30', merchant: 'City Water', category: 'utilities', member: 'Household', amount: -44, kind: 'expense', note: 'Water bill' },
  { id: 'o23', date: '2026-10-31', merchant: 'Pumpkin Patch', category: 'fun', member: 'Household', amount: -38, kind: 'expense', note: 'Halloween outing' },
  { id: 'o24', date: '2026-10-09', merchant: 'AutoCare Garage', category: 'transport', member: 'Dan', amount: -312.5, kind: 'expense', note: 'Annual car service' },
  { id: 'o25', date: '2026-10-14', merchant: 'Riverside School', category: 'kids', member: 'Household', amount: -189, kind: 'expense', note: 'Term fees' },
  { id: 'o26', date: '2026-10-18', merchant: 'Cozy Corner', category: 'clothing', member: 'Household', amount: -145.75, kind: 'expense', note: 'Winter coats' },
  { id: 'o27', date: '2026-10-25', merchant: 'Sunny Brunch', category: 'dining', member: 'Household', amount: -58.4, kind: 'expense', note: 'Sunday brunch' },
  { id: 'o28', date: '2026-10-29', merchant: 'Corner Pharmacy', category: 'health', member: 'Household', amount: -46.36, kind: 'expense', note: 'Prescriptions' },
];

export const MONTHS = [
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-11', label: 'November 2026' },
];

export function seedState() {
  return {
    month: '2026-11',
    envelopes: JSON.parse(JSON.stringify(ENVELOPES)),
    bills: JSON.parse(JSON.stringify(BILLS)),
    goals: JSON.parse(JSON.stringify(GOALS)),
    transactions: JSON.parse(JSON.stringify(TRANSACTIONS)),
    transactionsOct: JSON.parse(JSON.stringify(TRANSACTIONS_OCT)),
  };
}
