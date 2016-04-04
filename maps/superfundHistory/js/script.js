L.mapbox.accessToken = 'pk.eyJ1IjoibGlmZXdpbm5pbmciLCJhIjoiYWZyWnFjMCJ9.ksAPTz72HyEjF2AOMbRNvg';
var map = L.mapbox.map('map', 'lifewinning.map-0lnszm21', {zoomControl: false})
    .setView([37.3313,-121.9591], 11);

var ui = document.getElementById('map-ui');

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

//layer with all the buildings

function circle(l,addcolor){
    return L.circleMarker(l, {
        color: addcolor,
        fillColor: addcolor,
        fillOpacity: 0.5,
        radius: 1.5
        })
}

function popUp(f,l){
    var popUpcontent = '<h2>'+f.properties.company+'</h2>'
    l.bindPopup(popUpcontent);
    l.on('click', function(){ 
        console.log(f.properties.company,f.geometry.coordinates)
        })
    };

alexis = new L.geoJson.ajax("geojson/oldSiliconValley.geojson", {
    pointToLayer: function(feature,latlng){
        // console.log(latlng);
        return L.circleMarker(latlng, {
            color: 'darkgreen',
            fillColor: 'chartreuse',
            fillOpacity: 0.5,
            radius: 5
            })
        },
        onEachFeature: popUp
})

rwqcb_1985 = new L.geoJson.ajax("geojson/rwqcb_report_list_1985.geojson", {
    pointToLayer: function(feature,latlng){
        // console.log(latlng);
        return L.circleMarker(latlng, {
            color: 'blue',
            fillColor: 'aliceblue',
            fillOpacity: 0.5,
            radius: 5
            })
        },
        onEachFeature: popUp
})

sjmerc = new L.geoJson.ajax("geojson/sjmerc_list_02141985.geojson", {
    pointToLayer: function(feature,latlng){
        // console.log(latlng);
        return L.circleMarker(latlng, {
            color: 'red',
            fillColor: 'tomato',
            fillOpacity: 0.3,
            radius: 5
            })
        },
        onEachFeature: popUp
});
svtc = new L.geoJson.ajax("geojson/svtc_list_061987.geojson", {
    pointToLayer: function(feature,latlng){
        // console.log(latlng);
        return L.circleMarker(latlng, {
            color: 'sienna',
            fillColor: 'papayawhip',
            fillOpacity: 0.5,
            radius: 5
            })
        },
        onEachFeature: popUp
});

epa = new L.geoJson.ajax("geojson/most_recent_superfund_data.geojson", {
    pointToLayer: function(feature,latlng){
        // console.log(latlng);
        return L.circleMarker(latlng, {
            color: 'rebeccapurple',
            fillColor: 'thistle',
            fillOpacity: 0.3,
            radius: 5
            })
        },
        onEachFeature: popUp
});

//bldgs = new L.geoJson.ajax("js/bldgs.geojson",  {onEachFeature: popUp, style: bldgstyle});

//here are the sattellite layers
addLayer(alexis, '1983 Business List from Alexis', 'alexis');

addLayer(rwqcb_1985, '1985 Report by SF RWQCB', 'rwqcb_1985');
addLayer(sjmerc,'1985 San Jose Mercury News List', 'sjm_1985')
addLayer(svtc,'Slilcon Valley Toxics Coalition List, 1987', 'svtc_1987')
addLayer(epa,'Official Superfund','epa')
//this is the thing that controls all the layers, it's important
function addLayer(layer, name, id) {
    // making the circle choice a part of this function good idea or bad idea

    //generating a key of layers so viewer can select to add and remove at will
    var item = document.createElement('li');
    var link = document.createElement('a');
    var caption = document.getElementById('info');
    item.className= 'nav';
    link.href = '#';
    link.innerHTML = name;
    link.id = id;

    item.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            this.className = 'nav clearfix';
        } else {
            map.addLayer(layer);
        }
    };

    item.appendChild(link);
    ui.appendChild(item);
    var layer_ids= document.getElementsByTagName('a');
  
}

//navigation 
var pull = $('#pull');
var nav = $('#ui-info');

navHeight  = nav.height();

$(pull).on('click', function(e) {  
        e.preventDefault();  
        nav.slideToggle();  
    }); 

$(window).resize(function(){  
    var w = $(window).width();  
    if(w > 320 && nav.is(':hidden')) {  
        nav.removeAttr('style');
    }  
});  
