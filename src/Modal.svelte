<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import CloseIcon from "./lib/icons/close.svelte";


    const dispatch = createEventDispatcher();

    export let source;
    export let modal;
</script>

{#if modal }

<section name={modal.title} transition:fade>

  {#if modal.title }
    <h2>{ modal.title }</h2>
  {/if}
  
  {#if modal.message }
    <p>{ modal.message }</p>
  {/if}
  
  {#if modal.component }
      <svelte:component bind:source={source} this={modal.component}/>
  {/if}

  <button class="close" on:click={() => dispatch("dismiss")}>
    <CloseIcon width="0.8em" />
  </button>

</section>

{:else}

<section transition:fade>
    <p>This is not the modal you're looking for....</p>
    <button class="close" on:click={() => dispatch("dismiss")}>
      <CloseIcon width="0.8em" />
    </button>
</section>

{/if}
