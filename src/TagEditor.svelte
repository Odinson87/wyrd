<script>
    
    export let tags = [];

</script>

<section name='tag-editor'>
        Tag Editor Here

    {#each tags as tagName}
        <p>{ tagName }</p>
    {/each}
</section>