#!/usr/bin/env node
// Sleeper league manager stats: pickups, trades, and points by acquisition source.
// Usage: node sleeper-manager-stats.mjs <current_league_id> [--names] [--regular-season-only] [--no-cache]
// Needs Node 18+ (built-in fetch). No dependencies.

import fs from 'node:fs/promises';
import path from 'node:path';

const API = 'https://api.sleeper.app/v1';
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const leagueId = args.find((a) => !a.startsWith('--'));
if (!leagueId) {
  console.error('Usage: node sleeper-manager-stats.mjs <current_league_id> [--names] [--regular-season-only] [--no-cache]');
  process.exit(1);
}
const CACHE = '.sleeper-cache';

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const fmt = (n, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : '-');

// cache=true only for finished past seasons; the current season changes daily.
async function get(p, cache = true) {
  const file = path.join(CACHE, p.replace(/[^a-z0-9]+/gi, '_') + '.json');
  if (cache && !flags.has('--no-cache')) {
    try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { /* miss */ }
  }
  const res = await fetch(API + p);
  if (!res.ok) throw new Error(`${res.status} for ${API + p}`);
  const data = await res.json();
  if (cache) {
    await fs.mkdir(CACHE, { recursive: true });
    await fs.writeFile(file, JSON.stringify(data));
  }
  return data;
}
const safeGet = async (p, cache) => { try { return (await get(p, cache)) || []; } catch { return []; } };

function table(rows, cols) {
  const w = cols.map((c) => Math.max(c.h.length, ...rows.map((r) => String(c.f(r)).length)));
  const line = (cells) => cells.map((s, i) => (i === 0 ? String(s).padEnd(w[i]) : String(s).padStart(w[i]))).join('  ');
  console.log(line(cols.map((c) => c.h)));
  console.log(w.map((n) => '-'.repeat(n)).join('  '));
  rows.forEach((r) => console.log(line(cols.map((c) => c.f(r)))));
  console.log();
}

// ---------- load the league chain ----------
const state = await get('/state/nfl', false);

async function loadLeague(id, cache) {
  const league = await get(`/league/${id}`, cache);
  const [users, rosters] = await Promise.all([get(`/league/${id}/users`, cache), get(`/league/${id}/rosters`, cache)]);
  const rosterOwner = {};
  rosters.forEach((r) => { rosterOwner[r.roster_id] = r.owner_id; });
  const txns = (await Promise.all(range(1, 18).map((w) => safeGet(`/league/${id}/transactions/${w}`, cache))))
    .flat()
    .filter((t) => t && t.status === 'complete');
  return { id, league, season: String(league.season), users, rosters, rosterOwner, txns };
}

const chain = [];
for (let id = leagueId, head = true; id && id !== '0'; head = false) {
  const L = await loadLeague(id, !head);
  chain.push(L);
  id = L.league.previous_league_id;
}
const head = chain[0];
const curSeason = head.season;
const headComplete = head.league.status === 'complete';
const txnThrough = headComplete ? 18 : Math.min(18, state.week || 18);
const pointsThrough = Math.min(
  head.league.settings?.last_scored_leg || (headComplete ? 18 : Math.max(0, (state.week || 1) - 1)),
  flags.has('--regular-season-only') ? (head.league.settings?.playoff_week_start || 15) - 1 : 18
);

const names = new Map(); // user_id -> display name (newest season wins)
const seasonsPlayed = new Map(); // user_id -> Set(season)
for (const L of chain) {
  L.users.forEach((u) => { if (!names.has(u.user_id)) names.set(u.user_id, u.display_name); });
  L.rosters.forEach((r) => {
    if (!r.owner_id) return;
    if (!seasonsPlayed.has(r.owner_id)) seasonsPlayed.set(r.owner_id, new Set());
    seasonsPlayed.get(r.owner_id).add(L.season);
  });
}

// ---------- Q1 & Q2: pickups and trades, history vs current ----------
const events = [];
for (const L of chain) {
  for (const t of L.txns) {
    if (t.type === 'trade') {
      for (const rid of t.roster_ids || []) {
        const uid = L.rosterOwner[rid];
        if (uid) events.push({ uid, season: L.season, leg: t.leg, kind: 'trade' });
      }
    } else if (t.type === 'waiver' || t.type === 'free_agent') {
      for (const rid of Object.values(t.adds || {})) {
        const uid = L.rosterOwner[rid];
        if (uid) events.push({ uid, season: L.season, leg: t.leg, kind: t.type });
      }
    }
  }
}

const results = { league: { id: leagueId, currentSeason: curSeason, seasons: chain.map((c) => c.season) } };

function activityReport(key, title, kinds) {
  const rows = [];
  for (const [uid, seasons] of seasonsPlayed) {
    const hist = [...seasons].filter((s) => s !== curSeason);
    const count = (s, max = 99) =>
      events.filter((e) => e.uid === uid && e.season === s && kinds.includes(e.kind) && e.leg <= max).length;
    const career = [...seasons].reduce((a, s) => a + count(s), 0);
    const cur = seasons.has(curSeason) ? count(curSeason) : null;
    const avgFull = hist.length ? mean(hist.map((s) => count(s))) : null;
    const avgThru = hist.length ? mean(hist.map((s) => count(s, txnThrough))) : null;
    rows.push({
      name: names.get(uid) || uid, uid, seasons: seasons.size, career, cur,
      avgFull, avgThru,
      pace: cur != null && avgThru ? cur / avgThru - 1 : null,
    });
  }
  rows.sort((a, b) => b.career - a.career);
  console.log(`\n=== ${title} ===`);
  console.log(`(Current season ${curSeason}; "avg thru wk ${txnThrough}" = past seasons' average at this same point)\n`);
  table(rows, [
    { h: 'Manager', f: (r) => r.name },
    { h: 'Seasons', f: (r) => r.seasons },
    { h: 'Career', f: (r) => r.career },
    { h: 'Avg/season (completed)', f: (r) => fmt(r.avgFull) },
    { h: `Hist avg thru wk${txnThrough}`, f: (r) => fmt(r.avgThru) },
    { h: 'This season', f: (r) => (r.cur ?? '-') },
    { h: 'vs avg (same pt)', f: (r) => (r.pace == null ? '-' : (r.pace >= 0 ? '+' : '') + fmt(r.pace * 100, 0) + '%') },
  ]);
  results[key] = rows;
}

activityReport('waiverPickups', 'Q1: Waiver claims + free-agent pickups', ['waiver', 'free_agent']);
activityReport('waiverClaimsOnly', 'Q1 (detail): Waiver claims only (no free-agent adds)', ['waiver']);
activityReport('trades', 'Q2: Trades (each trade counts once per team involved)', ['trade']);

// ---------- Q3 & Q4: current-season points by acquisition source ----------
const SOURCES = ['draft', 'waiver', 'free_agent', 'trade', 'other'];
if (!['pre_draft', 'drafting'].includes(head.league.status) && pointsThrough >= 1) {
  const lid = head.id;
  const userRoster = {};
  Object.entries(head.rosterOwner).forEach(([rid, uid]) => { if (uid) userRoster[uid] = Number(rid); });

  // source[rosterId][playerId] = how that roster got the player
  const source = {};
  const rosterIds = Object.keys(head.rosterOwner).map(Number);
  rosterIds.forEach((r) => { source[r] = {}; });
  const drafts = await get(`/league/${lid}/drafts`, false);
  for (const d of drafts) {
    const picks = await safeGet(`/draft/${d.draft_id}/picks`, false);
    for (const p of picks) {
      const rid = p.roster_id ?? userRoster[p.picked_by];
      if (rid != null && p.player_id) (source[rid] ??= {})[p.player_id] = 'draft';
    }
  }

  // Order by the week the move took effect, then by when it processed within that week.
  const txnsSorted = [...head.txns].sort(
    (a, b) => (a.leg || 0) - (b.leg || 0) || (a.status_updated || 0) - (b.status_updated || 0)
  );
  let ti = 0;
  const pts = {}; // rid -> source -> points
  const byPlayer = {}; // rid -> source -> pid -> points
  rosterIds.forEach((r) => { pts[r] = Object.fromEntries(SOURCES.map((s) => [s, 0])); byPlayer[r] = {}; });
  const weeklyPoints = {}; // rid -> total starter points (sanity check)

  for (let w = 1; w <= pointsThrough; w++) {
    // Apply every transaction that took effect on or before this week.
    // Adds apply immediately (a player added this week can start this week), but drops/trade-aways
    // are deferred until AFTER this week is scored: a player who started, then was dropped or
    // traded later the same week, must still be credited to the source he was acquired through.
    const pendingDrops = [];
    while (ti < txnsSorted.length && (txnsSorted[ti].leg || 0) <= w) {
      const t = txnsSorted[ti++];
      const label = t.type === 'waiver' || t.type === 'free_agent' || t.type === 'trade' ? t.type : 'other';
      for (const [pid, rid] of Object.entries(t.drops || {})) pendingDrops.push({ pid, rid });
      for (const [pid, rid] of Object.entries(t.adds || {})) {
        (source[rid] ??= {})[pid] = label;
        // re-added later in the same week after being dropped: the drop no longer applies
        for (let i = pendingDrops.length - 1; i >= 0; i--) {
          if (pendingDrops[i].pid === pid && pendingDrops[i].rid === rid) pendingDrops.splice(i, 1);
        }
      }
    }
    const matchups = await safeGet(`/league/${lid}/matchups/${w}`, false);
    for (const m of matchups) {
      const rid = m.roster_id;
      if (!pts[rid]) continue;
      (m.starters || []).forEach((pid, i) => {
        if (!pid || pid === '0') return;
        const p = Number(m.starters_points?.[i] ?? 0);
        const src = source[rid]?.[pid] || 'other';
        pts[rid][src] += p;
        weeklyPoints[rid] = (weeklyPoints[rid] || 0) + p;
        const bp = ((byPlayer[rid][src] ??= {}));
        bp[pid] = (bp[pid] || 0) + p;
      });
    }
    for (const { pid, rid } of pendingDrops) if (source[rid]) delete source[rid][pid];
  }

  let playerNames = null;
  if (flags.has('--names')) {
    try { playerNames = await get('/players/nfl', true); } catch (e) { console.error('Could not load player names:', e.message); }
  }
  const nameOf = (pid) => {
    const p = playerNames?.[pid];
    return p ? (p.full_name || [p.first_name, p.last_name].filter(Boolean).join(' ') || pid) : pid;
  };
  const best = (rid, src) => {
    const entries = Object.entries(byPlayer[rid]?.[src] || {}).sort((a, b) => b[1] - a[1]);
    return entries.length ? { player: nameOf(entries[0][0]), points: entries[0][1] } : null;
  };

  const rows = rosterIds.filter((r) => head.rosterOwner[r]).map((rid) => {
    const total = Object.values(pts[rid]).reduce((a, b) => a + b, 0);
    return {
      name: names.get(head.rosterOwner[rid]) || String(rid), rid, ...pts[rid], total,
      waiverPlusFA: pts[rid].waiver + pts[rid].free_agent,
      best: Object.fromEntries(SOURCES.map((s) => [s, best(rid, s)])),
    };
  }).sort((a, b) => b.total - a.total);

  console.log(`\n=== Q3 + Q4: ${curSeason} starter points by how the player was acquired (weeks 1-${pointsThrough}) ===`);
  console.log('Only points from players in the starting lineup count, credited to whoever held the player that week.\n');
  const pct = (r, v) => (r.total ? fmt((v / r.total) * 100, 0) + '%' : '-');
  table(rows, [
    { h: 'Manager', f: (r) => r.name },
    { h: 'Draft', f: (r) => fmt(r.draft) },
    { h: 'Waiver', f: (r) => fmt(r.waiver) },
    { h: 'Free agent', f: (r) => fmt(r.free_agent) },
    { h: 'Trade', f: (r) => fmt(r.trade) },
    { h: 'Other', f: (r) => fmt(r.other) },
    { h: 'Total', f: (r) => fmt(r.total) },
    { h: 'Draft %', f: (r) => pct(r, r.draft) },
    { h: 'Waiver+FA %', f: (r) => pct(r, r.waiverPlusFA) },
    { h: 'Trade %', f: (r) => pct(r, r.trade) },
  ]);
  console.log('Best single player per source' + (playerNames ? '' : ' (player IDs; rerun with --names for names)') + ':\n');
  table(rows, [
    { h: 'Manager', f: (r) => r.name },
    { h: 'Draft', f: (r) => (r.best.draft ? `${r.best.draft.player} (${fmt(r.best.draft.points)})` : '-') },
    { h: 'Waiver/FA', f: (r) => {
      const a = r.best.waiver, b = r.best.free_agent;
      const x = a && b ? (a.points >= b.points ? a : b) : a || b;
      return x ? `${x.player} (${fmt(x.points)})` : '-';
    } },
    { h: 'Trade', f: (r) => (r.best.trade ? `${r.best.trade.player} (${fmt(r.best.trade.points)})` : '-') },
  ]);
  results.pointsBySource = { season: curSeason, throughWeek: pointsThrough, rows };
} else {
  console.log('\nCurrent league has not drafted / scored yet, so the points breakdown was skipped.');
}

await fs.writeFile('sleeper-manager-stats.json', JSON.stringify(results, null, 2));
console.log('Full results saved to sleeper-manager-stats.json');
