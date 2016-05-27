d3.select('body')
  .on('dragover', handleDragOver)
  .on('drop', handleFileSelect)
  ;

function handleFileSelect() {
  var event = d3.event
    , files = event.dataTransfer.files
    , about = []
    , shape = null;
  event.stopPropagation();
  event.preventDefault();
  for (var i = 0, file; file = files[i]; i++) {
    readGeojson(file, draw);
  }
}

function readGeojson(file, cb) {
  var reader = new FileReader;
  reader.onload = function(e) {
    cb(e.target.result, file);
  };
  reader.readAsText(file);
}

function handleDragOver() {
  var e = d3.event;
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy'; 
}

function draw(content, file) {
  var json = JSON.parse(content)
  var bounds = json.features.map(function(d){return d3.geo.bounds(d);});
  var bound = [
  [d3.min(bounds,function(d){return d[0][0];}),d3.min(bounds,function(d){return d[0][1];})],
  [d3.max(bounds,function(d){return d[1][0];}),d3.max(bounds,function(d){return d[1][1];})]
  ];
  zoomToLLBounds(bound[0], bound[1])
  // this does not do what it's supposed to do argh hm
  newfile = d3.select('.layer').append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)
    .attr('id','upload')
  
  upload = newfile.append('path')
    .data(json.features)
    .attr('d', tilePath)
    .attr('class','added');

    zoomed()

}

//praise to http://bl.ocks.org/trevorgerhardt/69286b523d00d0d8c3d6
function zoomToLLBounds(nw, se) {
      var pnw = projection(nw);
      var pse = projection(se);

      var scale = zoom.scale();
      var translate = zoom.translate();
      var dx = pse[0] - pnw[0];
      var dy = pse[1] - pnw[1];

      scale = scale * (1 / Math.max(dx / width, dy / height));
      projection
        .translate([ width / 2, height / 2])
        .scale(scale / 2 / Math.PI);

      // reproject
      pnw = projection(nw);
      pse = projection(se);
      var x = (pnw[0] + pse[0]) / 2;
      var y = (pnw[1] + pse[1]) / 2;
      translate = [width - x, height - y];

      zoom
        .scale(scale)
        .translate(translate);

      zoomed(scale, translate);
}
