<script>
    import { settings } from '../lib/stores';
    import TagButton from '../lib/input/TagButton.svelte';
    import SearchArray from '../lib/input/SearchArray.svelte';
    
    let availableTags = Object.keys($settings.tags);
    let searchResults = availableTags;
    let filteredTags = availableTags;
    export let source = {};

    $: { settingsUpdated($settings) }
    // reset settings when configuration change
    function settingsUpdated(s) {
        availableTags = Object.keys(s.tags);
        
        // remove tags from object when removed from settings
        source.tags = source.tags.filter(t => availableTags.includes(t));
    }

    $: sourceHasTags = Object.hasOwn(source, 'tags');
    $: { updateTags(source.tags, searchResults) }

    function updateTags(sourceTags, resultTags) {
        filteredTags = availableTags.filter((t) => {
            // exclude if tag is in source
            if (sourceTags.indexOf(t) > -1){
                return false;
            }
            // include if tag is in tag search results
            if (resultTags.indexOf(t) > -1) {
                return true;
            } else {
                return false;
            }
        }).sort();
    }

    function add(tagName) {
        if (source.tags.indexOf(tagName) < 0) {
            source.tags.push(tagName);
            source.tags = source.tags;
        }
    }

    function remove(tagName) {
        let index = source.tags.indexOf(tagName);
        if (index > -1) {
            source.tags.splice(index, 1);
            source.tags = source.tags;
        }
    }

</script>

<style>
    h3 {
        margin-top:10px;
    }
</style>

{#if sourceHasTags}
    <div class="removeTags">
        {#each source.tags as tagName}
            <TagButton on:tagClicked={() => remove(tagName)} tagName={tagName}/>
        {/each}
    </div>
    <h3>Add Tags</h3>
    <SearchArray name='search-tags' bind:results={searchResults} source={availableTags}/>
    <div class="addTags">
        {#each filteredTags as tagName}
            <TagButton on:tagClicked={() => add(tagName)} tagName={tagName}/>
        {/each}
    </div>
{:else}
    <p>This provided source has no tags</p>
{/if}