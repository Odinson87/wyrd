<script>
    import DocBrowser from './components/DocBrowser.svelte';
    import Navigation from './components/Navigation.svelte';
    import Toasts from './components/Toasts.svelte';
    import Modals from './components/Modals.svelte';
    import { settings } from './lib/stores.js';

</script>

<div data-light-mode={$settings.lightMode}>
    <Toasts/>
    <Navigation/>

    <main>
        <DocBrowser/>
    </main>

    <Modals/>
</div>