<script>
    import Tag from "./Tag.svelte";

    export let name;
    export let classes = [];
	export let tags;
    export let selected = [];
    export let value;
    export let disabled = false;
    export let selectMax = 0;
</script>

<style>
</style>

<section class='{['tags'].concat(classes).join(' ')}' name={name}>
    {#each tags as tag}
		<Tag tagName={tag} selectMax={selectMax} bind:selectedVal={value} bind:group={selected} disabled={disabled}></Tag>
	{/each}
</section>