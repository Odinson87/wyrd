<script>
    import { capitalize } from 'lodash';
    import { RRule } from 'rrule';

    import { RecurrenceDisplayEnums, RecurrenceEnums } from "../enums";
    import { convertToRRule, rruleText } from '../time';
    import RecurrencePattern from '../RecurrencePattern';
    import CheckboxInput from './Checkbox.svelte';
    import TextButtonCheckboxInput from './TextButtonCheckbox.svelte';
    import NumberInput from './Number.svelte';

    export let doc;

    $: { updateRecurrence(doc.recur) }
    $: recurrenceText = getRecurrenceText(doc.recurrence);

    function updateRecurrence(recur) {
        if (!recur) {
            // remove recurrence data
            doc.recurrence = {};
        } else if (!Object.hasOwn(doc.recurrence, 'byweekday')){
            // add new oject when existing pattern doesn't exist
            doc.recurrence = new RecurrencePattern;
        }
    }

    // when frequency changes reset values which aren't required
    function updateRecurrenceValues() {
        //console.log('update recurrence required values');        
        let props = Object.keys(RecurrenceDisplayEnums);
        props.forEach( p => {
            if (!RecurrenceDisplayEnums[p].includes(doc.recurrence.freq)) {
                //console.log('reset ' + p);
                doc.recurrence[p] = [];
            } 
        });
    }

    function getRecurrenceText(recurrencePattern) {
        if (Object.hasOwn(recurrencePattern, 'byweekday')) {
            return rruleText( convertToRRule(recurrencePattern) );
        }
    }
    
</script>

<style>
    .recurrenceText {
        margin: 20px 5px;
    }
</style>

<div class="input-group" data-group="recurrence" >
    <CheckboxInput bind:val={doc.recur} label="recur"/>
    {#if doc.recur == true}
        <div class="recurrenceText">
            <p>{recurrenceText}</p>
        </div>

        <div class='input-group'>
            <label for='activity-recurrence-dtstart'>From :</label> 
            <input type='datetime-local' bind:value={doc.recurrence.dtstart} name='activity-recurrence-dtstart'/>
        </div>

        {#if doc.recurrence.dtend !== null }
        <div class='input-group'>
            <label for='activity-recurrence-dtend' >To :</label> 
            <input type='datetime-local' bind:value={doc.recurrence.dtend} name='activity-recurrence-dtend'/>
        </div>
        {/if}


        <div class='input-group'>
            <NumberInput min=1 bind:val={doc.recurrence.interval} name="activity-recurrence-interval" label='Interval'/>
        </div>
        
        <div class='input-group'>
            <label for='activity-recurrence-freq'>Frequency :</label>
            <select bind:value={doc.recurrence.freq} on:change={updateRecurrenceValues} name="activity-recurrence-freq">
                {#each RecurrenceEnums.freq as fStr, i}
                <option value={fStr}>{ capitalize(fStr) }</option>
                {/each}
            </select>
        </div>
            
        {#if RecurrenceDisplayEnums['byweekday'].includes(doc.recurrence.freq) }
            <label for='activity-recurrence-byweekday'>Days :</label>
            <div class="weekdays text-check-buttons">
                {#each RecurrenceEnums.byweekday as DayStr2Chr, i }
                    <TextButtonCheckboxInput 
                        val={ DayStr2Chr }
                        bind:group={ doc.recurrence.byweekday }
                        name="activity-recurrence-byweekday"
                        label={ DayStr2Chr.substring(0,1) }/>
                {/each}
            </div>
        {/if}

        {#if RecurrenceDisplayEnums['bymonthday'].includes(doc.recurrence.freq)}
            <label for='activity-recurrence-bymonthday'>Month days:</label>
            <div class="monthdays text-check-buttons">
                {#each Array(31).keys() as i}
                    <TextButtonCheckboxInput 
                        val={i+1}
                        bind:group={doc.recurrence.bymonthday}
                        name="activity-recurrence-bymonthday"
                        label={i+1}/>
                {/each}
            </div>
        {/if}


        {#if RecurrenceDisplayEnums['bymonth'].includes(doc.recurrence.freq)}
            <label for='activity-recurrence-bymonth'>Months :</label>
            <div class="months text-check-buttons">
                {#each RecurrenceEnums.bymonth as monthNum, i}
                    <TextButtonCheckboxInput 
                        val={i+1}
                        bind:group={doc.recurrence.bymonth}
                        name="activity-recurrence-bymonth"
                        label={monthNum}/>
                {/each}
            </div>
        {/if}

    {/if}
</div>



