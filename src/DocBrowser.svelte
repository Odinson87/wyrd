<script>
    import { onMount } from 'svelte'
    import { sortBy } from 'lodash'
    import PouchDB from 'pouchdb-browser'
  
    import Activity from './Activity.svelte'
  
    // Set up local PouchDB and continuous replication to remote CouchDB
    let db = new PouchDB('db')
  
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
  
    // Set up our vars and defaults
    let newItemText = ''
    let sortByWhat = 'createdAt'
    let filterByWhat = ''
    let isLoading = true
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
      const activity = {
        text: newItemText,
        complete: false,
        createdAt: new Date().toISOString()
      }
      const addition = await db.post(activity)
      if (addition.ok) {
        await updateItems()
      }
      newItemText = ''
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
  </script>
  
  <style>
    ul {
      display: flex;
      flex-flow: column nowrap;
      max-width: 320px;
      margin: 10px 0;
      padding: 0;
      list-style: none;
    }
    button {
      margin-left: 0.75em;
    }
    input[type='text'] {
      width: 440px;
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
      <Activity doc={todo} on:remove={removeDoc} on:update={updateDoc}/>
      {/each}
    </ul>
  </section>
  
  <form on:submit|preventDefault={addDoc}>
    <input type='text' bind:value={newItemText}>
    <button type='submit'>➕ Add new task</button>
  </form>
  