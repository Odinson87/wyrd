<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { SVG } from './lib/vendor/svg.js';
  import { v4 as uuidv4} from 'uuid';

  import { settings } from './lib/stores.js';
  import SuccessIcon from "./lib/icons/success.svelte";
  import ErrorIcon from "./lib/icons/error.svelte";
  import InfoIcon from "./lib/icons/info.svelte";
  import CloseIcon from "./lib/icons/close.svelte";

  const dispatch = createEventDispatcher();

  let svgId = uuidv4();
  export let type = "error";
  export let dismissible = true;

  onMount(() => {
    if ($settings.toastArt) {
      console.log('toast Art');
      let draw = SVG().addTo('#svg' + svgId).size(320, 320);
      let rect = draw.rect(100, 100).attr({ fill: '#f06' })
    }
  });

</script>

<article class={type} role="alert" transition:fade>
  {#if $settings.toastArt }
    <svg id={'svg' + svgId}></svg>
  {/if}
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
</article>

<style lang="postcss">
  article {
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    margin: 0 auto 0.5rem auto;
    width: 20rem;
  }
  .error {
    background: IndianRed;
  }
  .success {
    background: MediumSeaGreen;
  }
  .info {
    background: SkyBlue;
  }
  .text {
    margin-left: 1rem;
  }
  button {
    color: white;
    background: transparent;
    border: 0 none;
    padding: 0;
    margin: 0 0 0 auto;
    line-height: 1;
    font-size: 1rem;
  }
</style>
