<script>
    import { settings } from '../lib/stores';
    import TagObject from '../lib/input/TagObject.svelte'
    import SearchArray from '../lib/input/SearchArray.svelte';
    import AddIcon from '../lib/icons/plus.svelte';

    let availableTags = Object.keys($settings.tags);
    let searchResults = availableTags;
    let filteredTags = availableTags;
    let searchTerm;

    $: { updateTags(searchResults) }

    function updateTags(resultTags) {
        filteredTags = availableTags.filter((t) => {
            // include if tag is in tag search results
            if (resultTags.indexOf(t) > -1) {
                return true;
            } else {
                return false;
            }
        }).sort();
    }
    
    function save(event) {
        const { tag: tag } = event.detail;
        $settings.tags[tag.tagName] = tag;
    }

    function deleteTag(event) {
        const { tagName: tagName } = event.detail;
        delete $settings.tags[tagName]
    }
</script>

<style>
    h3 {
        margin-top:10px;
    }
</style>

<h3>Search or Add Tags</h3>

<SearchArray name='search-tags' bind:term={searchTerm} bind:results={searchResults} source={availableTags}/>
<button class='icon'>
    <AddIcon/>
</button>

<section>
    {#each filteredTags as tagName}
        <TagObject on:save={save} on:remove={deleteTag} tag={$settings.tags[tagName]}/>
    {/each}
</section>