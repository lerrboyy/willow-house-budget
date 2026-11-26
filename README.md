# Willow House — Household Budget

[![Competition](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/lerrboyy/willow-house-budget/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/lerrboyy/willow-house-budget/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A [make.fun](https://make.fun/bounty/best-household-budget-site-20261126-1457)
bounty entry: the best household budget site — a working, offline, original
budget home for a fictional family, the Alvarez family at Willow House.

## What it is

Most budget apps open on a grey fintech dashboard and a wall of numbers.
Willow House opens on one question a family actually asks: **“Can I spend
this?”** The dashboard answers it with a single number — **Safe to Spend** —
then shows where the money already went, which envelopes are healthy, which
bills are still due, and how the savings goals are doing. Everything is real
and everything works: add a transaction and the dashboard, envelopes, reports
and Safe to Spend all move.

## The six sections

- **Dashboard** — Safe to Spend, income / spent / saved, a spending donut,
  envelopes at a glance, bills due this week, goals snapshot, recent spending.
- **Transactions** — the full ledger (43 November entries plus October):
  search, filter by category, member and type, add, delete, export as CSV.
- **Budgets** — ten envelopes with assigned money, rollover from last month,
  live progress bars and over-budget warnings; edit any assigned amount.
- **Bills** — ten recurring bills with due dates and autopay flags; pay one
  with a tap, undo it, or add a new bill.
- **Goals** — four savings jars (emergency fund, summer holiday, new sofa,
  college fund) with progress rings, monthly contributions and add-funds;
  create your own goal.
- **Reports** — six months of income vs spending as a bar chart, a category
  breakdown, top merchants, and insights written from the real numbers.

October and November are both real months — switch months and the ledger,
envelopes and charts switch with it. Data persists in the browser
(localStorage); “Reset demo data” restores the seed household.

## How it works

- Static files under `app/` — no build step, no framework, no network
  request. System fonts and hand-built inline SVG charts only.
- `app/data.js` — the seed household: envelopes, bills, goals, history,
  43 November + 28 October transactions (November spending $3,951.43 and
  October spending $4,055.00 both match the history figures exactly).
- `app/store.js` — state, persistence and every computed figure.
- `app/charts.js` — SVG donut, trend bars and progress rings.
- `app/views.js` — the six page renderers.
- `app/main.js` — hash router and control wiring.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the
  output directory (clearing its contents only, never the directory) and
  writes `dossier.json` with the vendored make.fun library.
- `serve.ts` — tiny static server for local testing.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (outside the grader, `MAKEFUN_OUTPUT_DIR` stands in for `/output`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
