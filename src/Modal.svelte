<script>
    import { modals} from './lib/modals';

    let modal = null;
    export let modalName;

    $: { showModal(modalName) }

    function showModal(modalName) {
      console.log(modalName);
      if (Object.hasOwn(modals, modalName)) {
          modal = modals[modalName];
      } else {
          modal = null;
      }
    }
</script>

{#if modal }

    {#if modal.title }
      <h2>{ modal.title }</h2>
    {/if}

    {#if modal.message }
      <p>{ modal.message }</p>
    {/if}

    {#if modal.component }
        <svelte:component this={modal.component} {...modal.data}/>
    {/if}
{:else}
  <p>This is not the modal you're looking for....</p>
{/if}
