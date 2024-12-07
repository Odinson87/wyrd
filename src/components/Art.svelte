<script>
    export let viewBoxSize = 270;
    export let width = 270;
    export let height = 270;
    export let layerCount = 1;

    $: rv = referenceValues(viewBoxSize, layerCount);
    $: layers = getLayers(layerCount);

    function viewBoxCoords(v, zeroCenter = false) {
        if (zeroCenter) {
            return  (0 - v/2) + ' ' + (0 - v/2) + ' ' + v + ' ' + v;
        } else {
            return  '0 0 ' + v + ' ' + v;
        }
    }

    function referenceValues(vBs, lC) {
        return {
            s80 : vBs * 0.8,
            r80 : vBs * 0.4,
            s50 : vBs * 0.5 ,
            m : 10,
            points : 5
        }
    }

    function getLayers(i) {
        let l = [];
        for (let i=0; i<layerCount; i++) {
            l.push(i++);
        }
        return l;
    }

    function getVertexCoords(x = 0, y = 0, r = 1, n = 7, shift = 0) {
        let coords = [];
        let closeCoords = [];
        for (let i = 1; i <= n; i++) {
            coords.push([
                x + r * Math.cos(2 * Math.PI * i / n), 
                y + r * Math.sin(2 * Math.PI * i / n),
            ]);
            // keep return point
            if (i === 1) {
                closeCoords = coords[0];
            }
        }

        // shift the order in which the points join
        // creating stars when given odd number of nodes
        if (shift > 0 && n%2 > 0) {
            let shifted = [];
            let i = 0;
            let added = 0;
            while ( added <= n ) {
                // start
                shifted.push(coords[i]);
                // skip points
                let next = i+1+shift;
                if (next >= n) {
                    next = next - n;
                }
                console.log(i, next)
                i = next;
                added++;
            }
            return shifted;
        }

        // add return point
        coords.push(closeCoords);
        return coords;
    }

    function getVertexCoordsStr(x = 0, y = 0, r = 1, n = 7, shift = 0){
        let coords = getVertexCoords(x, y, r, n, shift);
        console.log(coords);
        return coords.map((v) => {return v.join(', ')}).join(' ');
    }

</script>

<svg width={width} height={height} viewBox={viewBoxCoords(viewBoxSize, true)} xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="Gradient1">
          <stop offset="0%" stop-color="green" />
          <stop offset="100%" stop-color="white" />
        </linearGradient>
        
        <symbol 
            id='circle'
            viewBox={viewBoxCoords(rv.s80)}
            width={rv.s80}
            height={rv.s80}
            >
            <circle cx={rv.s80/2} cy={rv.s80/2} r={rv.r80 - rv.m} />
        </symbol>
    
        <symbol
            id='rect'
            viewBox={viewBoxCoords(rv.s80)}
            width={rv.s80}
            height={rv.s80}
            >
            <rect x={rv.m} y={rv.m} width={rv.s80 - (rv.m*2)} height={rv.s80 - (rv.m*2)} fill='none' />
        </symbol>

        <symbol
            id='polyline'
            viewBox={viewBoxCoords(rv.s80)}
            width={rv.s80}
            height={rv.s80}>

            <polyline points={getVertexCoordsStr(rv.s80/2, rv.s80/2, rv.r80 - rv.m, rv.points, 1)} />
        </symbol>
    </defs>
    {#each layers as layer}
        <use 
            href='#circle'
            x={0 - (rv.s80/2)}
            y={0 - (rv.s80/2)}
            style="opacity:1.0"
            stroke='url(#Gradient1)' 
            stroke-width='3'
            />

        <use 
            href='#rect'
            x={0 - (rv.s80/2)}
            y={0 - (rv.s80/2)}
            style="opacity:1.0"
            stroke='url(#Gradient1)' 
            stroke-width='3'
            transform='rotate(45)'
            />

        <use
            href='#polyline'
            x={0 - (rv.s80/2)}
            y={0 - (rv.s80/2)}
            style="opacity:1.0"
            stroke='url(#Gradient1)' 
            stroke-width='3'
            transform='rotate({ 360/4/rv.points })'
            />

    {/each}    
</svg>