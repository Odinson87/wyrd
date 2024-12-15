<script>
    export let val;
    export let label;
    export let checked;
    export let group;

    $: updateCheckbox(group)
	$: updateGroup(checked)

    function updateCheckbox(group) {
		checked = group.indexOf(val) >= 0
	}
	
	function updateGroup(checked) {
		const index = group.indexOf(val)
		if (checked) {
			if (index < 0) {
				group.push(val)
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
        margin-right: 5px;
        height:30px;
        width:30px;
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

    .checkmark {
        position: absolute;
        top: 0px;
        left: 0;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        text-align: center;
        line-height: 2.5em;
    }

 
    label input:checked ~ .checkmark { background-color: #52aa17; }

</style>

<label>
    <input type='checkbox' bind:checked={checked} bind:value={val}>
    <span class="checkmark">{label}</span>
</label>