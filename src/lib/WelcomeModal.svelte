<script>
    import { leagueName, homepageText, welcomePopupEndDate } from '$lib/utils/helper';

    const storageKey = 'welcomeModalDismissed';
    const withinPopupWindow = welcomePopupEndDate && new Date() < new Date(welcomePopupEndDate);

    let show = $state(false);

    $effect(() => {
        if (withinPopupWindow && !sessionStorage.getItem(storageKey)) {
            show = true;
        }
    });

    const dismiss = () => {
        show = false;
        sessionStorage.setItem(storageKey, 'true');
    }
</script>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .modal {
        position: relative;
        background-color: var(--fff);
        border-radius: 8px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
        max-width: 600px;
        max-height: 80vh;
        width: 100%;
        overflow-y: auto;
        padding: 2em 2.5em;
    }

    h6 {
        text-align: center;
        margin-top: 0;
    }

    .close {
        position: absolute;
        top: 0.6em;
        right: 0.8em;
        background: none;
        border: none;
        font-size: 1.5em;
        line-height: 1;
        cursor: pointer;
        color: var(--g555);
    }

    .close:hover {
        color: var(--g111);
    }

    .hint {
        text-align: center;
        color: var(--g999);
        font-size: 0.85em;
        font-style: italic;
    }
</style>

{#if show}
    <div class="overlay" onclick={dismiss} role="presentation">
        <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button class="close" onclick={dismiss} aria-label="Close">&times;</button>
            <h6>{leagueName}</h6>
            {@html homepageText}
            <p class="hint">You can find this message again anytime from the nav menu under League Info &gt; Welcome Message.</p>
        </div>
    </div>
{/if}
