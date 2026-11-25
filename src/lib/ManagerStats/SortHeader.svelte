<script>
    import { Cell } from '@smui/data-table';

    // sort is the table's current {key, dir}; onsort(key) is called when the heading is clicked
    export let label, key, sort, onsort;

    $: active = sort.key === key;
    $: ariaSort = active ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none';
</script>

<style>
    .sortBtn {
        all: unset;
        cursor: pointer;
        display: inline-block;
        text-align: center;
        white-space: normal;
        line-height: 1.2em;
        font: inherit;
        color: inherit;
    }

    .sortBtn:hover,
    .sortBtn:focus-visible {
        text-decoration: underline;
    }

    .arrow {
        display: inline-block;
        width: 1em;
        font-size: 0.7em;
        opacity: 0.25;
    }

    .active .arrow {
        opacity: 1;
    }
</style>

<Cell class="center" aria-sort={ariaSort}>
    <button type="button" class="sortBtn" class:active onclick={() => onsort(key)}>
        {label}<span class="arrow">{active ? (sort.dir > 0 ? '▲' : '▼') : '↕'}</span>
    </button>
</Cell>
