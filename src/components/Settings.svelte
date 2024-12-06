<script>
    import { settings } from '../lib/stores.js';
    import LightModeBtn from "../lib/input/LightModeBtn.svelte";
</script>

<style>
    h2 { text-align: center; }
</style>

<section>
    <h2>Settings</h2>
    <LightModeBtn bind:value={$settings.lightMode}></LightModeBtn>
</section>