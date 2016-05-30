function addvector(){

var width = window.innerWidth,
    height = window.innerHeight
  var tile = d3.geo.tile()
      .size([width, height]);

  var origin = [-122.4350,37.7185, 13];
  if (window.location.hash) {
    origin = window.location.hash.slice(1)
      .split("/").map(function(n){ return Number(n); });
  }
  
  // console.log(origin)

    var projection = d3.geo.mercator()
      // .scale((1 << 12) / 2 / Math.PI)
      // .translate([width / 2, height / 2]);
     .scale((1 << (8 + origin[2])) / 2 / Math.PI)
     .translate([-width / 2, -height / 2]); // just temporary
     
  var center = projection([origin[0],origin[1]]);

  var path = d3.geo.path()
      .projection(projection);

  var zoom = d3.behavior.zoom()
      .scale(projection.scale() * 2 * Math.PI)
      .scaleExtent([1 << 11, Infinity])
      .translate([width - center[0], height - center[1]])
      .on("zoom", zoomed);

  // With the center computed, now adjust the projection such that
  // it uses the zoom behavior’s translate and scale.
  projection
      .scale(1 / 2 / Math.PI)
      .translate([0, 0]);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "upload")
      .attr("fill","none");

  var raster = svg.append("g");

  var v = svg.append("g").attr("id", "vector");

  var vector = v.append("path")

  d3.json("us.json", function(error, us) {
    if (error) throw error;

    svg.call(zoom);
    vector.attr("d", path(topojson.mesh(us, us.objects.counties))).attr("class","added");
    zoomed();
   });

  function zoomed() {
    var tiles = tile
        .scale(zoom.scale())
        .translate(zoom.translate())
        ();
    console.log(zoom.translate())
    
    vector
        .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
        .style("stroke-width", 1 / zoom.scale());
  }
}
