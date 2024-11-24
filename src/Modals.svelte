<script>
  import { fade } from "svelte/transition";
  import Modal from "./Modal.svelte";
  import { dismissModal, modals} from "./lib/stores.js";
</script>

{#if $modals}
  <section name='modals' transition:fade>
    {#each $modals as modal (modal.id)}
      <Modal
        modal={modal}
        bind:source={modal.source}
        on:dismiss={() => dismissModal(modal.id)}/>
    {/each}
  </section>
{/if}
