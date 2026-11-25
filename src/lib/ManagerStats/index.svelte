<script>
    import { leagueName, gotoManager, getTeamFromTeamManagers } from '$lib/utils/helper';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import SortHeader from './SortHeader.svelte';

    export let stats, leagueTeamManagers, playersInfo;

    const { currentSeason, txnThrough, pointsThrough, draftMissing, pickups, trades, points } = stats;
    const players = playersInfo.players;

    const fmt = (n, digits = 1) => (Number.isFinite(n) ? n.toFixed(digits) : '-');
    const pace = (p) => (p == null ? '-' : `${p >= 0 ? '+' : ''}${fmt(p * 100, 0)}%`);
    const money = (n, digits = 0) => (Number.isFinite(n) ? `$${n.toFixed(digits)}` : '-');

    // base order for the FAAB table: biggest spenders first, so managers with no points-per-dollar
    // value keep a sensible order when sorting by it
    const faabRows = [...pickups].sort((a, b) => (b.faab.thisSeason ?? -1) - (a.faab.thisSeason ?? -1));
    const pct = (part, total) => (total ? `${fmt((part / total) * 100, 0)}%` : '-');

    const playerName = (pid) => {
        const p = players[pid];
        if(!p) return pid;
        return [p.fn, p.ln].filter(Boolean).join(' ') || pid;
    };

    // best single player per source, waiver and free agent merged
    const bestLabel = (best) => (best ? `${playerName(best.playerID)} (${fmt(best.points)})` : '-');
    const bestWaiverOrFA = (row) => {
        const { waiver, free_agent } = row.best;
        if(waiver && free_agent) return waiver.points >= free_agent.points ? waiver : free_agent;
        return waiver || free_agent;
    };

    // ---- sorting ----
    // Each table has a map of column key -> the value to sort on (null/NaN always sorts last).
    const teamName = (rosterID) => getTeamFromTeamManagers(leagueTeamManagers, rosterID).name;
    const share = (part, total) => (total ? part / total : null);

    const columns = {
        pickups: {
            manager: (r) => r.name, seasons: (r) => r.seasons, career: (r) => r.career,
            waiver: (r) => r.breakdown.waiver, fa: (r) => r.breakdown.free_agent,
            avg: (r) => r.histAvgFull, thru: (r) => r.histAvgThru, cur: (r) => r.thisSeason, pace: (r) => r.pace,
            curWaiver: (r) => r.byKind.waiver.thisSeason, curFA: (r) => r.byKind.free_agent.thisSeason,
            thruWaiver: (r) => r.byKind.waiver.histAvgThru,
        },
        faab: {
            manager: (r) => r.name, spent: (r) => r.faab.thisSeason, avg: (r) => r.faab.histAvgFull,
            thru: (r) => r.faab.histAvgThru, pace: (r) => r.faab.pace,
            wpts: (r) => r.faab.waiverPoints, ppd: (r) => r.faab.pointsPerDollar,
        },
        trades: {
            manager: (r) => r.name, seasons: (r) => r.seasons, career: (r) => r.career,
            avg: (r) => r.histAvgFull, thru: (r) => r.histAvgThru, cur: (r) => r.thisSeason, pace: (r) => r.pace,
        },
        points: {
            team: (r) => teamName(r.rosterID), draft: (r) => r.draft, waiver: (r) => r.waiver,
            free_agent: (r) => r.free_agent, trade: (r) => r.trade, other: (r) => r.other, total: (r) => r.total,
            draftPct: (r) => share(r.draft, r.total), waiverFAPct: (r) => share(r.waiver + r.free_agent, r.total),
            tradePct: (r) => share(r.trade, r.total),
        },
        best: {
            team: (r) => teamName(r.rosterID), draft: (r) => r.best.draft?.points,
            waiverFA: (r) => bestWaiverOrFA(r)?.points, trade: (r) => r.best.trade?.points,
        },
    };

    // dir: -1 = high to low, 1 = low to high. A null key keeps the table's original order.
    let sorts = {
        pickups: { key: 'career', dir: -1 },
        faab: { key: 'ppd', dir: -1 },
        trades: { key: 'career', dir: -1 },
        points: { key: 'total', dir: -1 },
        best: { key: null, dir: -1 },
    };

    // names read A-Z first, numbers high-to-low first; clicking the active column flips it
    const setSort = (table, key) => {
        const current = sorts[table];
        const dir = current.key == key ? -current.dir : (key == 'manager' || key == 'team' ? 1 : -1);
        sorts[table] = { key, dir };
    };

    const sortRows = (rows, accessors, { key, dir }) => {
        if(!key) return rows;
        const get = accessors[key];
        return [...rows].sort((a, b) => {
            const x = get(a), y = get(b);
            const xMissing = x == null || Number.isNaN(x), yMissing = y == null || Number.isNaN(y);
            if(xMissing || yMissing) return xMissing == yMissing ? 0 : (xMissing ? 1 : -1);
            return typeof x == 'string' ? dir * x.localeCompare(y) : dir * (x - y);
        });
    };

    $: sortedPickups = sortRows(pickups, columns.pickups, sorts.pickups);
    $: sortedFaab = sortRows(faabRows, columns.faab, sorts.faab);
    $: sortedTrades = sortRows(trades, columns.trades, sorts.trades);
    $: sortedPoints = sortRows(points, columns.points, sorts.points);
    $: sortedBest = sortRows(points, columns.best, sorts.best);
</script>

<style>
    h1 {
        font-size: 2.2em;
        line-height: 1.3em;
        margin: 1.5em 0 0.5em;
    }

    h2 {
        font-size: 1.6em;
        line-height: 1.3em;
        margin: 1.5em 0 0.25em;
    }

    h3 {
        font-size: 1.15em;
        margin: 1.5em 0 0.5em;
    }

    .intro, .note {
        max-width: 760px;
        margin: 0 auto 1em;
        padding: 0 1em;
        color: var(--g555);
        font-size: 0.9em;
        line-height: 1.4em;
    }

    .note {
        margin-top: 0.75em;
        font-size: 0.8em;
    }

    .statsTable {
        max-width: 100%;
        overflow-x: auto;
        margin: 0.5em 0 1em;
    }

    :global(.contrastRow) {
        background-color: var(--f8f8f8);
    }

    :global(.center) {
        text-align: center;
    }

    :global(.wrappable) {
        white-space: normal;
        line-height: 1.2em;
    }

    .manager {
        display: flex;
        align-items: center;
        gap: 12px;
        text-align: left;
    }

    .clickable {
        cursor: pointer;
    }

    .avatar {
        border-radius: 50%;
        height: 36px;
        width: 36px;
        border: 0.25px solid #777;
        flex: none;
    }

    .former {
        color: var(--g999);
        font-size: 0.8em;
    }

    .up {
        color: #2e7d32;
    }

    .down {
        color: #c62828;
    }

    .bold {
        font-weight: bold;
    }
</style>

<h1>{leagueName} Manager Stats</h1>
<p class="intro">
    How active each manager is on the waiver wire and in the trade market, and where this season's
    starting lineup points really came from. Seasons shown: {stats.seasons[0]}&ndash;{currentSeason}. Click any column heading to sort.
</p>

<!-- ============================== PICKUPS ============================== -->
<h2>Pickups</h2>
<p class="intro">Completed waiver claims and free-agent adds, all-time and against each manager's own history.</p>
<div class="statsTable">
    <DataTable table$aria-label="Waiver and free agent pickups">
        <Head>
            <Row>
                <SortHeader label={`Manager`} key="manager" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`Seasons`} key="seasons" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`Career`} key="career" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`Career waiver claims`} key="waiver" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`Career FA adds`} key="fa" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`Avg / past season`} key="avg" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`Past avg thru wk ${txnThrough}`} key="thru" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`${currentSeason}`} key="cur" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`${currentSeason} waiver claims`} key="curWaiver" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`${currentSeason} FA adds`} key="curFA" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`Past avg waiver claims thru wk ${txnThrough}`} key="thruWaiver" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
                <SortHeader label={`vs own avg`} key="pace" sort={sorts.pickups} onsort={(k) => setSort('pickups', k)} />
            </Row>
        </Head>
        <Body>
            {#each sortedPickups as row (row.managerID)}
                <Row class="contrastRow">
                    <Cell>
                        <div class="manager" class:clickable={!row.former} onclick={() => !row.former && gotoManager({leagueTeamManagers, managerID: row.managerID})}>
                            {#if row.avatar}<img alt="manager avatar" class="avatar" src={row.avatar} />{/if}
                            <div>
                                {row.name}
                                {#if row.former}<div class="former">former manager</div>{/if}
                            </div>
                        </div>
                    </Cell>
                    <Cell class="center">{row.seasons}</Cell>
                    <Cell class="center bold">{row.career}</Cell>
                    <Cell class="center">{row.breakdown.waiver}</Cell>
                    <Cell class="center">{row.breakdown.free_agent}</Cell>
                    <Cell class="center">{fmt(row.histAvgFull)}</Cell>
                    <Cell class="center">{fmt(row.histAvgThru)}</Cell>
                    <Cell class="center">{row.thisSeason ?? '-'}</Cell>
                    <Cell class="center">{row.byKind.waiver.thisSeason ?? '-'}</Cell>
                    <Cell class="center">{row.byKind.free_agent.thisSeason ?? '-'}</Cell>
                    <Cell class="center">{fmt(row.byKind.waiver.histAvgThru)}</Cell>
                    <Cell class="center {row.pace == null ? '' : row.pace >= 0 ? 'up' : 'down'}">{pace(row.pace)}</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
</div>
<p class="note">
    Drop-only moves, failed claims and commissioner moves aren't counted. "vs own avg" compares this season's
    waiver claims and free-agent adds combined to the same manager's past seasons through week {txnThrough}.
</p>

<h3>FAAB spending</h3>
<div class="statsTable">
    <DataTable table$aria-label="FAAB spending and points per dollar">
        <Head>
            <Row>
                <SortHeader label={`Manager`} key="manager" sort={sorts.faab} onsort={(k) => setSort('faab', k)} />
                <SortHeader label={`${currentSeason} spent`} key="spent" sort={sorts.faab} onsort={(k) => setSort('faab', k)} />
                <SortHeader label={`Avg spent / past season`} key="avg" sort={sorts.faab} onsort={(k) => setSort('faab', k)} />
                <SortHeader label={`Past avg thru wk ${txnThrough}`} key="thru" sort={sorts.faab} onsort={(k) => setSort('faab', k)} />
                <SortHeader label={`vs own avg`} key="pace" sort={sorts.faab} onsort={(k) => setSort('faab', k)} />
                <SortHeader label={`${currentSeason} waiver pts`} key="wpts" sort={sorts.faab} onsort={(k) => setSort('faab', k)} />
                <SortHeader label={`Pts per $`} key="ppd" sort={sorts.faab} onsort={(k) => setSort('faab', k)} />
            </Row>
        </Head>
        <Body>
            {#each sortedFaab as row (row.managerID)}
                <Row class="contrastRow">
                    <Cell>
                        <div class="manager" class:clickable={!row.former} onclick={() => !row.former && gotoManager({leagueTeamManagers, managerID: row.managerID})}>
                            {#if row.avatar}<img alt="manager avatar" class="avatar" src={row.avatar} />{/if}
                            <div>
                                {row.name}
                                {#if row.former}<div class="former">former manager</div>{/if}
                            </div>
                        </div>
                    </Cell>
                    <Cell class="center bold">{money(row.faab.thisSeason)}</Cell>
                    <Cell class="center">{money(row.faab.histAvgFull, 1)}</Cell>
                    <Cell class="center">{money(row.faab.histAvgThru, 1)}</Cell>
                    <Cell class="center {row.faab.pace == null ? '' : row.faab.pace >= 0 ? 'up' : 'down'}">{pace(row.faab.pace)}</Cell>
                    <Cell class="center">{fmt(row.faab.waiverPoints)}</Cell>
                    <Cell class="center bold">{fmt(row.faab.pointsPerDollar, 2)}</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
</div>
<p class="note">
    FAAB dollars are the winning bids on waiver claims; free-agent adds cost nothing. Points per $ is this season's
    starter points from waiver-acquired players divided by the FAAB spent on all of this season's claims, including
    players who never started or were later dropped. It's blank for managers who haven't spent anything. A season's spend can top $100 when a manager was traded extra FAAB.
</p>

<!-- ============================== TRADES ============================== -->
<h2>Trades</h2>
<p class="intro">A trade counts once for every team involved.</p>
<div class="statsTable">
    <DataTable table$aria-label="Trades">
        <Head>
            <Row>
                <SortHeader label={`Manager`} key="manager" sort={sorts.trades} onsort={(k) => setSort('trades', k)} />
                <SortHeader label={`Seasons`} key="seasons" sort={sorts.trades} onsort={(k) => setSort('trades', k)} />
                <SortHeader label={`Career`} key="career" sort={sorts.trades} onsort={(k) => setSort('trades', k)} />
                <SortHeader label={`Avg / past season`} key="avg" sort={sorts.trades} onsort={(k) => setSort('trades', k)} />
                <SortHeader label={`Past avg thru wk ${txnThrough}`} key="thru" sort={sorts.trades} onsort={(k) => setSort('trades', k)} />
                <SortHeader label={`${currentSeason}`} key="cur" sort={sorts.trades} onsort={(k) => setSort('trades', k)} />
                <SortHeader label={`vs own avg`} key="pace" sort={sorts.trades} onsort={(k) => setSort('trades', k)} />
            </Row>
        </Head>
        <Body>
            {#each sortedTrades as row (row.managerID)}
                <Row class="contrastRow">
                    <Cell>
                        <div class="manager" class:clickable={!row.former} onclick={() => !row.former && gotoManager({leagueTeamManagers, managerID: row.managerID})}>
                            {#if row.avatar}<img alt="manager avatar" class="avatar" src={row.avatar} />{/if}
                            <div>
                                {row.name}
                                {#if row.former}<div class="former">former manager</div>{/if}
                            </div>
                        </div>
                    </Cell>
                    <Cell class="center">{row.seasons}</Cell>
                    <Cell class="center bold">{row.career}</Cell>
                    <Cell class="center">{fmt(row.histAvgFull)}</Cell>
                    <Cell class="center">{fmt(row.histAvgThru)}</Cell>
                    <Cell class="center">{row.thisSeason ?? '-'}</Cell>
                    <Cell class="center {row.pace == null ? '' : row.pace >= 0 ? 'up' : 'down'}">{pace(row.pace)}</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
</div>

<!-- ============================== POINTS BY SOURCE ============================== -->
<h2>Points by Source</h2>
{#if points.length == 0}
    <p class="intro">No scored weeks yet this season, so there is nothing to break down.</p>
{:else}
    <p class="intro">
        {currentSeason} starter points (weeks 1&ndash;{pointsThrough}) by how each player got onto the roster.
        Only players in the starting lineup count, credited to whoever held them that week.
    </p>
    <div class="statsTable">
        <DataTable table$aria-label="Starter points by acquisition source">
            <Head>
            <Row>
                <SortHeader label={`Team`} key="team" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Draft`} key="draft" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Waiver`} key="waiver" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Free agent`} key="free_agent" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Trade`} key="trade" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Other`} key="other" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Total`} key="total" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Draft %`} key="draftPct" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Waiver + FA %`} key="waiverFAPct" sort={sorts.points} onsort={(k) => setSort('points', k)} />
                <SortHeader label={`Trade %`} key="tradePct" sort={sorts.points} onsort={(k) => setSort('points', k)} />
            </Row>
        </Head>
            <Body>
                {#each sortedPoints as row (row.rosterID)}
                    {@const team = getTeamFromTeamManagers(leagueTeamManagers, row.rosterID)}
                    <Row class="contrastRow">
                        <Cell>
                            <div class="manager clickable" onclick={() => gotoManager({leagueTeamManagers, rosterID: row.rosterID})}>
                                <img alt="team avatar" class="avatar" src={team.avatar} />
                                <div>{team.name}</div>
                            </div>
                        </Cell>
                        <Cell class="center">{fmt(row.draft)}</Cell>
                        <Cell class="center">{fmt(row.waiver)}</Cell>
                        <Cell class="center">{fmt(row.free_agent)}</Cell>
                        <Cell class="center">{fmt(row.trade)}</Cell>
                        <Cell class="center">{fmt(row.other)}</Cell>
                        <Cell class="center bold">{fmt(row.total)}</Cell>
                        <Cell class="center">{pct(row.draft, row.total)}</Cell>
                        <Cell class="center">{pct(row.waiver + row.free_agent, row.total)}</Cell>
                        <Cell class="center">{pct(row.trade, row.total)}</Cell>
                    </Row>
                {/each}
            </Body>
        </DataTable>
    </div>
    <p class="note">
        Regular season only. "Other" is anything not drafted, claimed, picked up or traded for (for example a commissioner move){#if draftMissing}, plus everyone drafted, because the {currentSeason} draft isn't available yet{/if}.
    </p>

    <h3>Best single player per source</h3>
    <div class="statsTable">
        <DataTable table$aria-label="Best player per acquisition source">
            <Head>
            <Row>
                <SortHeader label={`Team`} key="team" sort={sorts.best} onsort={(k) => setSort('best', k)} />
                <SortHeader label={`Draft`} key="draft" sort={sorts.best} onsort={(k) => setSort('best', k)} />
                <SortHeader label={`Waiver / FA`} key="waiverFA" sort={sorts.best} onsort={(k) => setSort('best', k)} />
                <SortHeader label={`Trade`} key="trade" sort={sorts.best} onsort={(k) => setSort('best', k)} />
            </Row>
        </Head>
            <Body>
                {#each sortedBest as row (row.rosterID)}
                    {@const team = getTeamFromTeamManagers(leagueTeamManagers, row.rosterID)}
                    <Row class="contrastRow">
                        <Cell>
                            <div class="manager clickable" onclick={() => gotoManager({leagueTeamManagers, rosterID: row.rosterID})}>
                                <img alt="team avatar" class="avatar" src={team.avatar} />
                                <div>{team.name}</div>
                            </div>
                        </Cell>
                        <Cell class="center">{bestLabel(row.best.draft)}</Cell>
                        <Cell class="center">{bestLabel(bestWaiverOrFA(row))}</Cell>
                        <Cell class="center">{bestLabel(row.best.trade)}</Cell>
                    </Row>
                {/each}
            </Body>
        </DataTable>
    </div>
{/if}
