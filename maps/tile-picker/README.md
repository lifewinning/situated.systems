# d3-vector-tiles
Adapting d3.geo.tile to show Mapzen vector tiles

Live demo: http://mapzen.github.io/d3-vector-tiles

![d3-vector-tiles-demo screenshot](https://cloud.githubusercontent.com/assets/853051/12131885/41b9ae18-b3cb-11e5-9443-d9b237576c8e.png)

## Demos

There are three demos, one per vector tile format.

* MVT - [index.html](index.html)
* TopoJSON - [topojson.html](topojson.html)
* GeoJSON - [geojson.html](geojson.html)

#### Recommended pairings

* **D3** works best with **TopoJSON** tiles
* **Tangram JS** works best with **TopoJSON** tiles
* **Tangram ES** works best with **MVT** tiles
* **Mapbox Studio** works best with **MVT** tiles

#### Format pros & cons

* **TopoJSON** tiles have comparable file size to MVT (they are compressed during server-client requests) and is better for JS based web development.
* **MVT** offers smallest absolute file size in a binary format ideally suited for mobile applications (fastest processing time in native code, slower processing time in web browsers), but hard to debug.
* **GeoJSON** is useful for debugging as it's more human readable than the other formats (not recommended for production).


### To run locally:

Download this repo, then start a web server in its directory:

    python -m SimpleHTTPServer 8000
    
If that doesn't work, try:

    python -m http.server 8000
    
Then navigate to: [http://localhost:8000](http://localhost:8000)