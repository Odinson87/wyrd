<script>
    import Burger from "./lib/icons/burger.svelte";
    import Cog from "./lib/icons/cog.svelte";
    import Menu from "./lib/Menu.svelte";
    import LightMode from "./LightMode.svelte";

    export let lightMode;
</script>

<style>
    header {
        display: flex;
	    justify-content: space-between;
    }
</style>

<header>
    <Menu viewmode='hidden' align='left'>
        <Burger slot='icon'/>
        <ul slot='items'>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
            <li>Item 4</li>
        </ul>
    </Menu>
    <div id=logo></div>
    <Menu viewmode='hidden' align='right'>
        <Cog slot='icon'/>
        <ul slot='items'>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
            <li>Item 4</li>
            <LightMode bind:mode={lightMode}></LightMode>
        </ul>
    </Menu>
</header>