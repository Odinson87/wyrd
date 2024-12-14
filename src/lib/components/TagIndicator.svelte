<script>
    import { settings } from '../stores.js';

    export let tags = [];

    $: count = tags.length;
</script>

<style>
    .tag-indicator {
        position:absolute;
        top: -5px;
        left: -2px;
        width: 101%;
        border-radius: 4px 4px 0 0;
        overflow: hidden;
        display:flex;
    }

    span {
        display: inline-block;
    }
</style>

<div class='tag-indicator'>
    {#each tags as tagName}
        <span style='border: 3px solid {$settings.tags[tagName].hex}; width: { 100/count }%;' />
    {/each}
</div>