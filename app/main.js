// Willow House — app boot. One job: routing and wiring every control.
// All rendering lives in views.js; this file only routes and reacts.
import { actions, getTxnFilter, renderBills, renderBudgets, renderDashboard, renderGoals, renderReports, renderTransactions, setTxnFilter } from './views.js';
import { monthLabel, monthTransactions, seedMatchesHistory } from './store.js';

// Self-check at boot: the seeded history figures must match what the ledger
// sums to. A mismatch means a displayed number disagrees with the ledger.
const seedMismatch = seedMatchesHistory();
if (seedMismatch.length) console.warn('Willow House: seed history disagrees with the ledger', seedMismatch);

const view = document.getElementById('view');
const toast = document.getElementById('toast');

const ROUTES = {
  '/': { render: renderDashboard, title: 'Dashboard' },
  '/transactions': { render: renderTransactions, title: 'Transactions' },
  '/budgets': { render: renderBudgets, title: 'Budgets' },
  '/bills': { render: renderBills, title: 'Bills' },
  '/goals': { render: renderGoals, title: 'Savings goals' },
  '/reports': { render: renderReports, title: 'Reports' },
};

function currentPath() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1) || '/';
  return ROUTES[path] ? path : '/';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

export function render() {
  const path = currentPath();
  const route = ROUTES[path];
  view.innerHTML = route.render();
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${path}`);
    if (a.classList.contains('active')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = `Willow House — ${route.title} · Household budget`;
  window.scrollTo(0, 0);
}

function downloadCSV() {
  const rows = [['Date', 'Merchant', 'Category', 'Member', 'Type', 'Amount', 'Note']];
  for (const t of monthTransactions().slice().sort((a, b) => a.date.localeCompare(b.date))) {
    rows.push([t.date, `"${t.merchant.replace(/"/g, '""')}"`, t.category, t.member, t.kind, t.amount.toFixed(2), `"${(t.note || '').replace(/"/g, '""')}"`]);
  }
  const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `willow-house-${monthLabel().toLowerCase().replace(' ', '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Ledger downloaded as CSV.');
}

function handleForm(form) {
  const data = new FormData(form);
  const kind = form.dataset.form;
  if (kind === 'add-transaction') {
    const amount = Number(data.get('amount'));
    if (!Number.isFinite(amount) || amount <= 0) return showToast('Enter an amount above $0.');
    actions.addTransaction({
      date: String(data.get('date')),
      merchant: String(data.get('merchant')).trim(),
      amount,
      kind: String(data.get('kind')),
      category: String(data.get('category')),
      member: String(data.get('member')),
      note: String(data.get('note') || '').trim(),
    });
    showToast('Transaction added to the ledger.');
    render();
  } else if (kind === 'edit-envelope') {
    const assigned = Number(data.get('assigned'));
    if (actions.setEnvelopeAssigned(String(form.dataset.category), assigned)) {
      showToast('Envelope updated.');
      render();
    } else {
      showToast('That amount does not work — try $0 or more.');
    }
  } else if (kind === 'add-bill') {
    const amount = Number(data.get('amount'));
    if (!Number.isFinite(amount) || amount <= 0) return showToast('Enter an amount above $0.');
    actions.addBill({
      name: String(data.get('name')).trim(),
      amount,
      due: String(data.get('due')),
      category: String(data.get('category')),
      autopay: data.get('autopay') === 'on',
    });
    showToast('Bill added.');
    render();
  } else if (kind === 'add-funds') {
    const amount = Number(data.get('amount'));
    if (!Number.isFinite(amount) || amount <= 0) return showToast('Enter an amount above $0.');
    if (actions.addToGoal(String(form.dataset.id), amount)) {
      showToast(`Added ${'$' + amount} to the goal.`);
      render();
    }
  } else if (kind === 'add-goal') {
    const target = Number(data.get('target'));
    const monthly = Number(data.get('monthly'));
    if (!Number.isFinite(target) || target <= 0) return showToast('Enter a target above $0.');
    actions.addGoal({
      name: String(data.get('name')).trim(),
      target,
      monthly: Number.isFinite(monthly) ? monthly : 0,
      saved: Number(data.get('saved')) || 0,
      note: String(data.get('note') || '').trim(),
    });
    showToast('New goal created.');
    render();
  }
}

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form instanceof HTMLFormElement && form.dataset.form) {
    event.preventDefault();
    handleForm(form);
  }
});

document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'delete-transaction') {
    if (window.confirm('Delete this transaction?')) {
      actions.deleteTransaction(el.dataset.id);
      showToast('Transaction deleted.');
      render();
    }
  } else if (action === 'pay-bill') {
    actions.payBill(el.dataset.id);
    showToast('Bill marked paid.');
    render();
  } else if (action === 'unpay-bill') {
    actions.unpayBill(el.dataset.id);
    showToast('Bill marked unpaid.');
    render();
  } else if (action === 'export-csv') {
    downloadCSV();
  } else if (action === 'reset-demo') {
    if (window.confirm('Reset all Willow House data back to the November demo? Your changes will be lost.')) {
      actions.resetAll();
      showToast('Demo data restored.');
      render();
    }
  }
});

document.addEventListener('change', (event) => {
  const el = event.target;
  if (!(el instanceof HTMLElement)) return;
  const action = el.dataset.action;
  if (action === 'change-month' && el instanceof HTMLSelectElement) {
    actions.setMonth(el.value);
    showToast(`Now showing ${el.options[el.selectedIndex].text}.`);
    render();
  } else if (action === 'filter-category' && el instanceof HTMLSelectElement) {
    setTxnFilter({ category: el.value });
    render();
    const input = document.getElementById('txn-search');
    if (input) input.focus();
  } else if (action === 'filter-member' && el instanceof HTMLSelectElement) {
    setTxnFilter({ member: el.value === 'Everyone' ? '' : el.value });
    render();
  } else if (action === 'filter-kind' && el instanceof HTMLSelectElement) {
    setTxnFilter({ kind: el.value });
    render();
  }
});

document.addEventListener('input', (event) => {
  const el = event.target;
  if (el instanceof HTMLInputElement && el.dataset.action === 'filter-q') {
    setTxnFilter({ q: el.value });
    const pos = el.selectionStart;
    render();
    const input = document.getElementById('txn-search');
    if (input) {
      input.focus();
      input.setSelectionRange(pos, pos);
    }
  }
});

window.addEventListener('hashchange', render);
render();
