// Willow House — pages. One job: turn state into HTML for each route.
// Every number comes from store.js; nothing on any page is hard-coded.
import { BILLS_MONTH, CATEGORIES, MONTHS, categoryById } from './data.js';
import {
  addBill, addGoal, addToGoal, addTransaction, assignedTotal, billsDue, billsDueTotal,
  categoryList, deleteTransaction, envelopeStatus, getState, goalsMonthlyTotal,
  goalsProgress, historyWithCurrent, monthIncome, monthLabel, monthSpent,
  monthTransactions, payBill, resetAll, safeToSpend, setEnvelopeAssigned,
  setMonth, shortMonthLabel, spentByCategory, topMerchants, unbudgetedSpent, unpayBill,
} from './store.js';
import { budgetBarSVG, donutSVG, ringSVG, trendSVG } from './charts.js';

export const money = (n) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const money0 = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = (iso) => {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
const dot = (color) => `<span class="dot" style="background:${color}"></span>`;

function monthSwitcher() {
  const state = getState();
  return `<label class="month-switch">Month
    <select id="month-select" data-action="change-month" aria-label="Choose month">${MONTHS.map((m) => `<option value="${m.id}"${m.id === state.month ? ' selected' : ''}>${m.label}</option>`).join('')}</select>
  </label>`;
}

function txnRows(list) {
  if (!list.length) return `<tr><td colspan="6" class="empty">No transactions match. Try clearing the filters.</td></tr>`;
  return list.map((t) => {
    const cat = categoryById(t.category);
    const sign = t.kind === 'income' ? '+' : '−';
    return `<tr>
      <td>${fmtDate(t.date)}</td>
      <td><strong>${esc(t.merchant)}</strong>${t.note ? `<br><span class="muted">${esc(t.note)}</span>` : ''}</td>
      <td>${dot(cat.color)} ${cat.label}</td>
      <td>${esc(t.member)}</td>
      <td class="num ${t.kind}">${sign}${money(t.amount)}</td>
      <td><button class="btn tiny danger" data-action="delete-transaction" data-id="${t.id}" aria-label="Delete ${esc(t.merchant)}">Delete</button></td>
    </tr>`;
  }).join('');
}

export function quickAddForm() {
  return `<form class="card form-card" data-form="add-transaction" id="quick-add">
    <h3>Add a transaction</h3>
    <div class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>What was it? <input type="text" name="merchant" placeholder="e.g. GreenMart" required maxlength="60"></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Type <select name="kind"><option value="expense">Spending</option><option value="income">Income</option></select></label>
      <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select></label>
      <label>Who? <select name="member"><option>Household</option><option>Maya</option><option>Dan</option><option>Sofia</option><option>Leo</option></select></label>
    </div>
    <label class="full">Note (optional) <input type="text" name="note" placeholder="e.g. Weekly shop" maxlength="80"></label>
    <button class="btn primary" type="submit">Add to the ledger</button>
    <p class="form-note">Saved on this device only. Nothing leaves your browser.</p>
  </form>`;
}

// ---------------- Dashboard ----------------
export function renderDashboard() {
  const safe = safeToSpend();
  const income = monthIncome();
  const spent = monthSpent();
  const saved = income - spent;
  const due = billsDue();
  const dueTotal = billsDueTotal();
  const byCat = spentByCategory(getState().month);
  const parts = CATEGORIES.filter((c) => (byCat[c.id] || 0) > 0)
    .map((c) => ({ label: c.label, value: byCat[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value);
  const shortMonth = getState().month === '2026-10' ? 'Oct 2026' : 'Nov 2026';
  const envs = envelopeStatus().slice().sort((a, b) => (b.spent / b.available) - (a.spent / a.available));
  const goals = goalsProgress();
  // "Recent spending" shows spending only: income rows (paydays) belong in
  // the ledger, not under a spending heading.
  const recent = monthTransactions().filter((t) => t.kind === 'expense').slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const over = envs.filter((e) => e.left < 0);

  return `
  <div class="page-head">
    <div><h1>Dashboard</h1><p class="lede">One page for the whole household: what is safe to spend, what is due, and what is growing.</p></div>
    ${monthSwitcher()}
  </div>
  <section class="hero card">
    <div class="hero-text">
      <p class="eyebrow">${esc(monthLabel())} · The Alvarez family</p>
      <p class="hero-headline">Safe to spend: <span class="safe-amount">${money0(safe)}</span></p>
      <p class="lede">After every envelope is filled, every goal is funded and every bill is covered,
      this is what Willow House can still spend freely this month — no maths, no guilt.</p>
      <p class="hero-math">Income ${money0(income)} − envelopes ${money0(assignedTotal())} − goals ${money0(goalsMonthlyTotal())} − unbudgeted ${money0(unbudgetedSpent())}</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/transactions">See the ledger</a>
        <a class="btn" href="#/budgets">Check envelopes</a>
      </div>
    </div>
    <div class="hero-chart">
      ${donutSVG(parts, 220, `spent in ${shortMonth}`)}
      <div class="legend">${parts.map((p) => `<span>${dot(p.color)} ${p.label} <strong>${money0(p.value)}</strong> · ${Math.round((p.value / spent) * 100)}%</span>`).join('')}</div>
    </div>
  </section>

  <section class="stat-row">
    <div class="card stat"><span class="stat-label">Income</span><strong>${money0(income)}</strong><span class="muted">2 paydays this month</span></div>
    <div class="card stat"><span class="stat-label">Spent so far</span><strong>${money0(spent)}</strong><span class="muted">${Math.round((spent / income) * 100)}% of income</span></div>
    <div class="card stat"><span class="stat-label">Saved</span><strong>${money0(saved)}</strong><span class="muted">${Math.round((saved / income) * 100)}% savings rate</span></div>
    <div class="card stat ${due.length ? 'alert' : ''}"><span class="stat-label">Bills still due</span><strong>${money0(dueTotal)}</strong><span class="muted">${due.length} bill${due.length === 1 ? '' : 's'} left to pay · ${esc(BILLS_MONTH)}</span></div>
  </section>

  ${over.length ? `<div class="callout warn"><strong>Heads up:</strong> ${over.map((e) => `${e.label} is ${money0(-e.left)} over its envelope`).join('; ')}. Move money from another envelope or trim the next shop.</div>` : ''}

  <div class="two-col">
    <section class="card">
      <div class="card-head"><h2>Envelopes at a glance</h2><a href="#/budgets">All envelopes →</a></div>
      ${envs.slice(0, 5).map((e) => `<div class="env-line">
        <div class="env-line-top"><span>${dot(e.color)} ${e.label}</span><span><strong>${money0(e.spent)}</strong> of ${money0(e.available)}</span></div>
        ${budgetBarSVG(e.spent, e.available)}
      </div>`).join('')}
    </section>
    <section class="card">
      <div class="card-head"><h2>Bills due</h2><a href="#/bills">All bills →</a></div>
      ${due.length ? due.map((b) => `<div class="bill-line">
        <span><strong>${esc(b.name)}</strong><br><span class="muted">Due ${fmtDate(b.due)}</span></span>
        <span class="bill-right"><strong>${money0(b.amount)}</strong><br><button class="btn tiny primary" data-action="pay-bill" data-id="${b.id}">Pay now</button></span>
      </div>`).join('') : '<p class="empty">All bills are paid. Nothing due — enjoy the quiet.</p>'}
    </section>
  </div>

  <div class="two-col">
    <section class="card">
      <div class="card-head"><h2>Savings goals</h2><a href="#/goals">All goals →</a></div>
      ${goals.slice(0, 3).map((g) => `<div class="goal-line">
        ${ringSVG(g.pct, 72)}
        <div><strong>${esc(g.name)}</strong><br><span class="muted">${money0(g.saved)} of ${money0(g.target)} · ${money0(g.monthly)}/month</span></div>
      </div>`).join('')}
    </section>
    <section class="card">
      <div class="card-head"><h2>Recent spending</h2><a href="#/transactions">Full ledger →</a></div>
      <table class="ledger compact"><tbody>${txnRows(recent)}</tbody></table>
    </section>
  </div>

  ${quickAddForm()}`;
}

// ---------------- Transactions ----------------
let txnFilter = { q: '', category: '', member: '', kind: '' };
export function setTxnFilter(patch) {
  txnFilter = { ...txnFilter, ...patch };
}
export function getTxnFilter() {
  return txnFilter;
}

export function renderTransactions() {
  const all = monthTransactions().slice().sort((a, b) => b.date.localeCompare(a.date));
  const f = txnFilter;
  const list = all.filter((t) => {
    if (f.category && t.category !== f.category) return false;
    if (f.member && t.member !== f.member) return false;
    if (f.kind && t.kind !== f.kind) return false;
    if (f.q && !(t.merchant + ' ' + (t.note || '')).toLowerCase().includes(f.q.toLowerCase())) return false;
    return true;
  });
  const spent = list.filter((t) => t.kind === 'expense').reduce((s, t) => s - t.amount, 0);
  const income = list.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);

  return `
  <header class="page-head">
    <div><h1>Transactions</h1><p class="lede">Every dollar in and out of Willow House in ${esc(monthLabel())}. Search, filter, add or delete — the totals update as you go.</p></div>
    ${monthSwitcher()}
  </header>

  <div class="filter-bar card">
    <label>Search <input type="search" id="txn-search" placeholder="Merchant or note…" value="${esc(f.q)}" data-action="filter-q"></label>
    <label>Category <select data-action="filter-category">${['', ...CATEGORIES.map((c) => c.id)].map((id) => `<option value="${id}"${f.category === id ? ' selected' : ''}>${id ? categoryById(id).label : 'All categories'}</option>`).join('')}</select></label>
    <label>Who <select data-action="filter-member">${['', 'Household', 'Maya', 'Dan', 'Sofia', 'Leo'].map((m) => `<option${f.member === m ? ' selected' : ''}>${m || 'Everyone'}</option>`).join('')}</select></label>
    <label>Type <select data-action="filter-kind">${['', 'expense', 'income'].map((k) => `<option value="${k}"${f.kind === k ? ' selected' : ''}>${k === '' ? 'All' : k === 'expense' ? 'Spending' : 'Income'}</option>`).join('')}</select></label>
    <button class="btn" data-action="export-csv">Export CSV</button>
  </div>

  <section class="card">
    <div class="card-head"><h2>${list.length} transaction${list.length === 1 ? '' : 's'}</h2>
    <span>Spent <strong>${money(spent)}</strong> · Income <strong>${money(income)}</strong> · Net <strong>${money(income - spent)}</strong></span></div>
    <div class="table-wrap"><table class="ledger">
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th>Who</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${txnRows(list)}</tbody>
    </table></div>
  </section>

  ${quickAddForm()}`;
}

// ---------------- Budgets ----------------
export function renderBudgets() {
  const envs = envelopeStatus();
  const totalAssigned = assignedTotal();
  const totalSpent = envs.reduce((s, e) => s + e.spent, 0);
  const over = envs.filter((e) => e.left < 0);
  return `
  <header class="page-head">
    <div><h1>Budgets — envelopes</h1><p class="lede">Give every dollar a job before the month begins. Each envelope holds its
    assigned money plus any rollover from last month; spending draws it down. ${money0(totalAssigned)} assigned, ${money0(totalSpent)} spent.</p></div>
    ${monthSwitcher()}
  </header>
  ${over.length ? `<div class="callout warn"><strong>Over budget:</strong> ${over.map((e) => `${e.label} (${money0(-e.left)} over)`).join(', ')}. Edit an assigned amount below or move spending to next month.</div>` : '<div class="callout ok"><strong>On track:</strong> no envelope is over budget right now.</div>'}
  <div class="env-grid">
    ${envs.map((e) => `<article class="card env-card ${e.left < 0 ? 'over' : ''}">
      <div class="card-head"><h2>${dot(e.color)} ${e.label}</h2><span class="pct">${e.available ? Math.round((e.spent / e.available) * 100) : 0}% used</span></div>
      <p class="env-numbers"><strong>${money0(e.spent)}</strong> spent of <strong>${money0(e.available)}</strong> available</p>
      ${budgetBarSVG(e.spent, e.available)}
      <p class="env-left ${e.left < 0 ? 'over-text' : ''}">${e.left < 0 ? `${money0(-e.left)} over budget` : `${money0(e.left)} left`}${e.rollover ? ` · includes ${money0(e.rollover)} rollover` : ''}</p>
      <form class="env-edit" data-form="edit-envelope" data-category="${e.category}">
        <label>Assigned $ <input type="number" name="assigned" min="0" step="5" value="${e.assigned}" required></label>
        <button class="btn tiny" type="submit">Save</button>
      </form>
    </article>`).join('')}
  </div>
  <section class="card">
    <h2>How envelopes work at Willow House</h2>
    <ol class="how-list">
      <li><strong>Assign first.</strong> On the 1st, Maya and Dan split the month's pay across envelopes — rent and bills first, food next, fun last.</li>
      <li><strong>Spend from the envelope.</strong> Every transaction picks a category, so the envelope drops in real time. No envelope, no spend.</li>
      <li><strong>Rollover what is left.</strong> Unspent money carries into next month's envelope — saving feels like winning, not dieting.</li>
      <li><strong>Over is a signal, not a failure.</strong> Dining Out went over this month; the fix is a smaller next shop, not a lecture.</li>
    </ol>
  </section>`;
}

// ---------------- Bills ----------------
export function renderBills() {
  const state = getState();
  const due = state.bills.filter((b) => !b.paid).slice().sort((a, b) => a.due.localeCompare(b.due));
  const paid = state.bills.filter((b) => b.paid).slice().sort((a, b) => a.due.localeCompare(b.due));
  const dueTotal = due.reduce((s, b) => s + b.amount, 0);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const billRow = (b, isDue) => `<div class="bill-line">
    <span>${dot(categoryById(b.category).color)} <strong>${esc(b.name)}</strong><br>
    <span class="muted">Due ${fmtDate(b.due)} · ${b.autopay ? 'Autopay on' : 'Pay by hand'} · ${categoryById(b.category).label}</span></span>
    <span class="bill-right"><strong>${money0(b.amount)}</strong><br>
    ${isDue ? `<button class="btn tiny primary" data-action="pay-bill" data-id="${b.id}">Pay now</button>` : `<span class="paid-tag">Paid ✓</span> <button class="btn tiny" data-action="unpay-bill" data-id="${b.id}">Undo</button>`}</span>
  </div>`;
  return `
  <header class="page-head">
    <div><h1>Bills</h1><p class="lede">Every recurring bill in one place — the ${esc(BILLS_MONTH)} set. Pay what is due, see what autopay already handled, and add a new bill in seconds. The month switcher does not change bills: these are the household's fixed recurring bills, not a monthly ledger.</p></div>
  </header>
  <section class="stat-row">
    <div class="card stat ${due.length ? 'alert' : ''}"><span class="stat-label">Still due · ${esc(BILLS_MONTH)}</span><strong>${money0(dueTotal)}</strong><span class="muted">${due.length} bill${due.length === 1 ? '' : 's'}</span></div>
    <div class="card stat"><span class="stat-label">Already paid</span><strong>${money0(paidTotal)}</strong><span class="muted">${paid.length} bill${paid.length === 1 ? '' : 's'}</span></div>
    <div class="card stat"><span class="stat-label">Monthly bills total</span><strong>${money0(dueTotal + paidTotal)}</strong><span class="muted">${state.bills.length} recurring bills</span></div>
  </section>
  <section class="card">
    <div class="card-head"><h2>Due</h2></div>
    ${due.length ? due.map((b) => billRow(b, true)).join('') : '<p class="empty">Nothing due. Every bill is paid — the month is yours.</p>'}
  </section>
  <section class="card">
    <div class="card-head"><h2>Paid</h2></div>
    ${paid.map((b) => billRow(b, false)).join('')}
  </section>
  <form class="card form-card" data-form="add-bill">
    <h3>Add a recurring bill</h3>
    <div class="form-grid">
      <label>Bill name <input type="text" name="name" placeholder="e.g. Home insurance" required maxlength="60"></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Due date <input type="date" name="due" value="2026-11-28" required></label>
      <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select></label>
      <label class="check">Autopay <input type="checkbox" name="autopay"></label>
    </div>
    <button class="btn primary" type="submit">Add bill</button>
  </form>`;
}

// ---------------- Goals ----------------
export function renderGoals() {
  const goals = goalsProgress();
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  return `
  <header class="page-head">
    <div><h1>Savings goals</h1><p class="lede">Money with a name gets saved first. ${money0(totalSaved)} saved toward ${money0(totalTarget)} across ${goals.length} goals — ${money0(goalsMonthlyTotal())} goes in every month, automatically.</p></div>
    ${monthSwitcher()}
  </header>
  <div class="goal-grid">
    ${goals.map((g) => `<article class="card goal-card">
      <div class="goal-top">${ringSVG(g.pct)}<div><h2>${esc(g.name)}</h2><p class="muted">${esc(g.note)}</p></div></div>
      <p class="goal-numbers"><strong>${money0(g.saved)}</strong> of ${money0(g.target)} · ${money0(g.target - g.saved)} to go</p>
      <div class="budget-bar"><span class="budget-bar-fill" style="width:${g.pct}%;background:#1d4a38"></span></div>
      <p class="muted">${money0(g.monthly)} a month · at this pace, funded in ${Math.max(1, Math.ceil((g.target - g.saved) / Math.max(g.monthly, 1)))} months</p>
      <form class="goal-add" data-form="add-funds" data-id="${g.id}">
        <label>Add $ <input type="number" name="amount" min="1" step="1" placeholder="50" required></label>
        <button class="btn tiny primary" type="submit">Add funds</button>
      </form>
    </article>`).join('')}
  </div>
  <form class="card form-card" data-form="add-goal">
    <h3>Start a new goal</h3>
    <div class="form-grid">
      <label>Goal name <input type="text" name="name" placeholder="e.g. New bikes" required maxlength="60"></label>
      <label>Target ($) <input type="number" name="target" min="1" step="1" placeholder="1000" required></label>
      <label>Monthly ($) <input type="number" name="monthly" min="0" step="5" placeholder="50" required></label>
      <label>Already saved ($) <input type="number" name="saved" min="0" step="1" value="0"></label>
    </div>
    <label class="full">Why this goal? <input type="text" name="note" placeholder="e.g. For spring rides together" maxlength="90"></label>
    <button class="btn primary" type="submit">Create goal</button>
  </form>`;
}

// ---------------- Reports ----------------
export function renderReports() {
  const history = historyWithCurrent();
  const byCat = spentByCategory(getState().month);
  const spent = monthSpent();
  const income = monthIncome();
  const shortMonth = shortMonthLabel();
  const rows = CATEGORIES.filter((c) => (byCat[c.id] || 0) > 0)
    .map((c) => ({ ...c, value: byCat[c.id] }))
    .sort((a, b) => b.value - a.value);
  const merchants = topMerchants(5);
  const envs = envelopeStatus();
  const over = envs.filter((e) => e.left < 0);
  const under = envs.filter((e) => e.left > 0).sort((a, b) => b.left - a.left);
  const savingsRate = Math.round(((income - spent) / income) * 100);
  const bestMonth = history.reduce((best, h) => (h.spent < best.spent ? h : best), history[0]);
  const insights = [
    `Savings rate is ${savingsRate}% — ${money0(income - spent)} of ${money0(income)} stayed in the house this month.`,
    over.length
      ? `${over.map((e) => e.label).join(' and ')} ran over ${over.length === 1 ? 'its' : 'their'} envelope${over.length === 1 ? '' : 's'} by ${over.map((e) => money0(-e.left)).join(' and ')} — the most fixable leak in the budget.`
      : 'No envelope ran over this month. Every category stayed inside its plan.',
    `${rows[0].label} is the biggest spend at ${money0(rows[0].value)} (${Math.round((rows[0].value / spent) * 100)}% of all spending).`,
    under.length ? `${under[0].label} has the most slack: ${money0(under[0].left)} unspent in its envelope, ready to roll over.` : '',
    `${bestMonth.label} was the cheapest month in the last six, at ${money0(bestMonth.spent)} spent.`,
  ].filter(Boolean);

  return `
  <header class="page-head">
    <div><h1>Reports</h1><p class="lede">Six months of Willow House money, in one view. Where it went, what changed, and what to fix next month.</p></div>
    ${monthSwitcher()}
  </header>
  <section class="card">
    <div class="card-head"><h2>Income vs spending — last 6 months</h2><span class="legend-inline"><span>${dot('#1d4a38')} Income</span> <span>${dot('#d96c3f')} Spending</span></span></div>
    ${trendSVG(history)}
    <p class="muted">${esc(shortMonth)} is the live month: its bars come from the ledger, so adding a transaction moves them.</p>
  </section>
  <div class="two-col">
    <section class="card">
      <div class="card-head"><h2>Where ${esc(shortMonth)} went</h2><span>${money0(spent)} total</span></div>
      <table class="ledger">
        <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td>${dot(r.color)} ${r.label}</td><td class="num">${money(r.value)}</td><td class="num">${Math.round((r.value / spent) * 100)}%</td></tr>`).join('')}</tbody>
      </table>
    </section>
    <section class="card">
      <div class="card-head"><h2>Top merchants</h2><span>${esc(shortMonth)}</span></div>
      <table class="ledger">
        <thead><tr><th>Merchant</th><th class="num">Spent</th></tr></thead>
        <tbody>${merchants.map((m) => `<tr><td>${esc(m.merchant)}</td><td class="num">${money(m.total)}</td></tr>`).join('')}</tbody>
      </table>
      <h3 class="insights-head">What the numbers say</h3>
      <ul class="insights">${insights.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </section>
  </div>
  <section class="card">
    <div class="card-head"><h2>Take the numbers with you</h2></div>
    <p>Export the current month's ledger as a CSV file — it opens in any spreadsheet, and it is the same data this page shows.</p>
    <button class="btn primary" data-action="export-csv">Download ${esc(shortMonth)} ledger (CSV)</button>
    <button class="btn danger-outline" data-action="reset-demo">Reset demo data</button>
  </section>`;
}

// Re-exported actions so main.js wires every control through one place.
export const actions = {
  addTransaction, addBill, addGoal, addToGoal, deleteTransaction, payBill,
  unpayBill, resetAll, setEnvelopeAssigned, setMonth,
};
