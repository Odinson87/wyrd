<script>
    import { createEventDispatcher, onMount } from "svelte";
    import CloseIcon from "../lib/icons/close.svelte";
    const dispatch = createEventDispatcher();

    export let source;
    export let modal;

    function dismissModal() {
        dispatch("dismiss");
    }
</script>

<style>
    .modal {
        z-index:500;
        overflow: scroll;
    }

    button.close {
        position: fixed;
        top: 10px;
        right: 20px;
        color: white;
        background: transparent;
        border: 0 none;
        padding: 0;
        line-height: 1;
        font-size: 1rem;
    }
</style>

{#if modal}
<section class='modal' name={modal.title}>
    <button class="close" on:click={dismissModal}>
        <CloseIcon />
    </button>
    <div class="content">
        {#if modal.title}
            <h2>{modal.title}</h2>
        {/if}

        {#if modal.message}
            <p>{modal.message}</p>
        {/if}

        {#if modal.component}
            <svelte:component this={modal.component} bind:source {...modal.data} />
        {/if}
    </div>
</section>
{:else}
  <section>
    <p>This is not the modal you're looking for....</p>
    <button class="close" on:click={dismissModal}>
      <CloseIcon width="1.5em" />
    </button>
  </section>
{/if}
