<script>
    import { addModal, modals } from '../stores.js';
    import { getNewModal } from '../modals.js';

    let modal;

    function loadModal () {
        modal = getNewModal(modalName);
        modal.source = source;
        modal = addModal(modal);
        
        // add reactivity
        modals.subscribe((value) => {
            source = source;
        }); 
    }

    export let modalName;
    export let source;

</script>

<button on:click={loadModal}>
   Manage Tags
</button>