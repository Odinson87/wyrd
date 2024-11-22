<script>
    import { slide } from 'svelte/transition'

    export let viewmode;
    export let align;

    function toggle(){
        viewmode = viewmode === 'open' ? 'hidden' : 'open';
    }
</script>

<style>
    button {
        background-color: transparent;
        border-color: transparent;
        cursor: pointer;
    }
    button:hover {
        filter: brightness(130%);
    }
    aside {
        position:absolute;
        top:2.75em;
        width: 320px;
    }
    aside.left {
        left:0;
        border-bottom-right-radius: 8px;
    }
    aside.right {
        right:0;
        border-bottom-left-radius: 8px;
    }
</style>


<button class='icon' on:click={toggle}>
    <slot name=icon></slot>
</button>
<aside class={align} data-viewmode={viewmode}>

<slot name='items'></slot>

</aside>