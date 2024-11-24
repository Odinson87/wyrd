<script>
    import { settings } from './lib/stores';
    import Tags from './lib/input/Tags.svelte';
    
    let availableTags = Object.keys($settings.tags);
    export let source = {};

    $: sourceHasTags = Object.hasOwn(source, 'tags');

</script>

{#if sourceHasTags}
    <section name='tag-editor'>
        <Tags tags={availableTags} bind:selected={source.tags}/>
    </section>
{:else}
    <p>This provided source has no tags</p>
{/if}