<script>
    export let iconAlign = 'left';
    export let label;
</script>

<style>
    .menu-item > h3 {
        font-weight: 500;
        margin:4px 8px;
    }
    .menu-icon {
        width:30px;
        height:30px;
    }
</style>

<button class='menu-item'>
    {#if iconAlign === 'right'}
        <h3>{ label }</h3>
    {/if}

    <slot class='menu-icon' name='icon'></slot>

    {#if iconAlign === 'left'}
        <h3>{ label }</h3>
    {/if}
</button>
