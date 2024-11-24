<script>
    import { onMount } from "svelte";
    import { settings } from '../stores.js';

    let tag;
    export let tagName;
    export let checked;
    export let group;
    export let disabled = false;
    export let selectMax = 0;
    export let selectedVal;

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

    $: updateCheckbox(group)
	$: updateGroup(checked)

    function updateCheckbox(group) {
		checked = group.indexOf(tagName) >= 0;
	}
	
	function updateGroup(checked) {
        const intSelectMax = parseInt(selectMax);
		const index = group.indexOf(tagName)
		if (checked) {
			if (index < 0) {
                if (intSelectMax > 0) {
                    if (intSelectMax === 1) {
                        group = [tagName];
                        selectedVal = tagName;
                    } else if (group.length <= intSelectMax) {
                        group.push(tagName);
                    }
                } else {
                    group.push(tagName);
                }
                group = group;

			}
		} else {
			if (index >= 0) {
				group.splice(index, 1);
				group = group;
			}
		}
//        console.log(group);
	}
</script>

<style>
    label {
        position: relative;
        margin: 2px;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    label input {
        position: absolute;
        cursor: pointer;
        opacity: 0;
        height:0;
        width:0;
    }

    label:hover{
        filter: brightness(104%);
    }
</style>
    
<label class='tag' data-checked={checked} style='background-color:{tag ? tag.hex : 'transparent'}'>
    <input name={tagName} type='checkbox' disabled={disabled} bind:checked={checked} bind:value={tagName}>
    <span>{tagName}</span>
</label>