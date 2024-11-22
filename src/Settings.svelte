<script>
    import { settings } from './lib/stores.js';
    import LightMode from "./LightMode.svelte";
</script>

<style>

</style>

<h2>Settings</h2>
<section>
    <LightMode bind:mode={$settings.lightMode}></LightMode>
</section>