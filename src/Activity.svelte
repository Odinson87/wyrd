<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { debounce } from 'lodash';
    import { ago } from './lib/time.js';

    import { DurationEnum } from './lib/enums';
    import { settings, addToast } from "./lib/stores.js";
    import SaveIcon from './lib/icons/save.svelte';
    import BinIcon from './lib/icons/bin.svelte';
    import TargetIcon from './lib/icons/target.svelte';
    import TagIcon from './lib/icons/tagIcon.svelte';
    import NumberInput from './lib/input/Number.svelte';
    import Recurrence from './lib/input/Recurrence.svelte';
    import Tags from './lib/input/Tags.svelte';
    import ModalBtn from './lib/input/ModalBtn.svelte';

    const dispatch = createEventDispatcher();

    function add(){
        addToast({
            message: 'Created Activity "' + doc.name + '"',
            timeout: 3000 
        });
        dispatch('add', {doc: doc})
    }

    function remove() {
        addToast({
            message: 'Deleted "' + doc.name + '" ',
            timeout: 3000 
        });
        dispatch('remove', {doc: doc})
    }

    function save() {
        // reset complete flag for recurring activity
        if (doc.recur) {
            doc.complete = false;
        } 
        addToast({
            message: 'Saved "' + doc.name + '" ',
            timeout: 3000 
        });
        dispatch('update', {doc: doc})
    }
  

    // only fire once, debouncing multiple clicks, reducing revisions
    const debouncedSave = debounce(save, 1000);
    const debouncedAdd = debounce(add, 1000);

    function toggleMode(mode) {
        viewmode = viewmode === mode ? 'list' : mode;
    }

    function occurred() {
        if (!doc.recur) {
            doc.complete = !doc.complete
        } else {
            doc.complete = false
            doc.occurrences++;
        }
        doc.occurredAt = (new Date()).toISOString().substr(0, 19);
        save();
    }

    function output(){
        console.log(doc);
    }

    $: durationStr = doc.durationIncrement + doc.durationType;
    $: agoStr = ago(doc.occurredAt);

    let activityTypes = Object.keys($settings.activityTypes);

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
    }
    .since {
        position:relative;
        width: 45px;
        height: 45px;
        text-align: center;
    }
    .since p {
        position: absolute;
        font-size: 0.6em;
        text-align: right;
        line-height: 1em;
        width:100%;
        text-shadow: 1px 0px 3px #000;
    }
    .since p:first-child { 
        top: -4px;
        width: 140%;
        right: -3px;
    }

    .since p:last-child { bottom: -3px;}
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
            <button class="icon list-btn" on:click={occurred}>
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
                <ModalBtn classes={'small'} modalName={'tageditor'} bind:source={doc} on:save={debouncedSave} >
                    <TagIcon slot="icon"/>
                </ModalBtn>
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
        <div class="input-group" data-group="name">
            <label for=activity-name>Name :</label>
            <input name="activity-name" type='text' bind:value={doc.name}>
        </div>
        <div class="input-group" data-group="activity-type">
            <label for="activity-type">Type :</label>
            <select bind:value={doc.type} name="activity-type">
                {#each Object.entries($settings.activityTypes) as [_, type]}
                    <option value={type.type}>{type.name}</option>
                {/each}
            </select>
        </div>
        <div class="input-group" data-group="tags">
            <ModalBtn modalName={'tageditor'} bind:source={doc} on:save={debouncedSave}>
                <TagIcon slot="icon"/>
            </ModalBtn>
            <Tags bind:tags={doc.tags} disabled={true}/>
        </div>
        <div class="input-group" data-group="duration">
            <label for="activity-duration">Duration :</label>
            <select bind:value={doc.durationType} name="activity-duration">
                {#each Object.entries(DurationEnum) as [_, duration]}
                    <option value={duration.key}>{duration.name}</option>
                {/each}
            </select>
            <NumberInput bind:val={doc.durationIncrement} name="activity-duration-inc"/>
        </div>

        {#if doc.occurredAt && (doc.complete || doc.recur)}
        <div class="input-group" data-group="occurrence">
            <div>
                <label for=activity-occurred-at>Occurred :</label>
                <p>{agoStr}</p>
            </div>
            <div>
                <label for=activity-occurred-at>At :</label>
                <input name="activity-occurred-at" type='datetime-local' bind:value={doc.occurredAt}>
            </div>
        </div>
        {/if}

        {#if doc.recur}
        <div class="input-group" data-group="occurrence">
            <NumberInput bind:val={doc.occurrences} label="Ocurrences" name="activity-ocurrences"/>
        </div>
        {/if}

        <Recurrence bind:doc={doc}/>
    </section>
    <!--button on:click={output}>Log</button-->
</article>
