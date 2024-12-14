<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { debounce } from 'lodash';

    import { settings } from '../stores';
    import DeleteIcon from '../icons/bin.svelte';
    import SaveIcon from '../icons/save.svelte';

    const dispatch = createEventDispatcher();
    const debouncedSave = debounce(save, 1000);
    const debouncedRemove = debounce(remove, 1000);

    export let tag;

    function remove() {
        dispatch('remove', { tag });
    }

    function save() {
        dispatch('save', { tag })
    }

    onMount(() => {
        //console.log($settings.activityTypes)
    });
</script>

<style>
    article { border-width: 2px; }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    header :nth-child(1) {
        flex-grow: 1;
        text-align: center;
    }

    /*
    input[type="text"] {
        max-width: 210px;
    }
    */
    input[type="color"] {
        display: inline-block;
        margin-bottom: 0;
        padding: 0px;
        background-color: #333;
        border-radius: 50%;
        border: 2px solid #eee;
        width: 32px;
        vertical-align: middle;
    }

    .input-group {margin: 10px 0px;}
</style>

<article style='border-color:{tag.hex}' transition:fade>
    <header>
        <div>
            <h3>{ tag.name}</h3>
        </div>
        <div>
            <button class="icon" on:click={debouncedSave}>
                <SaveIcon/>
            </button>
            <button class="icon" on:click={debouncedRemove}>
                <DeleteIcon/>
            </button>
        </div>
    </header> 
   
    <div class="input-group">
        <label for='type'>Type :</label>
        <select name='type' bind:value={tag.type}>
            {#each Object.keys($settings.activityTypes) as tagName}
            <option>{ tagName }</option>
            {/each}
        </select>
    </div>

    <div class="input-group">
        <label for='hexColor'>Color :</label>
        <input type='color' name='hexColor' bind:value={ tag.hex }/>
    </div>
</article>