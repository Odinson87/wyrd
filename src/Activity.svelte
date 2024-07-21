<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import { debounce } from 'lodash'
  import { TypesEnum, DurationEnum } from './lib/enums'
  import SaveIcon from './lib/icons/save.svelte'
  import EditIcon from './lib/icons/edit.svelte'

  const dispatch = createEventDispatcher()

  function remove() {
    dispatch('remove', {todo: doc})
  }

  function save() {
    dispatch('update', {todo: doc})
  }
  // only save once, debouncing multiple clicks, reducing revisions
  const debouncedSave = debounce(save, 1000)

  function toggleMode(mode) {
    console.log(mode);
    viewmode = viewmode === mode ? 'list' : mode;
  }

  function toggleStatus() {
    dispatch('update', {
      todo: {
        ...doc,
        complete: !doc.complete
      }
    })
  }

  export let doc;
  export let viewmode = 'list';
</script>

<style>
  .is-complete {
    text-decoration: line-through;
    color: green;
    width: 440px;
    display: inline-block;
  }
  input[type="text"] {
    width: 440px;
  }
/*  input[disabled] {
    background: none;
    border: 1px solid #0000;
  }*/
  button {
    border-radius: 50%;
    width: 2.25em;
    height: 2.25em;
    line-height: 1.3em;
    text-align: center;
    margin-left: 0.75em;
    padding: 0;
  }
</style>

<li transition:fade data-viewmode={viewmode}>
    <header>
        {#if doc.complete}
            <h3 class='is-complete'>{doc.name}</h3>
            <button on:click={toggleStatus}>❌</button>
        {:else}
            <h3>{doc.name}</h3>
            <button on:click={toggleStatus}>✔️</button>
        {/if}
        <button on:click={debouncedSave}>
            <SaveIcon/>
        </button>
        <button on:click={()=> toggleMode('edit')}>
            <EditIcon/>
        </button>
        <button on:click={remove}>💥</button>
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
                    <option value={duration.name}>{duration.name}</option>
                {/each}
            </select>
            <input type="number" bind:value={doc.durationIncrement} name="activity-duration">
        </div>
    </section>
</li>
