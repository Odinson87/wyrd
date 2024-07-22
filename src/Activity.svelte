<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import { debounce } from 'lodash'

  import { TypesEnum, DurationEnum } from './lib/enums'
  import { addToast } from "./lib/store";
  import SaveIcon from './lib/icons/save.svelte'
  import BinIcon from './lib/icons/bin.svelte'
  import TargetIcon from './lib/icons/target.svelte'

  const dispatch = createEventDispatcher()

  function add(){
    addToast({
        message: 'Created Activity "' + doc.name + '"',
        timeout: 3000 
    });
    dispatch('add',{todo: doc})
  }

  function remove() {
    addToast({
        message: 'Deleted "' + doc.name + '" ',
        timeout: 3000 
    });
      dispatch('remove', {todo: doc})
    }
    
  function save() {
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
    header {
        display: flex;
        justify-content: space-between;
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
</style>

<article 
    transition:fade
    data-viewmode={viewmode}
>
    <header>
        <div>
            <button class="icon list-btn" on:click={toggleStatus}>
               <TargetIcon/> 
            </button>
        </div>
        <div>
            <button class={ doc.complete ? 'is-complete title' : 'title'} on:click={()=> toggleMode('edit')}>
                {doc.name}
            </button >
            <button class="icon add-btn" on:click={debouncedAdd}>
                <SaveIcon/>
            </button>
        </div>
        <div>
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
            <input type="number" bind:value={doc.durationIncrement} name="activity-duration-inc">
        </div>
    </section>
</article>
