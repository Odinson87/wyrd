<script>
    let term;
    export let source = [];
    export let results = [];
    export let label;
    export let name;

    function search() {
        if(term === ''){
            results = source;
        } else {

            if (typeof(term) !== 'undefined' && term !== null && term !== '') {
                console.log(term);
                if (source) {
                    results = results;
                }
                let termParts = term.toLowerCase().split(' ');
                
                results = source.filter((val) =>  {
                    let v = val.toLowerCase();
                    let found = 1;
                    
                    // check if array value string contains all search term parts
                    termParts.forEach((p) => {
                        if (v.indexOf(p) < 0) {
                            found = 0;
                        }                
                    });
                    return found === 0 ? false : true
                }).sort();
            }
        }
    }
</script>
        
{#if typeof(label) !== "undefined" }
<label for={name}>{label}:</label>
{/if}
<input name={name} type='search' on:keyup={search} bind:value={term}>
