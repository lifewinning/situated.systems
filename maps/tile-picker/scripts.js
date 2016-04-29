var origin = [-122.4350,37.7185, 13];
if (window.location.hash) {
  origin = window.location.hash.slice(1)
    .split("/").map(function(n){ return Number(n); });
}

var width = window.innerWidth,
    height = window.innerHeight,
    prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);

var tile = d3.geo.tile()
    .size([width, height]);

var projection = d3.geo.mercator()
     .scale((1 << (8 + origin[2])) / 2 / Math.PI)
     .translate([-width / 2, -height / 2]); // just temporary

var tileProjection = d3.geo.mercator();

var tilePath = d3.geo.path()
    .projection(tileProjection);

var zoom = d3.behavior.zoom()
    .scale(projection.scale() * 2 * Math.PI)
    .scaleExtent([1 << 12, Infinity]) // 12 to 25 is roughly z4-z5 to z17
    .translate(projection([origin[0], origin[1]]).map(function(x) { return -x; }))
    .on("zoom", zoomed)

var map = d3.select("body").append("div")
    .attr("class", "map")
    .style("width", width + "px")
    .style("height", height + "px")
    .call(zoom).on("dblclick.zoom", null);

var layer = map.append("div")
    .attr("class", "layer");

var zoom_controls = map.append("div")
    .attr("class", "zoom-container");

var zoom_in = zoom_controls.append("a")
    .attr("class", "zoom")
    .attr("id", "zoom_in")
    .text("+");

var zoom_out = zoom_controls.append("a")
    .attr("class", "zoom")
    .attr("id", "zoom_out")
    .text("-");

var info = map.append("div")
    .attr("class", "info")
    .html('<a href="http://bl.ocks.org/mbostock/5593150" target="_top">Mike Bostock</a> | © <a href="https://www.openstreetmap.org/copyright" target="_top">OpenStreetMap contributors</a> | <a href="https://mapzen.com/projects/vector-tiles" title="Tiles courtesy of Mapzen" target="_top">Mapzen</a>');

 var download = map.append("div")
    .attr("class", "download")


zoomed();

// Resize when window resizes
window.onresize = function () {
  width = window.innerWidth;
  height = window.innerHeight;
  map.style("width", width + "px")
    .style("height", height + "px");
  tile = d3.geo.tile()
    .size([width, height]);
  zoomed();
}

function zoomed() {
  var tiles = tile
      .scale(zoom.scale())
      .translate(zoom.translate())
      ();

  projection
      .scale(zoom.scale() / 2 / Math.PI)
      .translate(zoom.translate());

  var zoomLevel = tiles[0][2],
  mapCenter = projection.invert([width/2, height/2]);

  // adding zoom level as a class  
  d3.select(".layer").attr("class",function(){ return "layer z"+zoomLevel; });
  // url hash for the location
  window.location.hash = [mapCenter[0].toFixed(5), mapCenter[1].toFixed(5), zoomLevel].join("/");

  var image = layer
      .style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
      .selectAll(".tile")
      .data(tiles, function(d) { 
        return d; 
        console.log(d) });
  image.exit()
      .each(function(d) { this._xhr.abort(); })
      .remove();

  image.enter().append("svg")
      .attr("class", "tile")
      .attr("id", function(d){return "tile_"+zoomLevel+'_'+d[0]+'_'+d[1]})
      //add id using position onscreen
      .style("left", function(d) { return d[0] * 256 + "px"; })
      .style("top", function(d) { return d[1] * 256 + "px"; })
      .each(window.renderTiles);
}

function matrix3d(scale, translate) {
  var k = scale / 256, r = scale % 1 ? Number : Math.round;
  return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ")";
}

function prefixMatch(p) {
  var i = -1, n = p.length, s = document.body.style;
  while (++i < n) if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
  return "";
}

function formatLocation(p, k) {
  var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
  return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " "
       + (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
}

// zoom controls

function interpolateZoom (translate, scale) {
    var self = this;
    return d3.transition().duration(350).tween("zoom", function () {
        var iTranslate = d3.interpolate(zoom.translate(), translate),
            iScale = d3.interpolate(zoom.scale(), scale);
        return function (t) {
            zoom
                .scale(iScale(t))
                .translate(iTranslate(t));
            zoomed();
        };
    });
}

function zoomClick() {
    var clicked = d3.event.target,
        direction = 1,
        factor = 0.2,
        target_zoom = 1,
        center = [width / 2, height / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

    d3.event.preventDefault();
    direction = (this.id === 'zoom_in') ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
}

d3.selectAll('a.zoom').on('click', zoomClick);


// Hide zoom control on touch devices, which interferes with project page navigation overlay
if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
  document.getElementsByClassName('zoom-container')[0].style.display = 'none';
}

