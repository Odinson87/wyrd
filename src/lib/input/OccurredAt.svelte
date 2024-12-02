<script>
    import { ago } from '../time.js';
    
    export let name;
    export let occurredAt;
    export let agoStr;
    export let disabled = false;

    $: agoStr = ago(occurredAt);
    $: setOccurred(occurredAt);  

    function setOccurred(isoString = null) {
        if (isoString === null || isoString !== '') {
            occurredAt = isoString;
        }
    }
</script>

<style>
    [type="datetime-local"] {
        font-size: 15px;
    }
</style>
<div>
    <label for={name}>Occurred :</label>
    <p>{agoStr}</p>
</div>
<div>
    <label for={name}>At :</label>
    <input name={name} disabled={disabled} type='datetime-local' bind:value={occurredAt}>
</div>