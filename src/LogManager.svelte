<script>
    import { onMount } from 'svelte';
    import { sortBy } from 'lodash'
    //import { settings } from './lib/stores'
    //import Filters from './lib/filters'
    import PouchDB from 'pouchdb-browser';
    
    import Log from './lib/Log.js';
    import AddIcon from './lib/icons/plus.svelte';
    import LogEntry from './LogEntry.svelte';
    import { addToast } from './lib/stores.js';

    // Set up local PouchDB and continuous replication to remote CouchDB
    let db = new PouchDB('logs', {revs_limit: 1, auto_compaction: true});
  
    // Set up
    let item = {};
    let sortByWhat = 'occurredAt';
    let sortedLogs = [];
    export let source = {};

    // fetch equivalent log item
    async function getItem() {
        if (Object.hasOwn(source, 'logItemId') && typeof source.logItemId === 'string') {
            try {
                item = await db.get(source.logItemId);
                sortedLogs = sortBy(item.logs, [sortByWhat]).reverse()
            } catch(ignore) {

            }
        }
    }
  
    // Event handlers for adding, updating and removing item logs
    async function addLog() {
        let action = { ok: false }
        if (Object.hasOwn(item, 'logs') && Array.isArray(item.logs)) {
            item.logs.push(new Log(source.durationType, source.durationIncrement));
            action = await db.put(item);
        } else {
            item = {
                logs: [new Log(source.durationType, source.durationIncrement)]
            }
            action = await db.post(item);
            if (action.ok && action.id) {
                source.logItemId = action.id;
                source = source;
            }
        }

        if(action.ok) {
            await getItem();
            addToast({
                message: 'Log entry added',
                timeout: 3000
            });
        }
    }

    async function updateLog() {    
        const update = await db.put(item);
        if (update.ok) {
            await getItem()
            addToast({
                message: 'Log entry saved',
                timeout: 3000 
            });
        }
    }

    async function removeLog(event) {
        const { log: log } = event.detail;
        // filter out log to remove
        item.logs = item.logs.filter((logItem) => {
            return logItem.createdAt !== log.createdAt
        });
        const updated = await db.put(item);
        if (updated.ok) {
            await getItem();
            addToast({
                message: 'Removed Log',
                timeout: 3000 
            });
        }
    }
  
    // Load todos on first run
    onMount(async () => {
        await getItem();
    })
</script>

<style>
</style>

<button class='icon medium' name='add-log' on:click={addLog}>
    <AddIcon size={20}/>
</button>
{#if sortedLogs.length > 0}
    {#each sortedLogs as itemLog}
        <LogEntry bind:log={itemLog} on:save={updateLog} on:remove={removeLog}/>
    {/each}
{:else}
    <p>There aren't any logs, add some</p>
{/if}