<script>
    import DarkLightIcon from "./lib/icons/dark-light.svelte";
 
    export let mode = 0;

    function toggle() {
        mode = mode === 0 ? 1 : 0;
        console.log(mode);
    }
</script>

<style>
    button#light-mode {
        border-radius: 50%;
        margin:10px;
    }
</style>

<button id='light-mode' on:click={toggle}>
    <DarkLightIcon/>
</button>