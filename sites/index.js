
var map = L.map('map', {zoomControl: false});

var layer = Tangram.leafletLayer({
    scene: 'scene.yaml',
    attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
});

layer.addTo(map);

map.setView([37.7185,-122.4350], 9);

// var hash = new L.Hash(map);

// function for zoom to bounds on sidebar click

// function to break out templates for sidebar depending on what's in the sidebar

allSites = document.querySelector('#allSites')
sidebar = document.querySelector('#sites')
desc = document.querySelector('#desc')
allSites.onclick = function(){ 
	sidebar.style.display = '' 
	desc.innerHTML = ''
	//map.setView([37.7185,-122.4350], 11)
}

function clickFeature(e) {
	var layer = e.target;
	map.fitBounds(layer.getBounds());
    desc.innerHTML = '<h1>'+layer.feature.properties.placename+'</h1><p>'+layer.feature.properties.text+'</p>'
    sidebar.style.display = 'none'
    //window.location.hash = encodeURIComponent(layer.feature.properties.placename)

}

var sitestyle = {
    "color": "orange",
    "weight": 3,
    "fill": false,
    "opacity": 0.7
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
	console.log(layer.getBounds())
	map.fitBounds(layer.getBounds())
	desc = document.querySelector('#desc')
	//window.location.hash = encodeURIComponent(layer.feature.properties.placename)
	templates(layer.feature)
}
}

function templates(e){
	if (e.properties.photo == 'y'){
		divID = e.properties.placename.replace(/ /g, '_')
		e.img =divID+'.jpg'
		temp = document.querySelector('#template-img').innerHTML
		sidebar.style.display = 'none'
		Mustache.parse(temp);
		render = Mustache.render(temp, e)
		desc.innerHTML = render
	} else {
		temp = document.querySelector('#template').innerHTML
		sidebar.style.display = 'none'
		Mustache.parse(temp);
		render = Mustache.render(temp, e)
		desc.innerHTML = render
	}
}

var xhr = new XMLHttpRequest();
	xhr.open('GET', 'joined.geojson');
	xhr.onload = function() {
	    if (xhr.status === 200) {
	        data = JSON.parse(xhr.responseText);
	        sites = L.geoJson(data, {onEachFeature: onEachFeature, style: sitestyle} )
	        sites.addTo(map);
	        ids = []
	        if (window.location.hash){
	        	hash =  decodeURIComponent(window.location.hash).replace('#','')
	        	for (var i = data.features.length - 1; i >= 0; i--) {
	        		if (hash == data.features[i].properties.placename){
	        			coords = data.features[i].geometry.coordinates
	        			// christ, you really should have just done this in D3, ugh too late now
	        			sidebar.style.display = 'none'
	        			templates(data.features[i])
	        		}
	        	}
	        }

	    }
	    else {
	        console.log('oh no what on earth happened');
	    }
	};
xhr.send();