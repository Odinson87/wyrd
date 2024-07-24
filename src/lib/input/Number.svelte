<script>
    export let val = 0;
    export let name;
    export let label;
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
<label for={name}>{label} :</label>
{/if}
<button class="leftArrow" on:click={ () => val !== 0 ? val-- : null }> - </button>
<input name={name} type='number' bind:value={val}>
<button class="rightArrow" on:click={ () => val++ }> + </button>
