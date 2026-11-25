<script>
    import { leagueName, gotoManager, getTeamFromTeamManagers } from '$lib/utils/helper';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

    export let stats, leagueTeamManagers, playersInfo;

    const { currentSeason, txnThrough, pointsThrough, draftMissing, pickups, trades, points } = stats;
    const players = playersInfo.players;

    const fmt = (n, digits = 1) => (Number.isFinite(n) ? n.toFixed(digits) : '-');
    const pace = (p) => (p == null ? '-' : `${p >= 0 ? '+' : ''}${fmt(p * 100, 0)}%`);
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
    starting lineup points really came from. Seasons shown: {stats.seasons[0]}&ndash;{currentSeason}.
</p>

<!-- ============================== PICKUPS ============================== -->
<h2>Pickups</h2>
<p class="intro">Completed waiver claims and free-agent adds, all-time and against each manager's own history.</p>
<div class="statsTable">
    <DataTable table$aria-label="Waiver and free agent pickups">
        <Head>
            <Row>
                <Cell class="center">Manager</Cell>
                <Cell class="center wrappable">Seasons</Cell>
                <Cell class="center wrappable">Career</Cell>
                <Cell class="center wrappable">Waiver claims</Cell>
                <Cell class="center wrappable">FA adds</Cell>
                <Cell class="center wrappable">Avg / past season</Cell>
                <Cell class="center wrappable">Past avg thru wk {txnThrough}</Cell>
                <Cell class="center wrappable">{currentSeason}</Cell>
                <Cell class="center wrappable">vs own avg</Cell>
            </Row>
        </Head>
        <Body>
            {#each pickups as row (row.managerID)}
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
                    <Cell class="center {row.pace == null ? '' : row.pace >= 0 ? 'up' : 'down'}">{pace(row.pace)}</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
</div>
<p class="note">
    Drop-only moves, failed claims and commissioner moves aren't counted. "vs own avg" compares this season
    so far to the same manager's past seasons through week {txnThrough}.
</p>

<!-- ============================== TRADES ============================== -->
<h2>Trades</h2>
<p class="intro">A trade counts once for every team involved.</p>
<div class="statsTable">
    <DataTable table$aria-label="Trades">
        <Head>
            <Row>
                <Cell class="center">Manager</Cell>
                <Cell class="center wrappable">Seasons</Cell>
                <Cell class="center wrappable">Career</Cell>
                <Cell class="center wrappable">Avg / past season</Cell>
                <Cell class="center wrappable">Past avg thru wk {txnThrough}</Cell>
                <Cell class="center wrappable">{currentSeason}</Cell>
                <Cell class="center wrappable">vs own avg</Cell>
            </Row>
        </Head>
        <Body>
            {#each trades as row (row.managerID)}
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
                    <Cell class="center">Team</Cell>
                    <Cell class="center wrappable">Draft</Cell>
                    <Cell class="center wrappable">Waiver</Cell>
                    <Cell class="center wrappable">Free agent</Cell>
                    <Cell class="center wrappable">Trade</Cell>
                    <Cell class="center wrappable">Other</Cell>
                    <Cell class="center wrappable">Total</Cell>
                    <Cell class="center wrappable">Draft %</Cell>
                    <Cell class="center wrappable">Waiver + FA %</Cell>
                    <Cell class="center wrappable">Trade %</Cell>
                </Row>
            </Head>
            <Body>
                {#each points as row (row.rosterID)}
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
                    <Cell class="center">Team</Cell>
                    <Cell class="center wrappable">Draft</Cell>
                    <Cell class="center wrappable">Waiver / FA</Cell>
                    <Cell class="center wrappable">Trade</Cell>
                </Row>
            </Head>
            <Body>
                {#each points as row (row.rosterID)}
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
