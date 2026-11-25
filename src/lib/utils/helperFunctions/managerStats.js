import { get } from 'svelte/store';
import { managerStatsStore } from '$lib/stores';
import { getLeagueData } from './leagueData';
import { getNflState } from './nflState';
import { getLeagueTeamManagers } from './leagueTeamManagers';
import { getLeagueMatchups } from './leagueMatchups';
import { getPreviousDrafts } from './leagueDrafts';
import { combThroughTransactions } from './leagueTransactions';
import { waitForAll } from './multiPromise';

// Where a starter came from, in the order the page shows them
export const SOURCES = ['draft', 'waiver', 'free_agent', 'trade', 'other'];

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

/**
 * Per-manager waiver/free-agent/trade activity and current-season starter points by how each
 * player was acquired. Built entirely on the site's existing helpers (league chain, team managers,
 * matchups, drafts, raw transactions) so nothing is fetched twice.
 *
 * Notes on the numbers:
 *  - A "pickup" is a completed waiver claim or free-agent ADD. Drop-only free-agent moves,
 *    failed claims and commissioner moves are not counted.
 *  - A trade counts once for every team involved.
 *  - Points are regular-season starter points only (what getLeagueMatchups provides), credited to
 *    whoever held the player that week.
 */
export const getManagerStats = async () => {
	const cached = get(managerStatsStore);
	if(cached.currentSeason) {
		return cached;
	}

	const [nflState, leagueData, leagueTeamManagers] = await waitForAll(
		getNflState(),
		getLeagueData(),
		getLeagueTeamManagers(),
	);

	const currentSeason = parseInt(leagueData.season);
	const leagueComplete = leagueData.status == 'complete';
	const { teamManagersMap, users } = leagueTeamManagers;

	// transactions are compared "as of the same week" in every past season
	const txnThrough = leagueComplete ? 18 : Math.min(18, nflState.week || 18);

	const fetchWeek = nflState.season_type == 'regular' ? nflState.week : 18;
	const { transactionsData, leagueIDs } = await combThroughTransactions(fetchWeek, leagueData.league_id);

	const seasonByLeagueID = {};
	const leagueDatas = await waitForAll(...leagueIDs.map((id) => getLeagueData(id)));
	leagueDatas.forEach((ld, i) => { seasonByLeagueID[leagueIDs[i]] = parseInt(ld.season); });

	const completed = transactionsData.filter((t) => t && t.status == 'complete');

	const managersOf = (season, rosterID) => teamManagersMap[season]?.[rosterID]?.managers ?? [];

	// which seasons each manager has played
	const seasonsPlayed = {};
	for(const season in teamManagersMap) {
		for(const rosterID in teamManagersMap[season]) {
			for(const uid of teamManagersMap[season][rosterID].managers) {
				if(!seasonsPlayed[uid]) seasonsPlayed[uid] = new Set();
				seasonsPlayed[uid].add(parseInt(season));
			}
		}
	}
	const currentManagers = new Set();
	for(const rosterID in teamManagersMap[currentSeason]) {
		teamManagersMap[currentSeason][rosterID].managers.forEach((uid) => currentManagers.add(uid));
	}

	// one event per manager per pickup / trade
	const events = [];
	for(const t of completed) {
		const season = seasonByLeagueID[t.league_id];
		if(t.type == 'trade') {
			for(const rosterID of t.roster_ids || []) {
				for(const uid of managersOf(season, rosterID)) {
					events.push({ uid, season, leg: t.leg, kind: 'trade' });
				}
			}
		} else if(t.type == 'waiver' || t.type == 'free_agent') {
			for(const rosterID of Object.values(t.adds || {})) {
				for(const uid of managersOf(season, rosterID)) {
					events.push({ uid, season, leg: t.leg, kind: t.type });
				}
			}
		}
	}

	const activityRows = (kinds) => {
		const rows = [];
		for(const uid in seasonsPlayed) {
			const seasons = [...seasonsPlayed[uid]];
			const history = seasons.filter((s) => s != currentSeason);
			const count = (season, kindList = kinds, maxLeg = 99) =>
				events.filter((e) => e.uid == uid && e.season == season && kindList.includes(e.kind) && e.leg <= maxLeg).length;

			const breakdown = {};
			for(const kind of kinds) {
				breakdown[kind] = seasons.reduce((total, s) => total + count(s, [kind]), 0);
			}

			const thisSeason = seasons.includes(currentSeason) ? count(currentSeason) : null;
			const histAvgFull = history.length ? mean(history.map((s) => count(s))) : null;
			const histAvgThru = history.length ? mean(history.map((s) => count(s, kinds, txnThrough))) : null;

			rows.push({
				managerID: uid,
				name: users[uid]?.display_name ?? uid,
				avatar: users[uid]?.avatar ? `https://sleepercdn.com/avatars/thumbs/${users[uid].avatar}` : null,
				former: !currentManagers.has(uid),
				seasons: seasons.length,
				career: seasons.reduce((total, s) => total + count(s), 0),
				breakdown,
				thisSeason,
				histAvgFull,
				histAvgThru,
				pace: thisSeason != null && histAvgThru ? thisSeason / histAvgThru - 1 : null,
			});
		}
		return rows.sort((a, b) => b.career - a.career || a.name.localeCompare(b.name));
	};

	const pickups = activityRows(['waiver', 'free_agent']);
	const trades = activityRows(['trade']);

	const { points, pointsThrough, draftMissing } = await getPointsBySource({
		leagueData, leagueTeamManagers, currentSeason, leagueComplete, nflState,
		transactions: completed.filter((t) => t.league_id == leagueData.league_id),
	});

	const response = { currentSeason, seasons: Object.keys(teamManagersMap).map(Number).sort(), txnThrough, pointsThrough, draftMissing, pickups, trades, points };
	managerStatsStore.update(() => response);
	return response;
};

const getPointsBySource = async ({ leagueData, leagueTeamManagers, currentSeason, leagueComplete, nflState, transactions }) => {
	const rosterIDs = Object.keys(leagueTeamManagers.teamManagersMap[currentSeason] ?? {}).map(Number);
	const regularSeasonLength = leagueData.settings.playoff_week_start - 1;
	const pointsThrough = Math.min(
		regularSeasonLength,
		leagueData.settings.last_scored_leg || (leagueComplete ? regularSeasonLength : Math.max(0, (nflState.week || 1) - 1)),
	);

	if(leagueData.status == 'pre_draft' || leagueData.status == 'drafting' || pointsThrough < 1) {
		return { points: [], pointsThrough: 0, draftMissing: false };
	}

	const [{ matchupWeeks }, drafts] = await waitForAll(getLeagueMatchups(), getPreviousDrafts());

	// source[rosterID][playerID] = how that roster acquired the player
	const source = {};
	rosterIDs.forEach((rid) => { source[rid] = {}; });

	const draft = drafts.find((d) => d.year == currentSeason);
	if(draft) {
		draft.draft.forEach((round) => {
			round.forEach((cell, col) => {
				if(!cell || !cell.player) return;
				const rid = Number(cell.newOwner ?? draft.draftOrder[col]);
				if(source[rid]) source[rid][cell.player] = 'draft';
			});
		});
	}

	// order by the week the move took effect, then by when it processed within that week
	const sorted = [...transactions].sort((a, b) => (a.leg || 0) - (b.leg || 0) || (a.status_updated || 0) - (b.status_updated || 0));
	let next = 0;

	const pts = {};
	const byPlayer = {};
	rosterIDs.forEach((rid) => {
		pts[rid] = Object.fromEntries(SOURCES.map((s) => [s, 0]));
		byPlayer[rid] = {};
	});

	const weeks = [...matchupWeeks].filter((w) => w.week <= pointsThrough).sort((a, b) => a.week - b.week);

	for(const { week, matchups } of weeks) {
		// Adds apply right away (a player added this week can start this week). Drops and trade-aways
		// wait until this week is scored, so a player who started and was then dropped or traded later
		// in the same week is still credited to the way he was originally acquired.
		const pendingDrops = [];
		while(next < sorted.length && (sorted[next].leg || 0) <= week) {
			const t = sorted[next++];
			const label = ['waiver', 'free_agent', 'trade'].includes(t.type) ? t.type : 'other';
			for(const [pid, rid] of Object.entries(t.drops || {})) pendingDrops.push({ pid, rid: Number(rid) });
			for(const [pid, rid] of Object.entries(t.adds || {})) {
				if(!source[rid]) source[rid] = {};
				source[rid][pid] = label;
				// dropped earlier this week, then added back: the drop no longer applies
				for(let i = pendingDrops.length - 1; i >= 0; i--) {
					if(pendingDrops[i].pid == pid && pendingDrops[i].rid == Number(rid)) pendingDrops.splice(i, 1);
				}
			}
		}

		for(const matchupID in matchups) {
			for(const side of matchups[matchupID]) {
				const rid = side.roster_id;
				if(!pts[rid]) continue;
				(side.starters || []).forEach((pid, i) => {
					if(!pid || pid == '0') return;
					const p = Number(side.points?.[i] ?? 0);
					const src = source[rid]?.[pid] || 'other';
					pts[rid][src] += p;
					byPlayer[rid][src] = byPlayer[rid][src] ?? {};
					byPlayer[rid][src][pid] = (byPlayer[rid][src][pid] || 0) + p;
				});
			}
		}

		for(const { pid, rid } of pendingDrops) if(source[rid]) delete source[rid][pid];
	}

	const bestOf = (rid, src) => {
		const entries = Object.entries(byPlayer[rid][src] || {}).sort((a, b) => b[1] - a[1]);
		return entries.length ? { playerID: entries[0][0], points: entries[0][1] } : null;
	};

	const points = rosterIDs.map((rid) => {
		const total = Object.values(pts[rid]).reduce((a, b) => a + b, 0);
		return {
			rosterID: rid,
			...pts[rid],
			total,
			best: Object.fromEntries(SOURCES.map((s) => [s, bestOf(rid, s)])),
		};
	}).sort((a, b) => b.total - a.total);

	return { points, pointsThrough, draftMissing: !draft };
};
