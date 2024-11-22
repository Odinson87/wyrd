<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import { debounce } from 'lodash'
  import { ago } from './lib/time.js';

  import { TypesEnum, DurationEnum } from './lib/enums'
  import { addToast } from "./lib/stores.js";
  import SaveIcon from './lib/icons/save.svelte'
  import BinIcon from './lib/icons/bin.svelte'
  import TargetIcon from './lib/icons/target.svelte'
  import NumberInput from './lib/input/Number.svelte';
  import Recurrence from './lib/input/Recurrence.svelte';

  const dispatch = createEventDispatcher()

  function add(){
    addToast({
        message: 'Created Activity "' + doc.name + '"',
        timeout: 3000 
    });
    dispatch('add', {todo: doc})
  }

  function remove() {
    addToast({
        message: 'Deleted "' + doc.name + '" ',
        timeout: 3000 
    });
      dispatch('remove', {todo: doc})
    }
    
  function save() {
    // reset complete flag for recurring activity
    if (doc.recur) {
        doc.complete = false;
    } 
    addToast({
        message: 'Updated "' + doc.name + '" ',
        timeout: 3000 
    });
    dispatch('update', {todo: doc})
  }
  

  // only fire once, debouncing multiple clicks, reducing revisions
  const debouncedSave = debounce(save, 1000)
  const debouncedAdd = debounce(add, 1000)

  function toggleMode(mode) {
    viewmode = viewmode === mode ? 'list' : mode;
  }

  function ocurred() {
      
    if (!doc.recur) {
        doc.complete = !doc.complete
    } else {
        doc.complete = false
        doc.occurrences++;
    }
    doc.occurredAt = (new Date()).toISOString().substr(0, 19);
    save();
  }

  $: durationStr = doc.durationIncrement + doc.durationType;
  $: agoStr = ago(doc.occurredAt);

  export let doc;
  export let viewmode = 'list';
</script>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    header :nth-child(2) {
        flex-grow: 1;
        text-align: center;
    }
    .is-complete {
        text-decoration: line-through;
        color: green;
    }
    .since {
        position:relative;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: solid 1px #ccc;
        text-align: center;
    }
    .since p {
        position: absolute;
        font-size: 0.6em;
        text-align: center;
        line-height: 1em;
        width:100%;
    }
    .since p:first-child { 
        top: -8px;
        width: 130%;
        margin-left: -6px;

    }
    .since p:last-child { bottom: -8px;}
    [name="activity-occurred-at"] {
        font-size: 15px;
    }
   
</style>

<article 
    transition:fade
    data-viewmode={viewmode}
>
    <header>
        <div>
            <button class="icon list-btn" on:click={ocurred}>
               <TargetIcon/> 
            </button>
        </div>
        <div>
            <button class={ doc.complete ? 'is-complete title' : 'title'} on:click={()=> toggleMode('edit')}>
                <strong>{doc.name}</strong>
            </button >
            <button class="icon add-btn" on:click={debouncedAdd}>
                <SaveIcon/>
            </button>
        </div>
        <div>
            <div class="since">
                <p>
                    {#if doc.occurredAt && (doc.complete || doc.recur)}
                        {agoStr}
                    {/if}
                </p>
                <p>{durationStr}</p>
            </div>
            <button class="icon edit-btn" on:click={debouncedSave}>
                <SaveIcon/>
            </button>
            <button class="icon edit-btn" on:click={remove}>
                <BinIcon/>
            </button>
        </div>
    </header>
    <section class="edit">
        <div class="input-group">
            <label for=activity-name>Name :</label>
            <input name="activity-name" type='text' bind:value={doc.name}>
        </div>
        <div class="input-group">
            <label for="activity-type">Type :</label>
            <select bind:value={doc.type} name="activity-type">
                {#each Object.entries(TypesEnum) as [_, type]}
                    <option value={type.type}>{type.name}</option>
                {/each}
            </select>
        </div>
        <div class="input-group">
            <label for="activity-duration">Duration :</label>
            <select bind:value={doc.durationType} name="activity-duration">
                {#each Object.entries(DurationEnum) as [_, duration]}
                    <option value={duration.key}>{duration.name}</option>
                {/each}
            </select>
            <NumberInput bind:val={doc.durationIncrement} name="activity-duration-inc"/>
        </div>

        {#if doc.occurredAt && (doc.complete || doc.recur)}
            <div class="input-group">
                <label for=activity-occurred-at>Occurred :</label>
                <p>{agoStr}</p>
            </div>
            <div class="input-group">
                <label for=activity-occurred-at>At :</label>
                <input name="activity-occurred-at" type='datetime-local' bind:value={doc.occurredAt}>
            </div>
        {/if}

        {#if doc.recur}
        <div class="input-group">
            <NumberInput bind:val={doc.occurrences} label="Ocurrences" name="activity-ocurrences"/>
        </div>
        {/if}

        <Recurrence bind:doc={doc}/>
    </section>
</article>
