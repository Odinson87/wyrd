<script>
    import DocBrowser from './DocBrowser.svelte';
    import Navigation from './Navigation.svelte';
    import Toasts from './Toasts.svelte';

    export let lightMode = 0;
</script>

<Toasts/>
<div data-light-mode={lightMode}>
    <Navigation bind:lightMode={lightMode}/>
    
    <main>
        <DocBrowser/>
    </main>
</div>