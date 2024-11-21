<script>
    import Tag from "./input/Tag.svelte";

    export let name;
    export let classes = ['tags'];
	export let tags;
    export let selected = [];
    export let disabled = false;
    export let selectMax = 0;

</script>

<style>
</style>

<section class='{['tags'].concat(classes).join(' ')}' name={name}>
    {#each tags as tag}
		<Tag tagName={tag} selectMax={selectMax} bind:group={selected} disabled={disabled}></Tag>
	{/each}
</section>