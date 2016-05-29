selectedTiles = []

function renderTiles(d){
  vid = "vtile_"+d[0]+"_"+d[1]+"_"+d[2]
    var width = window.innerWidth,
  height = window.innerHeight
  var layers = ['water', 'landuse', 'roads', 'buildings'];
 
 var projection = d3.geo.mercator()
   .scale((1 << (8 + d[0])) / 2 / Math.PI)
   .translate([-width / 2, -height / 2]);
  zoom = 12;
  var path = d3.geo.path()
  .projection(projection);

  var svg = d3.select('body').append('svg')
  .attr("id", vid)
  .attr("height", 256+"px")
  .attr("width", 256+"px")
  ;
  this._xhr = d3.json("https://vector.mapzen.com/osm/all/"+d[0]+"/"+d[1]+"/"+d[2]+".json?api_key=vector-tiles-LM25tq4", function(error, data) {
    var k = Math.pow(2, d[0]) * 256; // size of the world in pixels
      path.projection()
          .translate([k / 2 - d[1] * 256, k / 2 - d[2] * 256]) // [0°,0°] in pixels
          .scale(k / 2 / Math.PI)
          .precision(0);

    var features = [];
    layers.forEach(function(layer){
      if(data[layer])
      {
          for(var i in data[layer].features)
          {
              // Don't include any label placement points
              if(data[layer].features[i].properties.label_placement == 'yes') { continue }
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
      .attr("d", path);
  });
  gather = document.querySelector('#'+vid)
  gatherPaths(gather)

}
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
  }

function downloadTiles(array){
  array.forEach(function(a){
    var blob = new Blob([a.paths], {type: 'image/svg+xml'})
    saveAs(blob, a.id+'.svg');
  })
}
