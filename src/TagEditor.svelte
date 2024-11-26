<script>
    import { settings } from './lib/stores';
    import Tags from './lib/input/Tags.svelte';
    
    let availableTags = Object.keys($settings.tags);
    export let source = {};

    $: sourceHasTags = Object.hasOwn(source, 'tags');

</script>

<style>
    h3 {
        margin-top:10px;
    }
</style>

{#if sourceHasTags}
    <h3>Selected</h3>
    <Tags tags={source.tags} disabled={true}/>


    <h3>Choose Tags</h3>
    <Tags name='edit-tags' tags={availableTags} bind:selected={source.tags}/>
{:else}
    <p>This provided source has no tags</p>
{/if}