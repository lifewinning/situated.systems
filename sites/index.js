
var map = L.map('map', {zoomControl: false});

// var layer = Tangram.leafletLayer({
//     scene: 'scene.yaml',
//     attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
// });

// layer.addTo(map);
basemap = L.tileLayer('https://api.mapbox.com/styles/v1/lifewinning/cjgo3pxd2000w2rqnta1mx2df/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGlmZXdpbm5pbmciLCJhIjoiYWZyWnFjMCJ9.ksAPTz72HyEjF2AOMbRNvg')

basemap.addTo(map);

sitsys = L.layerGroup().addTo(map);

map.doubleClickZoom.disable();

map.setView([37.7185,-122.4350], 9);

// var hash = new L.Hash(map);

// function for zoom to bounds on sidebar click

// function to break out templates for sidebar depending on what's in the sidebar

allSites = document.querySelector('#allSites')
sidebar = document.querySelector('#sites')
desc = document.querySelector('#desc')

function clickFeature(e) {
	var layer = e.target;
	map.fitBounds(layer.getBounds());
    templates(layer.feature)
    sidebar.style.display = 'none'

}


var sitestyle = {
    "color": "#f64400",
    "weight": 3,
    "fill": false,
    "opacity": 0.7,
    "dashArray": '5, 5',
    "lineJoin": 'round'

};

var milstyle = {
    "color": "#086d93",
    "weight": 3,
    "fill": false,
    "dashArray": '5, 5',
    "opacity": 0.7
};
var sfstyle = {
    "color": "rebeccapurple",
    "weight": 3,
    "fill":false,
    "dashArray": '5, 5',
    "opacity": 1
};


function onEachFeature(feature, layer) {
layer.on({
  click: clickFeature
});
divID = layer.feature.properties.placename.replace(/ /g, '_')

sidebar = document.querySelector('#sites')
div = document.createElement('div')
div.innerHTML = layer.feature.properties.placename
div.id = divID
sidebar.appendChild(div)

div.onclick = function(){
	//console.log(layer.getBounds())
	map.fitBounds(layer.getBounds())
	desc = document.querySelector('#desc')
	//window.location.hash = encodeURIComponent(layer.feature.properties.placename)
	templates(layer.feature)
}
}

function templates(e){
	if (e.properties.photo == 'y' && e.properties.military_text != ''){
		img = e.properties.placename.replace(/ /g, '').replace("'","")
		e.img =img+'.jpg'
		temp = document.querySelector('#template-mil-img').innerHTML
		sidebar.style.display = 'none'
		Mustache.parse(temp);
		render = Mustache.render(temp, e)
		desc.innerHTML = render
	}
	else if (e.properties.military_text != '' && e.properties.img != 'y'){
		temp = document.querySelector('#template-mil').innerHTML
		sidebar.style.display = 'none'
		Mustache.parse(temp);
		render = Mustache.render(temp, e)
		desc.innerHTML = render
	}
	else if (e.properties.military_text == '' && e.properties.photo == 'y'){
		img = e.properties.placename.replace(/ /g, '').replace("'","")
		e.img =img+'.jpg'
		temp = document.querySelector('#template-img').innerHTML
		sidebar.style.display = 'none'
		Mustache.parse(temp);
		render = Mustache.render(temp, e)
		desc.innerHTML = render
	} 
	else {
		temp = document.querySelector('#template').innerHTML
		sidebar.style.display = 'none'
		Mustache.parse(temp);
		render = Mustache.render(temp, e)
		desc.innerHTML = render
	}
}

//this is the thing that controls all the layers, it's important
function addLayer(layer, id, style, divstyle) {
    //generating a key of layers so viewer can select to add and remove at will
    var item = document.querySelector('#'+id)
    item.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
    	dedupe = []
        if (sitsys.hasLayer(layer)) {
           console.log('layer visible!')
           sidebar.style.display = ''
           desc.innerHTML =''
       } else {
       		sidebar.innerHTML = ''
       		desc.innerHTML = ''
       		siteLayer = L.geoJson(layer, {onEachFeature: onEachFeature, style: style})
        	sitsys.clearLayers();
			sitsys.addLayer(siteLayer)
            sidebar.style.display = ''
            sidebar.className = divstyle
            map.fitBounds(siteLayer.getBounds())
        }
	};  
}

var xhr = new XMLHttpRequest();
	xhr.open('GET', 'joined.geojson');
	xhr.onload = function() {
	    if (xhr.status === 200) {
	        data = JSON.parse(xhr.responseText);
	        sites = L.geoJson(data, {onEachFeature: onEachFeature, style: sitestyle} )
	        sites.addTo(sitsys);
	        military = {"type": "FeatureCollection", "features":[]}
	        superfund = {"type": "FeatureCollection", "features":[]}
	        mil_list = []
	        superfund_list = []
	        sites_list = []
	        data.features.forEach(function(d){
	        	//console.log(d)
	        	if (d.properties.military == 'y'){
	        		military.features.push(d)
	        	}
	        	if (d.properties.superfund == 'y'){
	        		superfund.features.push(d)
	        	}
	        })
	       	// military_site = L.geoJson(military, {onEachFeature: onEachFeature, style: milstyle})
	        // superfund_site = L.geoJson(superfund, {onEachFeature: onEachFeature, style: sfstyle})

	        addLayer(military,'mil',milstyle, 'mil')
	        addLayer(superfund,'superfund',sfstyle,'superfund')
	        addLayer(data,'allSites', sitestyle,'sites')

	        // nice idea but come back to this later maybe
	        // ids = []
	        // if (window.location.hash){
	        // 	hash =  decodeURIComponent(window.location.hash).replace('#','')
	        // 	for (var i = data.features.length - 1; i >= 0; i--) {
	        // 		if (hash == data.features[i].properties.placename){
	        // 			coords = data.features[i].geometry.coordinates
	        // 			// christ, you really should have just done this in D3, ugh too late now
	        // 			sidebar.style.display = 'none'
	        // 			templates(data.features[i])
	        // 		}
	        // 	}
	        // }

	    }
	    else {
	        console.log('oh no what on earth happened');
	    }
	};
xhr.send();