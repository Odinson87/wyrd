<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import { debounce } from 'lodash'
  import { TypesEnum, DurationEnum } from './lib/enums'
  import SaveIcon from './lib/icons/save.svelte'
  import BinIcon from './lib/icons/bin.svelte'
  import TargetIcon from './lib/icons/target.svelte'

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
    li { 
        padding: 5px;
        margin: 5px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    header {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .is-complete {
        text-decoration: line-through;
        color: green;
    }

    button {
        margin-bottom: 0;
        line-height: 1.5em;
        padding:0;
    }
    button.icon {
        border-radius: 50%;
        width: 2.75em;
        height: 2.75em;
        line-height: 1.5em;
        text-align: center;
    }
    button.done {
        border-radius: 50%;
        width: 2.75em;
        height: 2.75em;
    }
    button.title {
        height: 2.75em;
        background-color: transparent;
        border-width: 0px;
    }
</style>

<li transition:fade data-viewmode={viewmode}>
    <header>
        <div>
            <button class="done" on:click={toggleStatus}>
               <TargetIcon/> 
            </button>
        </div>
        <div>
            <button class={ doc.complete ? 'is-complete title' : 'title'} on:click={()=> toggleMode('edit')}>
                {doc.name}
            </button >
        </div>
        <div>
            <button class="icon" on:click={debouncedSave}>
                <SaveIcon/>
            </button>
            <button class="icon" on:click={remove}>
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
                    <option value={duration.name}>{duration.name}</option>
                {/each}
            </select>
            <input type="number" bind:value={doc.durationIncrement} name="activity-duration">
        </div>
    </section>
</li>
