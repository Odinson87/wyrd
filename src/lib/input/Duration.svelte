<script>
    import NumberInput from './Number.svelte';
    import { DurationEnum } from '../enums';
    export let label;
    export let name;
    export let durationType;
    export let durationIncrement;
    export let value;
    export let disabled = false;

    $: value = durationIncrement + durationType;
</script>

{#if label && name}
<label for={name}>{label}:</label>
{/if}
{#if name }
    <select disabled={disabled} bind:value={durationType} name={name}>
        {#each Object.entries(DurationEnum) as [_, duration]}
            <option value={duration.key}>{duration.name}</option>
        {/each}
    </select>
    <NumberInput disabled={disabled} bind:val={durationIncrement} name="{name}-inc"/>
{/if}