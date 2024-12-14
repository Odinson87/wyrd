<script>
    import { onMount } from 'svelte'
    import { sortBy } from 'lodash'
    import PouchDB from 'pouchdb-browser'
    
    import { addToast, settings } from '../lib/stores'
    import Filters from '../lib/filters'
    import ActivityDoc from '../lib/ActivityDoc'
    import Activity from './Activity.svelte'
    import AddIcon from '../lib/icons/plus.svelte'
    import TagCheckboxBar from '../lib/input/TagCheckboxBar.svelte'

    // Set up local PouchDB and continuous replication to remote CouchDB
    let db = new PouchDB('db', {revs_limit: 1, auto_compaction: true})
  
  /*
    const replication = PouchDB.sync('db', 'http://localhost:5984/svelte-todo-db', {
      live: true,
      retry: true
    }).on('change', async function (info) {
      await updateTodos()
    }).on('error', function (err) {
      console.log('Replication error:', err)
    })
  */
  
    // Set up
    let isLoading = true
    let newDoc = new ActivityDoc
    let sortByWhat = 'createdAt'
    let completedFilter = ''
    let addNewItem = false
    let activityTypes = [];
    let tags = [];
    let selectedTags = [];
    let selectedActivityTypes = [];

    // All the docs directly from the PouchDB
    export let items = []
    $: sortedAndFilteredItems = sortBy(items, [sortByWhat]).filter((item) => {
        let filters = new Filters(completedFilter, selectedActivityTypes, selectedTags); 
      
        if (filters.hasActiveFilters()) {
            return filters.matches(item);
        }

        return true;
    })

    $: { settingsUpdated($settings) }
    // reset settings when configuration change
    function settingsUpdated(s) {

        // track changes and update docs if required        
        let freshTypes = Object.keys(s.activityTypes);
        let freshTags = Object.keys(s.tags);

        // if any tags/types selected no longer exist, filter out 
        if (selectedActivityTypes.length > 0) {
            selectedActivityTypes = selectedActivityTypes.filter( t => freshTypes.includes(t) );
        }
        if (selectedTags.length > 0) {
            selectedTags = selectedTags.filter( t => freshTags.includes(t) );
        }

        // when there are missing tags update db removing them from each required doc
        let missingTags = tags.filter( t => !freshTags.includes(t) );     
        if (missingTags.length > 0) {  
            removeDocTags(missingTags);
        }

        // set values from new settings
        activityTypes = freshTypes;
        tags = freshTags;
    }

    async function removeDocTags(missingTags) {

        let itemsToUpdate = items.filter( d => {
            let update = false;
            missingTags.forEach( tagName => {
                update = d.tags.includes(tagName);
            });
            return update;
        });
        
        itemsToUpdate = itemsToUpdate.map( d => {
            missingTags.forEach( tagName => {
                d.tags = d.tags.filter( t => t !== tagName);
            })
            return d;
        });

        const updated = await updateDocs(itemsToUpdate);
        if (updated.ok) {
            addToast({
                message: 'Removed Tag(s): ' + missingTags.join(', '),
                timeout: 3000
            });
        } else {
            addToast({
                type: 'error',
                message: JSON.stringify(updated)
            });
        }
    }

    // Helper for reloading all todos from the local PouchDB. It’s on-device and has basically zero latency,
    // so we can use it quite liberally instead of keeping our local state up to date like you’d do
    // in a Redux reducer. It also saves us from having to rebuild the local state todos from the data we sent
    // to the database and the `_id` and `_rev` values that were sent back.
    async function updateItems() {
        const allDocs = await db.allDocs({
            include_docs: true
        })
        items = allDocs.rows.map(row => row.doc)
        isLoading = false
    }
  
    // Event handlers for adding, updating and removing todos
    async function addDoc(event) {
        const { doc: doc} = event.detail;
        doc.complete = false; 
        doc.createdAt = new Date().toISOString()

        const addition = await db.post(doc)
        if (addition.ok) {
            await updateItems()
        }
        newDoc = new ActivityDoc;
        addNewItem = false;
    }

    async function updateDocs(docs) {
        const updated = await db.bulkDocs(docs);
        let success = true;
        if (updated.forEach( u => { 
            if (!u.ok) {
                success = false;
            }
        }))

        await updateItems();

        return { 
            ok: success,
            results: updated
        };
    }
  
    async function updateDoc(event) {
        const { doc: doc } = event.detail
        const update = await db.put(doc)
        if (update.ok) {
            await updateItems()
        }
    }
  
    async function removeDoc(event) {
        const { doc: doc } = event.detail
        const removal = await db.remove(doc)
        if (removal.ok) {
            // For removal, we can just update the local state instead of reloading everything from PouchDB,
            // since we no longer care about the doc’s revision.
            items = items.filter((activityDoc) => {
                return activityDoc._id !== doc._id
            })
        }
    }
  
    // Load todos on first run
    onMount(async () => {
        await updateItems()
    })

    // New Item
    function toggleNewItem(){
        addNewItem = !addNewItem;
    }
</script>
  
<style>
    ul {
        display: flex;
        flex-flow: column nowrap;
        margin: 10px 0;
        padding: 0;
        list-style: none;
    }
</style>

{#if isLoading}
    <h1>
        Loading…
    </h1>
{:else}
    <h1>
        {sortedAndFilteredItems.length} Items ({items.length})
    </h1>
{/if}

<button class="icon addItem" on:click={toggleNewItem}>
    <AddIcon/>
</button>

<section>
    <Activity doc={newDoc} viewmode={addNewItem ? 'add' : 'hidden'} on:add={addDoc}/>
</section>

<TagCheckboxBar name='activityTypes' classes={['tagBar']} selectMax=1 bind:tags={activityTypes} bind:selected={selectedActivityTypes} />

<TagCheckboxBar name='tags' classes={['tagBar']} bind:tags={tags} bind:selected={selectedTags}/>

{#if items.length > 0}    
    <section>  
        <div>
            <label for="sort-item">Sort by :</label>
            <select name="sort-item" bind:value={sortByWhat}>
            <option value='createdAt'>Time</option>
            <option value='text'>Name</option>
            <option value='complete'>Completion</option>
            </select>
        </div>
        <div>
            <label for="filter-item">Show :</label>
            <select name="filter-item" bind:value={completedFilter}>
            <option value=''>all</option>
            <option value='complete'>completed</option>
            <option value='open'>open</option>
            </select>
        </div>
    </section>
    <section>
        <ul>
            {#each sortedAndFilteredItems as item (item._id)}
            <li>
                <Activity doc={item} on:remove={removeDoc} on:update={updateDoc}/>
            </li>
            {/each}
        </ul>
    </section>
{/if}