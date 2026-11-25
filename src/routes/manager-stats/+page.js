import { getManagerStats, getLeagueTeamManagers, loadPlayers, waitForAll } from '$lib/utils/helper';

export async function load({ fetch }) {
    const statsData = waitForAll(
        getManagerStats(),
        getLeagueTeamManagers(),
        loadPlayers(fetch),
    );

    return {
        statsData
    };
}
