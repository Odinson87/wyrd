<script>
    export let val = false;
    export let label;
    export let group;
    let selected = []
</script>

<style>
    label {
        position: relative;
        margin-right: 5px;
        height:30px;
        width:30px;
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
        top: 0px;
        left: 0;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-color: #eee;
        text-align: center;
        line-height: 2.5em;
    }

    label:hover input ~ .checkmark { background-color: #ccc; }
    label input:checked ~ .checkmark { background-color: #52aa17; }

</style>

<label>
    <input type='checkbox' checkgroup={group} bind:group={selected} bind:checked={val} bind:value={val}>
    <span class="checkmark">{label}</span>
</label>