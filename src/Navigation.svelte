<script>
    import Burger from "./lib/icons/burger.svelte";
    import Cog from "./lib/icons/cog.svelte";
    import Menu from "./lib/Menu.svelte";
    import Settings from "./Settings.svelte"
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
        <Settings slot='items'/>
    </Menu>
</header>