<script>

    export let min = 0;
    export let max;
    export let val;
    export let name;
    export let label;
    export let disabled = false;


    function increment() {
        if(!val){
            val = min;
        } else {
            if (max) {
                if (val < max) {
                    val++;
                }
            } else {
                val ++
            }
        }
    }
    
    function decrement() {
        if (!val){
            val = min;
        } else {
            if (val > min) {
                val--;
            }
        }
    }

</script>

<style>
    input[type="number"] {
        width:50px;
        appearance: textfield;
        -moz-appearance: textfield;
        -webkit-appearance: textfield;
    }
    button {
        line-height: 0.7em;
        width: 1em;
        border-radius: 50%;
        font-size: 25px;
        padding-bottom: 5px;
    } 
</style>

{#if typeof(label) !== "undefined" }
<label for={name}>{label}:</label>
{/if}
<button class="leftArrow" on:click={ () => decrement() }> - </button>
<input disabled={disabled} min={min} name={name} type='number' bind:value={val}>
<button class="rightArrow" on:click={ () => increment() }> + </button>