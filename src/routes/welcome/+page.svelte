<script>
    import { leagueName, homepageText } from '$lib/utils/helper';
</script>

<style>
    .pageBody {
        position: relative;
        z-index: 1;
        width: 92%;
        max-width: 700px;
        margin: 8em auto 10em;
    }

    h1 {
        font-size: 2em;
        line-height: 1.2em;
        text-align: center;
        margin: 0 0 0.2em;
    }

    h6 {
        text-align: center;
        color: var(--g555);
        margin: 0 0 2em;
    }
</style>

<div class="pageBody">
    <h1>Welcome Message</h1>
    <h6>{leagueName}</h6>
    {@html homepageText}
</div>
