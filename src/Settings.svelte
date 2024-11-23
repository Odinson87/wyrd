<script>
    import { settings } from './lib/stores.js';
    import LightMode from "./LightMode.svelte";
</script>

<style>
    h2 { text-align: center; }
</style>

<section>
    <h2>Settings</h2>
    <LightMode bind:value={$settings.lightMode}></LightMode>
</section>