selectedTiles = []
previewTiles = []

  function gatherPaths(s){
    nodes = Array.from(s.childNodes)
    saveSVG = document.createElement('svg')
    nodes.forEach(function(n){
      style = window.getComputedStyle(n)
      n.setAttribute('fill', style.fill)
      n.setAttribute('stroke',style.stroke)
      n.setAttribute('stroke-width',style.strokeWidth)
      //maybe don't append things if you can't see them ugh fix this later
      if (n.fill !== 'none'){
        newnode = n.cloneNode()
        saveSVG.appendChild(newnode) 
      }
      if (n.stroke !== 'none'){
        newnode = n.cloneNode()
        saveSVG.appendChild(newnode) 
      }
      
    }) 
    obj = {}
    file = d3.select(saveSVG)
    .attr('height', 256)
    .attr('id',s.id)
    .attr('width',256)
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    //hacky way to store ID
    obj.id = s.id
    obj.paths = file[0][0].outerHTML
    selectedTiles.push(obj)
    //toPNG(s)
    s.style.border = '3px dotted green'
  }

  // not sure this actually needs to be part of the thing/needs debugging
  function toPNG(s){
    //https://gist.github.com/gustavohenke/9073132
    var svgData = new XMLSerializer().serializeToString( s );

    var canvas = document.createElement( "canvas" );
    // var svgSize = s.getBoundingClientRect();
    // canvas.width = (svgSize.width*1.25)/2;
    // canvas.height = svgSize.height/2;
    canvas.id = s.id;
    var ctx = canvas.getContext( "2d" );

    var img = document.createElement( "img" );
    img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );

    img.onload = function() {
        ctx.drawImage( img, 0, 0, canvas.width, canvas.height);
        previewTiles.push(canvas)

    }

  }
  var layers = ['water', 'landuse', 'roads', 'buildings'];
  window.renderTiles = function(d) {
    var svg = d3.select(this);
    var zoom = d[2];
    this._xhr = d3.json("https://vector.mapzen.com/osm/all/" + zoom + "/" + d[0] + "/" + d[1] + ".json?api_key=vector-tiles-LM25tq4", function(error, data) {
      var k = Math.pow(2, d[2]) * 256; // size of the world in pixels
      tilePath.projection()
          .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256]) // [0°,0°] in pixels
          .scale(k / 2 / Math.PI)
          .precision(0);

      // build up a single concatenated array of all tile features from all tile layers
      var features = [];
      layers.forEach(function(layer){
        if(data[layer])
        {
            for(var i in data[layer].features)
            {
                // Don't include any label placement points
                if(data[layer].features[i].properties.label_placement == 'yes') { continue }
                
                // Don't show large buildings at z13 or below.
                if(zoom <= 13 && layer == 'buildings') { continue }
                
                // Don't show small buildings at z14 or below.
                if(zoom <= 14 && layer == 'buildings' && data[layer].features[i].properties.area < 2000) { continue }
                
                data[layer].features[i].layer_name = layer;
                features.push(data[layer].features[i]);
            }
        }
      });

      // put all the features into SVG paths
      svg.selectAll("path")
        .data(features.sort(function(a, b) { return a.properties.sort_key ? a.properties.sort_key - b.properties.sort_key : 0 }))
      .enter().append("path")
        .attr("class", function(d) { var kind = d.properties.kind || ''; if(d.properties.boundary=='yes'){kind += '_boundary';} return d.layer_name + '-layer ' + kind; })
        .attr("d", tilePath);

    });
    svg.on('dblclick', function() {
      d = document.querySelector('.download')
      d.width = 275+'px';
      d.innerHTML = "<a id = 'download' onclick='downloadSVGs(selectedTiles)'>Download "+(1+selectedTiles.length)+" Selected Tiles</a>"
      gatherPaths(this)    
    });

  };
  function downloadSVGs(array){
    array.forEach(function(a){
      var blob = new Blob([a.paths], {type: 'image/svg+xml'})
      saveAs(blob, a.id+'.svg');
    })
  }
  function preview(array){
    array.forEach(function(a){
      d = document.querySelector('.download')
      d.appendChild(a)
    })
  }