<script>
    export let iconSide = 'left';
    export let label;
</script>

<style>
    .menu-item {
        display: flex;
        margin: 15px 0px;
        justify-content: space-between;
    }

    .menu-item > h3 {
        font-weight: 500;
        margin:4px 20px;
    }
    .menu-icon {
        width:30px;
        height:30px;
    }
</style>

<button class='menu-item'>
    {#if iconSide === 'right'}
        <slot name='control'/>
    {/if}

    {#if iconSide === 'right'}
        <h3>{ label }</h3>
    {/if}

    <slot class='menu-icon' name='icon' />

    {#if iconSide === 'left'}
        <h3>{ label }</h3>
    {/if}

    {#if iconSide === 'left'}
        <slot name='control'/>
    {/if}
</button>
