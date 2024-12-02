<script>
    import { createEventDispatcher } from "svelte";

    import DeleteIcon from "./lib/icons/bin.svelte";
    import SaveIcon from "./lib/icons/save.svelte";
    import Duration from "./lib/input/Duration.svelte";
    import OccurredAt from "./lib/input/OccurredAt.svelte";

    const dispatch = createEventDispatcher();

    export let log;
    export let disabled = false;
</script>

<style>
    textarea {
        width: 100%;
    }
</style>

{#if log}
<article>
    <header>
        <button class="icon" on:click={() => dispatch('save')}>
            <SaveIcon/>
        </button>
        <button class="icon" on:click={() => dispatch('remove', {log: log})}>
            <DeleteIcon/>
        </button>
    </header>
    <OccurredAt disabled={disabled} bind:occurredAt={log.occurredAt}/>
    <Duration 
        label='duration'
        name='log-entry-duration'
        disabled={disabled}
        bind:durationType={log.durationType}
        bind:durationIncrement={log.durationIncrement}/>
    <label for='log-entry-text'>Note:</label>
    <textarea name='log-entry-text' type='textarea' rows='2' bind:value={log.text}></textarea>
</article>
{:else}
 Logs maaate! You're Joking!
{/if}