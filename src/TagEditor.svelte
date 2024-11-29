<script>
    import { settings } from './lib/stores';
    import TagCheckboxBar from './lib/input/TagCheckboxBar.svelte';
    
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
    <TagCheckboxBar tags={source.tags} disabled={true}/>


    <h3>Choose Tags</h3>
    <TagCheckboxBar name='edit-tags' tags={availableTags} bind:selected={source.tags}/>
{:else}
    <p>This provided source has no tags</p>
{/if}