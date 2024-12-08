<script>
    export let value;
    export let possibleValues = [false, true];
    
    // the index of the current value
    $: position = possibleValues.indexOf(value);

    // class for css positioning of the switch
    $: step = possibleValues.length;

    // step through possible values, restarting when reaching the end
    function toggle(){
        if (position === possibleValues.length-1) {
            value = possibleValues[0];
        } else {
            value = possibleValues[position+1];
        }
    }
</script>

<style>
button.toggle {
    margin-top:2px;
    position: relative;
	width: 60px;
	height: 30px;
	background-color: #333;
	border-radius: 6px;
}

button.toggle .switch {
    position: absolute;
    top: -1px;
    display: block;
	width: 30px;
	height: 30px;
	border: 2px solid lightgrey;
    background-color: grey;
    border-radius: 6px;
}

button.toggle .switch.position-0 {
	left: -2px;
}

button.toggle .switch.step-3.position-1 {
    left: 50%;
}

button.toggle .switch.step-2.position-1 {
    background-color: white;
}

button.toggle .switch.step-2.position-1,
button.toggle .switch.step-3.position-2 
{
	right: -2px;
}
</style>

<button class='icon toggle' on:click={toggle}>
    <span class='switch step-{step} position-{position}' ></span>
</button>