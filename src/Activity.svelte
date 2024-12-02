<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { debounce } from 'lodash';
    
    import { getDateTimeStr } from './lib/time.js';
    import { settings, addToast } from "./lib/stores.js";
    import SaveIcon from './lib/icons/save.svelte';
    import BinIcon from './lib/icons/bin.svelte';
    import TargetIcon from './lib/icons/target.svelte';
    import TagIcon from './lib/icons/tagIcon.svelte';
    import TimeIcon from './lib/icons/timeForward.svelte';
    import LogIcon from './lib/icons/notes.svelte';
    import NumberInput from './lib/input/Number.svelte';
    import Recurrence from './lib/input/Recurrence.svelte';
    import ModalBtn from './lib/input/ModalBtn.svelte';
    import TagManager from './TagManager.svelte';
    import Duration from './lib/input/Duration.svelte';
    import OccurredAt from './lib/input/OccurredAt.svelte';

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
    const debounceOccur= debounce(occurred, 500);

    function toggleMode(mode) {
        viewmode = viewmode === mode ? 'list' : mode;
    }

    function toggleTab(t) {
        if (t === tab) {
            tab = 'hidden';
        } else {
            tab = t;
        }
    }

    function occurred() {
        let msg = 'Occurred'
        if (!doc.recur) {
            doc.complete = !doc.complete
            msg = doc.complete ? 'Completed' : 'Uncompleted'
        } else {
            doc.complete = false
            doc.occurrences++;
        }
        doc.occurredAt = getDateTimeStr();
        
        addToast({
            message: '"' + doc.name + '" ' + msg,
            timeout: 3000 
        });
        dispatch('update', {doc: doc})
    }
    
    let agoStr
    let durationStr;
    export let doc;
    export let viewmode = 'list';
    let tab = 'hidden';
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
    }
    .since p:first-child { 
        top: -4px;
        width: 140%;
        right: -3px;
    }

    .since p:last-child { bottom: -3px;}

    .tab-buttons {
        display: flex;
        justify-content: center
    }
    .tab-buttons button {
        margin:5px;
    }
   
</style>

<article 
    transition:fade
    data-viewmode={viewmode}
>
    <header>
        <div>
            <button class="icon list-btn" on:click={debounceOccur}>
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
                    <TagIcon size={20} slot="icon"/>
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
    <section class="edit" data-tab={tab}>
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
        <div>

        </div>
        <div class="tab-buttons">
            <button class="medium icon" on:click={() => toggleTab('tags')}>
                <TagIcon/>
            </button>
            <button class="medium icon" on:click={() => toggleTab('time')}>
                <TimeIcon/>
            </button>
            <ModalBtn  
                classes={'medium m-5'}
                modalName={'logmanager'}
                bind:source={doc}
                on:save={debouncedSave}
                on:click={() => toggleTab('logs')}>
                <LogIcon slot='icon'/>
            </ModalBtn>
        </div>
        <div class="tab-group" data-group="tags">
            <h3>Tags</h3>
            <TagManager bind:source={doc}/>
        </div>
        <div class="tab-group" data-group="time">
            <h3>Time</h3>
            <div class="input-group" data-group="duration">
                <Duration
                    label='duration'
                    name="activity-duration"
                    bind:durationType={doc.durationType}
                    bind:durationIncrement={doc.durationIncrement}
                    bind:value={durationStr}/>
            </div>
            {#if doc.recur}
            <div class="input-group" data-group="occurrence">
                <NumberInput bind:val={doc.occurrences} label="Ocurrences" name="activity-ocurrences"/>
            </div>
            {/if}
            {#if doc.occurredAt !== null}
            <div class="input-group" data-group="occurrence">
                <OccurredAt name='activity-occurred-at' bind:agoStr={agoStr} bind:occurredAt={doc.occurredAt}/>
            </div>
            {/if}

            <Recurrence bind:doc={doc}/>
        </div>
        <div class='tab-group' data-group="logs">
            <h3>Logs</h3>
        </div>
    </section>
    <!--button on:click={output}>Log</button-->
</article>
