<script>
    import { createEventDispatcher } from 'svelte';
    import { addModal, modals } from '../stores.js';
    import { getNewModal } from '../modals.js';

    const dispatch = createEventDispatcher();
    
    let modal;

    function loadModal () {
        modal = getNewModal(modalName);
        modal.source = source;
        modal = addModal(modal);
        const unsubscribe = modals.subscribe((value) => {
            // trigger reactivity on source
            source = source;

            // check if the modal is still open / in the modals array
            let m = value.filter( t => {
                if (t.id === modal.id) {
                    return true
                }
            });
            // auto save source when modal has been closed / no longer in the modals array
            if (m.length === 0) {
                unsubscribe();
                dispatch('save');
            }
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