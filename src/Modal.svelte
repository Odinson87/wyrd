<script>
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "./lib/icons/close.svelte";


    const dispatch = createEventDispatcher();

    export let source;
    export let modal;
</script>

{#if modal }

<section name={modal.title}>
<div class="content">
  {#if modal.title }
    <h2>{ modal.title }</h2>
  {/if}
  
  {#if modal.message }
    <p>{ modal.message }</p>
  {/if}
  
  {#if modal.component }
      <svelte:component bind:source={source} this={modal.component} {...modal.data}/>
  {/if}

  <button class="close" on:click={() => dispatch("dismiss")}>
    <CloseIcon width="1.5em" />
  </button>
</div>
</section>

{:else}

<section>
    <p>This is not the modal you're looking for....</p>
    <button class="close" on:click={() => dispatch("dismiss")}>
      <CloseIcon width="1.5em" />
    </button>
</section>

{/if}
