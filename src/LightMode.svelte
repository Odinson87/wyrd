<script>
    import DarkLightIcon from "./lib/icons/dark-light.svelte";
 
    export let value = 0;

    function toggle() {
        value = value === 0 ? 1 : 0;
    }
</script>

<style>
    button#light-mode {
        border-radius: 50%;
    }
</style>

<button id='light-mode' on:click={toggle}>
    <DarkLightIcon/>
</button>