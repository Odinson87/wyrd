<script>
  import { createEventDispatcher, onMount } from "svelte";
  import CloseIcon from "./lib/icons/close.svelte";


    const dispatch = createEventDispatcher();

    export let source;
    export let modal;

    function dismissModal() {
        dispatch("dismiss");
    }
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

  <button class="icon close" on:click={dismissModal}>
    <CloseIcon width="1.5em" />
  </button>
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
