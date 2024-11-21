<script>
    import Tag from "./input/Tag.svelte";

	export let tags;
    export let selected = []
    export let disabled = false;

    $: output(selected)

    function output(selected) {
        console.log(selected);
    }
</script>

<style>
</style>

<section class='tags'>
    {#each tags as tag}
		<Tag tagName={tag} bind:group={selected} disabled={disabled}></Tag>
	{/each}
</section>