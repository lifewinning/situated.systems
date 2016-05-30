selectedTiles = []
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
dl = document.querySelector('.download')

dl.innerHTML = "<a id = 'download' onclick='downloadSVGs()'>Download Just The GeoJSON</a><br><a onclick='collectTiles()'>Download With Base Tiles</a>"

var json = JSON.parse(content)
var newlayer = L.geoJson(json)
newlayer.addTo(map)
map.fitBounds(newlayer.getBounds())

}

function collectTiles(){
  tileArray = []
  img = document.querySelectorAll('.leaflet-tile-loaded')


  for (var i = 0; i < img.length; i++) {
    tileArray.push(img[i].dataset.tileKey)
  }

  tileArray.forEach(function(t){
    newtile = t.split('/')
    newtile = [parseInt(newtile[2]), parseInt(newtile[0]), parseInt(newtile[1])]
    console.log(newtile)
    renderTiles(newtile)
  })
  dl = document.querySelector('.download')
  dl.innerHTML = "<a id = 'download' onclick='downloadAll()'>Tiles Collected! Download All</a>"

}



function downloadSVGs(){

  // clippy = svg.append('clipPath').attr("height", height).attr("width", width).attr("id","clippy")

  s = document.querySelector('g')
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
    file = d3.select(saveSVG)
    .attr('height', window.innerHeight)
    .attr('width',window.innerWidth)
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    //hacky way to store ID
    paths = file[0][0].outerHTML
    var blob = new Blob([paths], {type: 'image/svg+xml'})
    saveAs(blob, 'overlay.svg')
}

function downloadAll() {
  downloadSVGs()
  downloadTiles()
}
// //praise to http://bl.ocks.org/trevorgerhardt/69286b523d00d0d8c3d6
// function zoomToLLBounds(nw, se) {
//       var pnw = projection(nw);
//       var pse = projection(se);

//       var scale = zoom.scale();
//       var translate = zoom.translate();
//       var dx = pse[0] - pnw[0];
//       var dy = pse[1] - pnw[1];

//       scale = scale * (1 / Math.max(dx / width, dy / height));
//       projection
//         .translate([ width / 2, height / 2])
//         .scale(scale / 2 / Math.PI);

//       // reproject
//       pnw = projection(nw);
//       pse = projection(se);
//       var x = (pnw[0] + pse[0]) / 2;
//       var y = (pnw[1] + pse[1]) / 2;
//       translate = [width - x, height - y];

//       zoom
//         .scale(scale)
//         .translate(translate);

//       zoomed(scale, translate);
// }
