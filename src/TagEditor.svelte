<script>
    import { settings } from './lib/stores';
    import Tags from './lib/input/Tags.svelte';
    
    let availableTags = Object.keys($settings.tags);
    export let source = {};

    $: sourceHasTags = Object.hasOwn(source, 'tags');

</script>

{#if sourceHasTags}
    <Tags tags={availableTags} bind:selected={source.tags}/>
{:else}
    <p>This provided source has no tags</p>
{/if}