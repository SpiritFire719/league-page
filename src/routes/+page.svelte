<script>
	import LinearProgress from '@smui/linear-progress';
	import { getNflState, leagueName, getAwards, getLeagueTeamManagers, weeklyRecaps, managers, gotoManager, enableBlog, waitForAll } from '$lib/utils/helper';
	import { Transactions, PowerRankings, HomePost} from '$lib/components';
	import WelcomeModal from '$lib/WelcomeModal.svelte';
	import { getAvatarFromTeamManagers, getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';

    const nflState = getNflState();
    const podiumsData = getAwards();
    const leagueTeamManagersData = getLeagueTeamManagers();

    const latestRecap = weeklyRecaps.length ? weeklyRecaps[weeklyRecaps.length - 1] : null;
    const pastRecaps = weeklyRecaps.length > 1 ? [...weeklyRecaps].slice(0, -1).reverse() : [];
</script>

<style>
    #home {
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        overflow-y: hidden;
        z-index: 1;
    }

    #main {
        flex-grow: 1;
        min-width: 320px;
        margin: 0 auto;
        padding: 60px 0;
    }

    .text {
        padding: 0 30px;
        max-width: 620px;
        margin: 0 auto;
    }

    .leagueData {
        position: relative;
        z-index: 1;
        width: 100%;
        min-width: 470px;
        max-width: 470px;
        min-height: 100%;
		background-color: var(--ebebeb);
        border-left: var(--eee);
		box-shadow: inset 8px 0px 6px -6px rgb(0 0 0 / 24%);
    }

    @media (max-width: 950px) {
        .leagueData {
            max-width: 100%;
            min-width: 100%;
            width: 100%;
		    box-shadow: none;
        }
        #home {
            flex-wrap: wrap;
        }
    }

    .transactions {
        display: block;
        width: 95%;
        margin: 10px auto;
    }

    .center {
        text-align: center;
    }

    h6 {
        text-align: center;
    }

    .recapCard {
        background-color: var(--fff);
        border-radius: 8px;
        box-shadow: 0 0 8px 0 var(--boxShadowOne);
        padding: 1.2em 1.6em;
        margin: 0 0 1em;
    }

    .recapTitle {
        margin: 0 0 0.5em;
        color: var(--blueOne);
    }

    .pastRecaps {
        display: flex;
        flex-direction: column;
        gap: 0.6em;
        margin: 0 0 1.5em;
    }

    .pastRecaps summary {
        cursor: pointer;
        font-weight: bold;
        color: var(--blueOne);
        padding: 0.6em 1em;
        background-color: var(--fff);
        border-radius: 8px;
        box-shadow: 0 0 8px 0 var(--boxShadowOne);
    }

    .pastRecaps details[open] summary {
        border-radius: 8px 8px 0 0;
    }

    .pastRecaps .recapContent {
        padding: 1em 1.6em;
        background-color: var(--fff);
        border-radius: 0 0 8px 8px;
        box-shadow: 0 0 8px 0 var(--boxShadowOne);
    }

    .noRecaps {
        text-align: center;
        color: var(--g555);
    }

    .homeBanner {
        background-color: var(--blueOne);
        color: #fff;
        padding: 0.5em 0;
        font-weight: 500;
        font-size: 1.5em;
    }

    /* champ styling */
    #currentChamp {
        padding: 25px 0;
		background-color: var(--f3f3f3);
        box-shadow: 5px 0 8px var(--champShadow);
        border-left: 1px solid var(--ddd);
    }

    #champ {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0 auto;
        cursor: pointer;
    }

    .first {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border-radius: 100%;
        border: 1px solid #ccc;
        left: 50%;
        top: 43%;
    }

    .laurel {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 135px;
        height: auto;
        left: 50%;
        top: 50%;
    }

    h4 {
        text-align: center;
        font-size: 1.8em;
        margin: 10px;
        font-style: italic;
    }

    .label {
        display: table;
        text-align: center;
        line-height: 1.1em;
        font-size: 1.7em;
        margin: 6px auto 10px;
        cursor: pointer;
    }
    
	:global(.curOwner) {
		font-size: 0.75em;
		color: #bbb;
		font-style: italic;
	}
</style>

<WelcomeModal />

<div id="home">
    <div id="main">
        <div class="text">
            <h6>{leagueName}</h6>
            <!-- Weekly recaps are edited in /src/lib/utils/leagueInfo.js -->
            {#if latestRecap}
                <div class="recapCard">
                    <h3 class="recapTitle">{latestRecap.title}</h3>
                    {@html latestRecap.text}
                </div>
                {#if pastRecaps.length}
                    <div class="pastRecaps">
                        {#each pastRecaps as recap}
                            <details>
                                <summary>{recap.title}</summary>
                                <div class="recapContent">{@html recap.text}</div>
                            </details>
                        {/each}
                    </div>
                {/if}
            {:else}
                <p class="noRecaps">No weekly recaps yet. Check back after Week 1!</p>
            {/if}
            <!-- Most recent Blog Post (if enabled) -->
            {#if enableBlog}
                <HomePost />
            {/if}
        </div>
        <PowerRankings />
    </div>
    
    <div class="leagueData">
        <div class="homeBanner">
            {#await nflState}
                <div class="center">Retrieving NFL state...</div>
                <LinearProgress indeterminate />
            {:then nflStateData}
                <div class="center">NFL {nflStateData.season} 
                    {#if nflStateData.season_type == 'pre'}
                        Preseason
                    {:else if nflStateData.season_type == 'post'}
                        Postseason
                    {:else}
                        Season - {nflStateData.week > 0 ? `Week ${nflStateData.week}` : "Preseason"}
                    {/if}
                </div>
            {:catch error}
                <div class="center">Something went wrong: {error.message}</div>
            {/await}
        </div>

        <div id="currentChamp">
            {#await waitForAll(podiumsData, leagueTeamManagersData)}
                <p class="center">Retrieving awards...</p>
                <LinearProgress indeterminate />
            {:then [podiums, leagueTeamManagers]}
                {#if podiums[0]}
                    <h4>{podiums[0].year} Fantasy Champ</h4>
                    <div id="champ" onclick={() => {if(managers.length) gotoManager({year: podiums[0].year, leagueTeamManagers, rosterID: parseInt(podiums[0].champion)})}} >
                        <img src="{getAvatarFromTeamManagers(leagueTeamManagers, podiums[0].champion, podiums[0].year)}" class="first" alt="champion" />
                        <img src="/laurel.png" class="laurel" alt="laurel" />
                    </div>
                    <span class="label" onclick={() => gotoManager({year: podiums[0].year, leagueTeamManagers, rosterID: parseInt(podiums[0].champion)})} >{getTeamFromTeamManagers(leagueTeamManagers, podiums[0].champion, podiums[0].year).name}</span>
                {:else}
                    <p class="center">No former champs.</p>
                {/if}
            {:catch error}
                <p class="center">Something went wrong: {error.message}</p>
            {/await}
        </div>

        <div class="transactions" >
            <Transactions />
        </div>
    </div>
</div>