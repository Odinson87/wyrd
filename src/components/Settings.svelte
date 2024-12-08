<script>
    import { settings } from '../lib/stores.js';
    import LightModeBtn from "../lib/input/LightModeBtn.svelte";
    import PaletteIcon from '../lib/icons/palette.svelte';
    import MenuItem from '../lib/components/MenuItem.svelte';
  import Toggle from '../lib/input/Toggle.svelte';
</script>

<style>
    h2 { text-align: center; }
</style>

<section>
    <h2>Settings</h2>
    <MenuItem label='Notification Art'>
        <PaletteIcon slot=icon/>
        <Toggle slot='control' bind:value={$settings.toastArt}/>
    </MenuItem>
    <LightModeBtn bind:value={$settings.lightMode}></LightModeBtn>
</section>