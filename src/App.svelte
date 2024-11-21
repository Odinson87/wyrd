<script>
    import DocBrowser from './DocBrowser.svelte';
    import LightMode from './LightMode.svelte';
    import Toasts from './Toasts.svelte';

    export let lightMode = 0;
</script>

<Toasts/>

<LightMode bind:mode={lightMode} />

<main data-light-mode={lightMode}>
    <DocBrowser/>
</main>