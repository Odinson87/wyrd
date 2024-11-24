<script>
  import Modal from "./Modal.svelte";
  import { dismissModal, modals} from "./lib/stores.js";
</script>

{#if $modals}
  <section name='modals'>
    {#each $modals as modal (modal.id)}
      <Modal
        modal={modal}
        bind:source={modal.source}
        on:dismiss={() => dismissModal(modal.id)}/>
    {/each}
  </section>
{/if}

<style lang="postcss">
  section {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    flex-direction: column;
    z-index: 1000;
  }
</style>
