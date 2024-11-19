<script>
    import { onMount } from "svelte";
    import { RecurrenceEnumerables } from "../enums";
    import RecurrencePattern from '../RecurrencePattern';
    import CheckboxInput from './Checkbox.svelte';
    import DayCheckboxInput from './DayCheckbox.svelte';
    import NumberInput from './Number.svelte';

    export let recur;
    export let recurrence;

    $: {
        updateRecurrence(recur)
    }

    function updateRecurrence(recur) {
        if (!recur) {
            recurrence = {};
        } else if (Object.hasOwn(recurrence, 'byday')){
            recurrence = recurrence;
        } else {
            recurrence = new RecurrencePattern;
        }
    }
    
</script>

<div class="input-group">
    <CheckboxInput bind:val={recur} label="recur"/>
    {#if recur == true}
        <NumberInput bind:val={recurrence.interval} name="activity-recurrence-interval" label='Every'/>
        <select bind:value={recurrence.freq} name="activity-recurrence-freq">
            {#each RecurrenceEnumerables.freq as fStr, i}
                <option value={fStr}>{fStr}</option>
            {/each}
        </select>

        {#if recurrence.freq == RecurrenceEnumerables.freq[1]}
            <div class="weekdays">
                {#each RecurrenceEnumerables.byday as DayStr2Chr, i}
                    <DayCheckboxInput 
                        val={DayStr2Chr}
                        bind:group={recurrence.byday}
                        name="activity-recurrence-byday"
                        label={DayStr2Chr.substring(0,1)}/>
                {/each}
            </div>
        {/if}
    {/if}
</div>



