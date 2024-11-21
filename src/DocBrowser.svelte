<script>
    import { onMount, getContext } from 'svelte'
    import { sortBy } from 'lodash'
    import { GroupsEnum, TypesEnum } from './lib/enums'
    import PouchDB from 'pouchdb-browser'
  
    import ActivityDoc from './lib/ActivityDoc'
    import Activity from './Activity.svelte'
    import AddIcon from './lib/icons/plus.svelte'
    import Tags from './lib/Tags.svelte'

    let notifications = getContext('app');
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
    let newDoc = new ActivityDoc
    let sortByWhat = 'createdAt'
    let filterByWhat = ''
    let isLoading = true
    let addNewItem = false
    let tags = Object.keys(GroupsEnum)
    let selectedTags = [];
    let activityTypes = Object.keys(TypesEnum)
    let selectedActivityTypes = [];

    // All the todos directly from the PouchDB. Sorting and filtering comes later
    export let items = []
    $: sortedAndFilteredItems = sortBy(items, [sortByWhat]).filter((todo) => {
      const [filterKey, filterValue] = filterByWhat.split(':')
      // Only filter if there’s a proper filter set
      return filterKey && filterValue ? todo[filterKey].toString() === filterValue : true
    })

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
        const { todo: activity} = event.detail;
        activity.complete = false; 
        activity.createdAt = new Date().toISOString()

        const addition = await db.post(activity)
        if (addition.ok) {
            await updateItems()
        }
        newDoc = new ActivityDoc;
        addNewItem = false;
    }
  
    async function updateDoc(event) {
      const { todo } = event.detail
      const update = await db.put(todo)
      if (update.ok) {
        await updateItems()
      }
    }
  
    async function removeDoc(event) {
      const { todo: todoToRemove } = event.detail
      const removal = await db.remove(todoToRemove)
      if (removal.ok) {
        // For removal, we can just update the local state instead of reloading everything from PouchDB,
        // since we no longer care about the doc’s revision.
        items = items.filter((todo) => {
          return todo._id !== todoToRemove._id
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
        Loading your todos…
    </h1>
{:else}
    <h1>
        {sortedAndFilteredItems.length} Activities ({items.length})
    </h1>
{/if}

<button class="icon addItem" on:click={toggleNewItem}>
    <AddIcon/>
</button>

<section>
    <Activity doc={newDoc} viewmode={addNewItem ? 'add' : 'hidden'} on:add={addDoc}/>
</section>

<Tags bind:tags={tags} bind:select={selectedTags}></Tags>
<Tags bind:tags={activityTypes} bind:selectedTags={selectedActivityTypes}></Tags>

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
            <label for="filter-item">Filter :</label>
            <select name="filter-item" bind:value={filterByWhat}>
            <option value=''>Show all todos</option>
            <option value='complete:true'>Show completed todos</option>
            <option value='complete:false'>Show open todos</option>
            </select>
        </div>
    </section>
    <section>
        <ul>
            {#each sortedAndFilteredItems as todo (todo._id)}
            <li>
                <Activity doc={todo} on:remove={removeDoc} on:update={updateDoc}/>
            </li>
            {/each}
        </ul>
    </section>
{/if}