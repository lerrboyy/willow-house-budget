// Willow House — charts. One job: turn numbers into inline SVG.
// No library, no network: every chart is a string of SVG the page renders.
function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const [x1, y1] = polar(cx, cy, rOuter, startAngle);
  const [x2, y2] = polar(cx, cy, rOuter, endAngle);
  const [x3, y3] = polar(cx, cy, rInner, endAngle);
  const [x4, y4] = polar(cx, cy, rInner, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${rInner} ${rInner} 0 ${large} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
}

// Donut of spending by category. `parts` is [{label, value, color}].
// It sits on a cream disc so even the pine slice reads on the dark hero.
export function donutSVG(parts, size = 220, centerSub = 'spent in November') {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 6;
  const inner = outer - 30;
  const disc = `<circle cx="${cx}" cy="${cy}" r="${outer + 2}" fill="#fffdf7"/>`;
  const center = `<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="chart-center dark">$${Math.round(total).toLocaleString('en-US')}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="chart-center-sub dark">${centerSub}</text>`;
  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" class="chart" role="img" aria-label="No spending yet">${disc}<circle cx="${cx}" cy="${cy}" r="${outer}" fill="none" stroke="#e7e0d2" stroke-width="30"/>${center}</svg>`;
  }
  let angle = 0;
  let slices = '';
  for (const p of parts) {
    const frac = p.value / total;
    if (frac <= 0) continue;
    const sweep = Math.max(frac * 360 - 1.2, 0.6);
    const pct = Math.round(frac * 100);
    slices += `<path d="${arcPath(cx, cy, outer, inner, angle, angle + sweep)}" fill="${p.color}"><title>${p.label}: $${p.value.toFixed(2)} — ${pct}% of spending</title></path>`;
    angle += frac * 360;
  }
  // Screen-reader summary: every slice named with its share, so the chart
  // reads the same as the legend below it.
  const summary = parts.map((p) => `${p.label} $${Math.round(p.value).toLocaleString('en-US')} (${Math.round((p.value / total) * 100)}%)`).join(', ');
  return `<svg viewBox="0 0 ${size} ${size}" class="chart" role="img" aria-label="Spending by category, $${Math.round(total).toLocaleString('en-US')} total: ${summary}">${disc}${slices}${center}</svg>`;
}

// Grouped bars: income vs spending over months. `rows` is [{label, income, spent}].
export function trendSVG(rows, width = 640, height = 260) {
  const padL = 52;
  const padB = 28;
  const padT = 14;
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent)), 1000);
  const top = Math.ceil(max / 1000) * 1000;
  const plotW = width - padL - 12;
  const plotH = height - padT - padB;
  const groupW = plotW / rows.length;
  const barW = Math.min(26, groupW / 3);
  const y = (v) => padT + plotH - (v / top) * plotH;
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const v = (top / 4) * g;
    grid += `<line x1="${padL}" y1="${y(v)}" x2="${width - 12}" y2="${y(v)}" class="grid-line"/><text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end" class="axis-label">$${(v / 1000).toFixed(0)}k</text>`;
  }
  let bars = '';
  rows.forEach((r, i) => {
    const cx = padL + groupW * i + groupW / 2;
    const incomeX = cx - barW - 3 + barW / 2;
    const spentX = cx + 3 + barW / 2;
    bars += `<rect x="${(cx - barW - 3).toFixed(1)}" y="${y(r.income).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(r.income)).toFixed(1)}" rx="3" fill="#1d4a38"><title>${r.label} income $${r.income.toLocaleString('en-US')}</title></rect>`;
    bars += `<text x="${incomeX.toFixed(1)}" y="${(y(r.income) - 5).toFixed(1)}" text-anchor="middle" class="chart-value-label">$${(r.income / 1000).toFixed(1)}k</text>`;
    bars += `<rect x="${(cx + 3).toFixed(1)}" y="${y(r.spent).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(r.spent)).toFixed(1)}" rx="3" fill="#d96c3f"><title>${r.label} spending $${Math.round(r.spent).toLocaleString('en-US')}</title></rect>`;
    bars += `<text x="${spentX.toFixed(1)}" y="${(y(r.spent) - 5).toFixed(1)}" text-anchor="middle" class="chart-value-label">$${(r.spent / 1000).toFixed(1)}k</text>`;
    bars += `<text x="${cx}" y="${height - 8}" text-anchor="middle" class="axis-label">${r.label}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" class="chart wide" role="img" aria-label="Income versus spending by month, ${rows[0].label} to ${rows[rows.length - 1].label}">${grid}${bars}</svg>`;
}

// Progress ring for a savings goal, 0–100%.
export function ringSVG(pct, size = 96) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const shown = Math.max(0, Math.min(100, pct));
  const dash = (shown / 100) * c;
  return `<svg viewBox="0 0 ${size} ${size}" class="chart ring" role="img" aria-label="${shown}% funded"><title>${shown}% funded</title><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#e7e0d2" stroke-width="9"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#1d4a38" stroke-width="9" stroke-linecap="round" stroke-dasharray="${dash.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/><text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" class="ring-label">${shown}%</text></svg>`;
}

// Horizontal budget bar: used fraction of the envelope, red when over.
export function budgetBarSVG(used, available, width = 100) {
  const pct = available > 0 ? Math.min(100, (used / available) * 100) : 0;
  const over = used > available;
  const color = over ? '#c0392b' : pct > 85 ? '#d99a2b' : '#1d4a38';
  return `<div class="budget-bar" role="img" aria-label="${pct.toFixed(0)}% of envelope used"><span class="budget-bar-fill" style="width:${pct}%;background:${color}"></span>${over ? '<span class="budget-bar-over">over budget</span>' : ''}</div>`;
}
