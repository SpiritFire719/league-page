<script>
	import LinearProgress from '@smui/linear-progress';
	import { ManagerStats } from '$lib/components';

    export let data;
    const statsData = data.statsData;
</script>

<style>
    #main {
        position: relative;
        z-index: 1;
    }
    .loading {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
    }
</style>

<div id="main">
    {#await statsData}
        <!-- promise is pending -->
        <div class="loading">
            <p>Crunching league history...</p>
            <LinearProgress indeterminate />
        </div>
    {:then [stats, leagueTeamManagers, playersInfo]}
        <ManagerStats {stats} {leagueTeamManagers} {playersInfo} />
    {:catch error}
        <!-- promise was rejected -->
        <p class="center">Something went wrong: {error.message}</p>
    {/await}
</div>
