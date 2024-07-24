<script>
    export let val = false;
    export let label;
    export let group;
    let selected = []
</script>

<style>
    label {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
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
        top: -2px;
        left: 0;
        height: 30px;
        width: 30px;
        border-radius: 4px;
        background-color: #eee;
    }

    label:hover input ~ .checkmark { background-color: #ccc; }
    label input:checked ~ .checkmark { background-color: #52aa17; }
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }
    label input:checked ~ .checkmark:after { display: block; }

    label .checkmark:after {
        left: 10px;
        top: 2px;
        width: 10px;
        height: 19px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
</style>

<label>{label} 
    {#if typeof(group) !== "undefined" }
    <input type='checkbox' bind:group={selected} bind:checked={val}>
    {:else}
    <input type='checkbox' bind:checked={val} bind:value={val}>
    {/if}
    <span class="checkmark"></span>
</label>