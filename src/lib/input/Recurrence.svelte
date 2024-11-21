<script>
    import { onMount } from "svelte";
    import { RecurrenceEnums } from "../enums";
    import RecurrencePattern from '../RecurrencePattern';
    import CheckboxInput from './Checkbox.svelte';
    import DayCheckboxInput from './DayCheckbox.svelte';
    import NumberInput from './Number.svelte';

    export let doc;

    $: {
        updateRecurrence(doc.recur)
    }

    function updateRecurrence(recur) {
        if (!recur) {
            // remove recurrence data
            doc.recurrence = {};
        } else if (!Object.hasOwn(doc.recurrence, 'byday')){
            // add new oject when existing pattern doesn't exist
            doc.recurrence = new RecurrencePattern;
        }
    }
    
</script>

<div class="input-group">
    <CheckboxInput bind:val={doc.recur} label="recur"/>
    {#if doc.recur == true}
        <NumberInput min=1 bind:val={doc.recurrence.interval} name="activity-recurrence-interval" label='Every'/>
        <select bind:value={doc.recurrence.freq} name="activity-recurrence-freq">
            {#each RecurrenceEnums.freq as fStr, i}
                <option value={fStr}>{fStr}</option>
            {/each}
        </select>

        {#if doc.recurrence.freq == RecurrenceEnums.freq[1]}
            <div class="weekdays">
                {#each RecurrenceEnums.byday as DayStr2Chr, i}
                    <DayCheckboxInput 
                        val={DayStr2Chr}
                        bind:group={doc.recurrence.byday}
                        name="activity-recurrence-byday"
                        label={DayStr2Chr.substring(0,1)}/>
                {/each}
            </div>
        {/if}
    {/if}
</div>



