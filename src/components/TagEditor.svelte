<script>
    import { debounce } from 'lodash';

    import { settings } from '../lib/stores';
    import { TypesEnum } from '../lib/enums';
    import TagObject from '../lib/input/TagObject.svelte'
    import SearchArray from '../lib/input/SearchArray.svelte';
    import AddIcon from '../lib/icons/plus.svelte';
    import Tag from '../lib/Tag';

    let availableTags = Object.keys($settings.tags);
    let searchResults = availableTags;
    let filteredTags = availableTags;
    let searchTerm;

    const debouncedAdd = debounce(add, 500)

    $: { settingsUpdated($settings) }

    function settingsUpdated(s) {
        availableTags = Object.keys(s.tags);
    }

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

    function add(){
        if (searchTerm !== '' && !Object.hasOwn($settings.tags, searchTerm)) {
            let t = new Tag(searchTerm, TypesEnum.Activity.name, '#777777');
            $settings.tags[t.name] = t;

            // trigger updates;
            $settings = $settings;
        }
    }
    
    function save(event) {
        const { tag: tag } = event.detail;
        if (tag.tagName !== '') {
            $settings.tags[tag.tagName] = tag;
        } 
    }
        
    function deleteTag(event) {
        const { tag: tag } = event.detail;
        delete $settings.tags[tag.name];

        // trigger updates;
        $settings = $settings;
    }
</script>

<style>
    h3 {
        margin-top:10px;
    }
</style>

<h3>Search or Add Tags</h3>


<SearchArray name='search-tags' bind:term={searchTerm} bind:results={searchResults} bind:source={availableTags}/>
<button class='icon' on:click={debouncedAdd}>
    <AddIcon/>
</button>

<section>
    {#each filteredTags as tagName}
        {#if Object.hasOwn($settings.tags, tagName) }
            <TagObject on:save={save} on:remove={deleteTag} tag={$settings.tags[tagName]}/>
        {/if}
    {/each}
</section>