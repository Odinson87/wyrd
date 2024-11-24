<script>
    import DocBrowser from './DocBrowser.svelte';
    import Navigation from './Navigation.svelte';
    import Toasts from './Toasts.svelte';
    import Modals from './Modals.svelte';
    import { settings } from './lib/stores.js';

</script>

<Toasts/>
<div data-light-mode={$settings.lightMode}>
    <Navigation/>

    <main>
        <DocBrowser/>
    </main>

    <Modals/>
</div>