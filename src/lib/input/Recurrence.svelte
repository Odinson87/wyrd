<script>
    import { onMount } from "svelte";
    import { RecurrenceEnumerables } from "../enums";
    import RecurrencePattern from '../RecurrencePattern';
    import CheckboxInput from './Checkbox.svelte';
    import DayCheckboxInput from './DayCheckbox.svelte';
    import NumberInput from './Number.svelte';

    export let recur;
    export let recurrence;

    let selectedDays = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
    }
    
</script>

<div class="input-group">
    <CheckboxInput val={recur} label="recur"/>
    <NumberInput val={recurrence.interval} name="activity-recurrence-interval" label='Every'/>
    <select bind:value={recurrence.freq} name="activity-reucurrence-freq">
        {#each RecurrenceEnumerables.freq as fStr, i}
            <option value={fStr}>{fStr}</option>
        {/each}
    </select>
    <div class="weekdays">
        {#each RecurrenceEnumerables.byday as DayStr2Chr, i}
            <DayCheckboxInput 
                val={selectedDays[i]}
                name="activity-recurrence-byday"
                group='byday'
                label={DayStr2Chr.substring(0,1)}/>
        {/each}
    </div>
</div>



