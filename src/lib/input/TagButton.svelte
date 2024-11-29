<script>
    import { createEventDispatcher } from "svelte";
    import { settings } from '../stores.js';

    const dispatch = createEventDispatcher();

    let tag;
    export let tagName;

    $: setTag(tagName);

    // get tag object if available
    function setTag(name) {
        if (name) {
            if (Object.hasOwn($settings.tags, name)) {
                tag = $settings.tags[name];
            }
            if (Object.hasOwn($settings.activityTypes, name)) {
                tag = $settings.activityTypes[name];
            }
        }
    }
	
</script>

<style>
    button {
        position: relative;
        margin: 2px;
        color: inherit;
        border: none;
        line-height: inherit;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    button:hover{
        filter: brightness(104%);
    }
</style>
    
<button class='tag' on:click={() => dispatch('tagClicked')} style='background-color:{tag ? tag.hex : 'transparent'}'>
    <span>{tagName}</span>
</button>