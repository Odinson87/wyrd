<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  //import { SVG } from '../lib/vendor/svg.js';
  import { v4 as uuidv4} from 'uuid';

  import { settings } from '../lib/stores.js';
  import SuccessIcon from "../lib/icons/success.svelte";
  import ErrorIcon from "../lib/icons/error.svelte";
  import InfoIcon from "../lib/icons/info.svelte";
  import CloseIcon from "../lib/icons/close.svelte";
  import Art from './Art.svelte';

  const dispatch = createEventDispatcher();

  let svgId = uuidv4();
  let hasArt = false;
  export let type = "error";
  export let dismissible = true;

  onMount(() => {
    if ($settings.toastArt) {
      hasArt = true;
      console.log('toast Art');
      /*
      let draw = SVG().addTo('#svg' + svgId).size(270, 270);
      let symbol = draw.symbol();  
      symbol.rect(100, 100).attr({ fill: '#f06' });
      draw.use(symbol).move(100, 100);
      draw.use(symbol).move(10, 20).rotate(45).fill({ color: '#000', opacity: 0.6 });
      */
    }
  });

</script>

<article class={type} class:art={hasArt} role="alert" transition:fade>
  <div class="content">
    {#if type === "success"}
    <SuccessIcon width="1.1em" />
    {:else if type === "error"}
    <ErrorIcon width="1.1em" />
    {:else}
    <InfoIcon width="1.1em" />
    {/if}
    
    <div class="text">
      <slot />
    </div>
    
    {#if dismissible}
    <button class="close" on:click={() => dispatch("dismiss")}>
      <CloseIcon width="0.8em" />
    </button>
    {/if}
  </div>
  {#if $settings.toastArt }
    <div class='art' id={'svg' + svgId}>
      <Art/>
    </div>
  {/if}
</article>

<style lang="postcss">
  article {
    color: white;
    border-radius: 0.4rem;
    border: none;
    margin: 0 auto 0.5rem auto;
    width: 20rem;
  }
  article .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .error {
    background: rgb(122, 53, 53);
  }
  .success {
    background: rgb(29, 80, 52);
  }
  .info {
    background: #222
  }
  button {
    color: white;
    background: transparent;
    border: 0 none;
    padding: 0;
    line-height: 1;
    font-size: 1rem;
  }

  .content {
    margin: 0.3em 0.5em;
  }
</style>
