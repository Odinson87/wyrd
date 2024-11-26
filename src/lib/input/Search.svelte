<script>

    export let val;
    export let name;
    export let label;
</script>

{#if typeof(label) !== "undefined" }
<label for={name}>{label}:</label>
{/if}
<input name={name} type='search' bind:value={val}>
