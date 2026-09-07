<script>
    import { events, eventsIntroText } from '$lib/utils/leagueInfo';

    const getMeta = (event) => [event.date, event.time, event.location].filter(Boolean);
</script>

<style>
    .pageBody {
        position: relative;
        z-index: 1;
        width: 92%;
        max-width: 800px;
        margin: 8em auto 10em;
    }

    h1 {
        font-size: 2em;
        line-height: 1.2em;
        text-align: center;
        margin: 0 0 1.5em;
    }

    .intro {
        color: var(--g555);
        line-height: 1.5em;
        margin: 0 0 2.5em;
    }

    .noEvents {
        text-align: center;
        color: var(--g555);
    }

    .events {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
    }

    .event {
        background-color: var(--fff);
        border-radius: 8px;
        box-shadow: 0 0 8px 0 var(--boxShadowOne);
        padding: 1.5em 2em;
    }

    .eventHeader {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1em;
    }

    .eventTitle {
        margin: 0 0 0.3em;
        color: var(--blueOne);
    }

    .eventPrice {
        flex-shrink: 0;
        background-color: var(--waiverAdd);
        color: #1b7a43;
        padding: 0.3em 0.8em;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.85em;
        white-space: nowrap;
    }

    .eventMeta {
        color: var(--g555);
        font-size: 0.95em;
        margin: 0 0 0.8em;
    }

    .eventMeta span:not(:last-child)::after {
        content: " • ";
    }

    .eventDescription {
        color: var(--g333);
        line-height: 1.5em;
        margin: 0;
    }

    .eventLinks {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6em;
        margin-top: 1em;
    }

    .eventLink {
        display: inline-block;
        padding: 0.4em 1em;
        border-radius: 20px;
        border: 1px solid var(--blueTwo);
        color: var(--blueTwo);
        font-weight: bold;
        font-size: 0.9em;
        text-decoration: none;
    }

    .eventLink:hover {
        background-color: var(--blueTwo);
        color: var(--fff);
    }
</style>

<div class="pageBody">
    <h1>League Events</h1>

    {#if eventsIntroText}
        <div class="intro">{@html eventsIntroText}</div>
    {/if}

    {#if events.length}
        <div class="events">
            {#each events as event}
                <div class="event">
                    <div class="eventHeader">
                        <h3 class="eventTitle">{event.title}</h3>
                        {#if event.startingPrice}
                            <span class="eventPrice">From ${event.startingPrice}</span>
                        {/if}
                    </div>
                    {#if getMeta(event).length}
                        <p class="eventMeta">
                            {#each getMeta(event) as part}
                                <span>{part}</span>
                            {/each}
                        </p>
                    {/if}
                    {#if event.description}
                        <p class="eventDescription">{event.description}</p>
                    {/if}
                    {#if event.links?.length}
                        <div class="eventLinks">
                            {#each event.links as link}
                                <a class="eventLink" href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {:else}
        <p class="noEvents">No events scheduled yet. Check back soon!</p>
    {/if}
</div>
