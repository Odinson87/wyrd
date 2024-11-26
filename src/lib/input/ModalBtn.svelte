<script>
    import { addModal, modals } from '../stores.js';
    import { getNewModal } from '../modals.js';

    let modal;

    function loadModal () {
        modal = getNewModal(modalName);
        modal.source = source;
        modal = addModal(modal);
        
        // add reactivity to re-render when modal object is updated
        modals.subscribe((value) => {
            source = source;
        }); 
    }

    export let classes = '';
    export let modalName;
    export let source;
    export let btnTitle;

</script>

<button class={ classes + ' icon'} on:click={loadModal}>
    <slot name='icon'></slot>
    {#if btnTitle }
        { btnTitle }
    {/if}
</button>