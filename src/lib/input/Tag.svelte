<script>
    import { onMount } from "svelte";
    import { GroupsEnum, TypesEnum } from "../enums";


    let tag;
    export let tagName;
    export let checked;
    export let group;
    export let disabled = false;

    // get tag object if available
    onMount(() => {
        if (tagName) {
            if (Object.hasOwn(GroupsEnum, tagName)) {
                tag = GroupsEnum[tagName];
            }
            if (Object.hasOwn(TypesEnum, tagName)) {
                tag = TypesEnum[tagName];
            }

        }
    })

    $: updateCheckbox(group)
	$: updateGroup(checked)

    function updateCheckbox(group) {
		checked = group.indexOf(tagName) >= 0
	}
	
	function updateGroup(checked) {
		const index = group.indexOf(tagName)
		if (checked) {
			if (index < 0) {
				group.push(tagName)
				group = group
			}
		} else {
			if (index >= 0) {
				group.splice(index, 1)
				group = group
			}
		}
	}
</script>

<style>
    label {
        position: relative;
        margin:5px;
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

    label[data-checked="true"] {
        box-shadow: 5px 0px #666;
    }

    label:hover{
        filter: brightness(104%);
    }
</style>
    
<label class='tag' data-checked={checked} style='background-color:{tag ? tag.hex : 'transparent'}'>
    <input name={tagName} type='checkbox' disabled={disabled} bind:checked={checked} bind:value={tagName}>
    <span>{tagName}</span>
</label>