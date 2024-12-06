<script>
    import ActiveIcon from "../lib/icons/active.svelte";
    import BurgerIcon from "../lib/icons/burger.svelte";
    import CogIcon from "../lib/icons/cog.svelte";
    import Menu from "../lib/components/Menu.svelte";
    import MenuItem from '../lib/components/MenuItem.svelte';
    import Settings from "../components/Settings.svelte"
</script>

<style>
    header {
        display: flex;
	    justify-content: space-between;
    }
</style>

<header>
    <Menu viewmode='hidden' align='left'>
        <BurgerIcon slot='icon'/>
        <section slot='items'>
            <MenuItem label='Activities'>
                <ActiveIcon slot='icon'></ActiveIcon>
            </MenuItem>
        </section>
    </Menu>
    <div id=logo></div>
    <Menu viewmode='hidden' align='right'>
        <CogIcon slot='icon'/>
        <Settings slot='items'/>
    </Menu>
</header>