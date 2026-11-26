// Willow House — state store. One job: load, save and compute from the data.
// Everything persists in localStorage under one key; Reset restores the seed.
import { CATEGORIES, HISTORY, MONTHS, categoryById, seedState } from './data.js';

const KEY = 'willow-house-v1';

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && Array.isArray(parsed.envelopes)) return parsed;
    }
  } catch {
    // Corrupt storage falls through to the seed.
  }
  return seedState();
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or full storage: the site keeps working in memory.
  }
}

export function resetAll() {
  state = seedState();
  save();
}

export function getState() {
  return state;
}

export function setMonth(monthId) {
  if (MONTHS.some((m) => m.id === monthId)) {
    state.month = monthId;
    save();
  }
}

export function monthLabel() {
  return (MONTHS.find((m) => m.id === state.month) || MONTHS[1]).label;
}

export function monthTransactions() {
  return state.month === '2026-10' ? state.transactionsOct : state.transactions;
}

export function monthIncome() {
  return monthTransactions()
    .filter((t) => t.kind === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function monthSpent() {
  return monthTransactions()
    .filter((t) => t.kind === 'expense')
    .reduce((sum, t) => sum - t.amount, 0);
}

export function spentByCategory(monthId) {
  const list = monthId === '2026-10' ? state.transactionsOct : state.transactions;
  const totals = {};
  for (const t of list) {
    if (t.kind !== 'expense' || t.amount === 0) continue;
    totals[t.category] = (totals[t.category] || 0) - t.amount;
  }
  return totals;
}

export function envelopeStatus() {
  const spent = spentByCategory(state.month);
  return state.envelopes.map((env) => {
    const available = env.assigned + env.rollover;
    const used = spent[env.category] || 0;
    return { ...env, ...categoryById(env.category), spent: used, available, left: available - used };
  });
}

export function assignedTotal() {
  return state.envelopes.reduce((sum, e) => sum + e.assigned + e.rollover, 0);
}

export function goalsMonthlyTotal() {
  return state.goals.reduce((sum, g) => sum + g.monthly, 0);
}

export function unbudgetedSpent() {
  return (spentByCategory(state.month).unbudgeted || 0);
}

// The number the whole site is built around: what the family can still
// spend this month after envelopes, goals and unbudgeted spending.
export function safeToSpend() {
  return monthIncome() - assignedTotal() - goalsMonthlyTotal() - unbudgetedSpent();
}

export function billsDue() {
  return state.bills.filter((b) => !b.paid);
}

export function billsDueTotal() {
  return billsDue().reduce((sum, b) => sum + b.amount, 0);
}

export function goalsProgress() {
  return state.goals.map((g) => ({ ...g, pct: Math.min(100, Math.round((g.saved / g.target) * 100)) }));
}

export function historyWithCurrent() {
  return HISTORY.map((h) => (h.month === state.month ? { ...h, spent: monthSpent(), income: monthIncome() } : h));
}

export function addTransaction(tx) {
  const list = monthTransactions();
  const id = `u${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  const signed = tx.kind === 'income' ? Math.abs(tx.amount) : -Math.abs(tx.amount);
  list.unshift({ id, date: tx.date, merchant: tx.merchant, category: tx.category, member: tx.member, amount: signed, kind: tx.kind, note: tx.note || '' });
  save();
  return id;
}

export function deleteTransaction(id) {
  for (const key of ['transactions', 'transactionsOct']) {
    const i = state[key].findIndex((t) => t.id === id);
    if (i !== -1) {
      state[key].splice(i, 1);
      save();
      return true;
    }
  }
  return false;
}

export function setEnvelopeAssigned(category, assigned) {
  const env = state.envelopes.find((e) => e.category === category);
  if (env && Number.isFinite(assigned) && assigned >= 0 && assigned <= 100000) {
    env.assigned = Math.round(assigned);
    save();
    return true;
  }
  return false;
}

export function payBill(id) {
  const bill = state.bills.find((b) => b.id === id);
  if (bill) {
    bill.paid = true;
    save();
    return true;
  }
  return false;
}

export function unpayBill(id) {
  const bill = state.bills.find((b) => b.id === id);
  if (bill) {
    bill.paid = false;
    save();
    return true;
  }
  return false;
}

export function addBill(bill) {
  const id = `b${Date.now().toString(36)}`;
  state.bills.push({ id, name: bill.name, amount: bill.amount, due: bill.due, autopay: !!bill.autopay, paid: false, category: bill.category });
  state.bills.sort((a, b) => a.due.localeCompare(b.due));
  save();
  return id;
}

export function addToGoal(id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (goal && Number.isFinite(amount) && amount > 0) {
    goal.saved = Math.round((goal.saved + amount) * 100) / 100;
    save();
    return true;
  }
  return false;
}

export function addGoal(goal) {
  const id = `g${Date.now().toString(36)}`;
  state.goals.push({ id, name: goal.name, target: goal.target, saved: goal.saved || 0, monthly: goal.monthly || 0, note: goal.note || '' });
  save();
  return id;
}

export function topMerchants(limit = 5) {
  const totals = {};
  for (const t of monthTransactions()) {
    if (t.kind !== 'expense' || t.amount === 0) continue;
    totals[t.merchant] = (totals[t.merchant] || 0) - t.amount;
  }
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([merchant, total]) => ({ merchant, total }));
}

export function categoryList() {
  return CATEGORIES;
}
